const express = require("express");
const { schoolService } = require("../services");
const router = express.Router({ mergeParams: true });
const validation = require("../Validation/schoolServices");

const trim = (str) => (str || "").trim();

router.get("/", async (req, res) => {
  try {
    let schoolInfo = await schoolService.getSchoolsById(req.params.schoolId);
    req.session.currentSchoolId = req.params.schoolId;
    res.render("pages/professorSelect", {
      schoolName: "Professors at " + schoolInfo[0].name,
      title: "Professors",
      schoolId: req.params.schoolId,
      professors: schoolInfo[0].professors,
    });
  } catch (e) {
    res.status(404);
  }
});

router.get("/newProfessor", async (req, res) => {
  try {
    res.render("pages/professorAddition", {
      title: "Add a Professor",
      schoolId: req.params.schoolId,
    });
  } catch (e) {
    res.sendStatus(500);
  }
});

router.get("/:professorId", async (req, res) => {
  try {
    let professorInfo = await schoolService.getProfessorsById(
      req.params.professorId
    );

    if (!professorInfo.length) {
      res.status(404).render("pages/404", {
        message: "Professor not found",
      });
      return;
    }
    let averageDifficulty = 0;
    if (professorInfo[0].reviews !== undefined) {
      for (i = 0; i < professorInfo[0].reviews.length; i++) {
        let review = professorInfo[0].reviews[i];

        averageDifficulty += Number.parseFloat(review.difficulty);

        review.disableThumbsUp = (review.thumbsUp || []).length > 0;
        review.disableThumbsDown = (review.thumbsDown || []).length > 0;
      }

      averageDifficulty /= professorInfo[0].reviews.length;
      averageDifficulty = averageDifficulty.toFixed(2).toString();
    }

    res.render("pages/professorDetails", {
      firstName: professorInfo[0].firstName,
      lastName: professorInfo[0].lastName,
      title: professorInfo[0].lastName + ", " + professorInfo[0].firstName,
      professorId: professorInfo[0]._id,
      schoolId: professorInfo[0].schoolId,
      reviews: professorInfo[0].reviews,
      overallRating: professorInfo[0].overallRating.toFixed(2),
      numberOfReviews: professorInfo[0].numberOfReviews,
      averageDifficulty: averageDifficulty,
      error: req.body.error,
    });
  } catch (e) {
    res.status(404);
  }
});

router.get("/:professorId/createReview", async (req, res) => {
  try {
    let professorId = req.params.professorId;
    let schoolId = req.params.schoolId;
    res.render("pages/reviewAddition", {
      title: "Add a Review",
      professorId: professorId,
      schoolId: schoolId,
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/newProfessor", async (req, res) => {
  const professorFirstName = trim(req.body.professorFirstName);
  const professorLastName = trim(req.body.professorLastName);
  const schoolId = req.session.currentSchoolId;

  try {
    validation.addProfessorToSchool(professorFirstName, professorLastName);
  } catch (e) {
    res.status(400).json({ error: e.join(", ") });
    return;
  }

  try {
    const addedProfessorsStatus = await schoolService.addProfessorToSchool(
      professorFirstName,
      professorLastName,
      schoolId
    );

    if (addedProfessorsStatus.isProfessorAdded === true) {
      res.json({
        redirect:
          "/schools/" + schoolId + "/professors/" + addedProfessorsStatus.id,
      });
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(401).json({ error: "Could not add professor" });
  }
});

router.post("/:professorId/createReview", async (req, res) => {
  const professorId = req.params.professorId;
  const schoolId = req.params.schoolId;
  const userId = req.session.user._id;
  const rating = parseFloat(trim(req.body.reviewRating));
  const difficulty = parseFloat(trim(req.body.reviewDifficulty));
  const course = trim(req.body.courseName);
  const review = trim(req.body.reviewText);
  const date = new Date();

  try {
    validation.addReviewToProfessor(
      rating,
      difficulty,
      course,
      review,
      date,
      professorId,
      schoolId,
      userId
    );
  } catch (errorArr) {
    res.status(400).render("pages/reviewAddition", {
      title: "Add a Review",
      professorId: professorId,
      schoolId: schoolId,
      error: errorArr.join(", "),
      rating,
      difficulty,
      course,
      review,
    });
    return;
  }

  try {
    const addedReviewStatus = await schoolService.addReviewToProfessor(
      rating,
      difficulty,
      course,
      review,
      date,
      professorId,
      schoolId,
      userId
    );

    if (addedReviewStatus === true) {
      res.redirect(`/schools/${schoolId}/professors/${professorId}`);
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(401).render("pages/reviewAddition", {
      title: "Add a Review",
      professorId: professorId,
      schoolId: schoolId,
      error: true,
    });
  }
});

router.post("/:professorId/:reviewId", async (req, res) => {
  const professorId = req.params.professorId;
  const schoolId = req.params.schoolId;
  const userId = req.session.user._id;
  const reviewId = req.params.reviewId;
  try {
    const commentText = trim(req.body.commentsField);
    const date = new Date();

    const addedReviewStatus = await schoolService.addCommentToReview(
      date,
      commentText,
      schoolId,
      professorId,
      reviewId,
      userId
    );
    console.log(addedReviewStatus);

    if (addedReviewStatus === true) {
      res.redirect(`/schools/${schoolId}/professors/${professorId}`);
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(401).render("pages/professorDetails", {
      title: "Please Try Again",
      professorId: professorId,
      schoolId: schoolId,
      error: true,
    });
  }
});

router.post("/:professorId/:reviewId/thumbs-up", async (req, res) => {
  let thumbsUpAdded;

  try {
    thumbsUpAdded = await schoolService.addThumbsUpToReview(
      req.params.schoolId,
      req.params.professorId,
      req.params.reviewId,
      req.session.user._id
    );
  } catch (err) {}

  if (!thumbsUpAdded) req.body.error = "Could not like review";

  res.redirect(
    `/schools/${req.params.schoolId}/professors/${req.params.professorId}`
  );
});

router.post("/:professorId/:reviewId/thumbs-down", async (req, res) => {
  let thumbsDownAdded;

  try {
    thumbsDownAdded = await schoolService.addThumbsDownToReview(
      req.params.schoolId,
      req.params.professorId,
      req.params.reviewId,
      req.session.user._id
    );
  } catch (err) {}

  if (!thumbsDownAdded) req.body.error = "Could not like review";

  res.redirect(
    `/schools/${req.params.schoolId}/professors/${req.params.professorId}`
  );
});

module.exports = router;
