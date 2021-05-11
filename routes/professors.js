const express = require("express");
const { schoolService } = require("../services");
const router = express.Router({ mergeParams: true });

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

    res.render("pages/professorDetails", {
      firstName: professorInfo[0].firstName,
      lastName: professorInfo[0].lastName,
      title: professorInfo[0].lastName + ", " + professorInfo[0].firstName,
      professorId: professorInfo[0]._id,
      schoolId: professorInfo[0].schoolId,
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
  const professorFirstName = req.body.professorFirstName;
  const professorLastName = req.body.professorLastName;
  const schoolId = req.session.currentSchoolId;

  try {
    const addedProfessorsStatus = await schoolService.addProfessorToSchool(
      professorFirstName,
      professorLastName,
      schoolId
    );
    console.log(addedProfessorsStatus);

    if (addedProfessorsStatus.isProfessorAdded === true) {
      res.redirect(
        "/schools/" + schoolId + "/professors/" + addedProfessorsStatus.id
      );
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(401).render("pages/ProfessorAddition", {
      title: "Add a School",
      error: true,
    });
  }
});

router.post("/:professorId/createReview", async (req, res) => {
  const professorId = req.params.professorId;
  const schoolId = req.params.schoolId;
  const userId = req.session.user._id;
  try {
    const rating = trim(req.body.reviewRating);
    const difficulty = trim(req.body.reviewDifficulty);
    const course = trim(req.body.courseName);
    const review = trim(req.body.reviewText);
    const date = new Date();

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
    console.log(addedReviewStatus);

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

module.exports = router;
