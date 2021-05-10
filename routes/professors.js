const express = require("express");
const { schoolService } = require("../services");
const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    let schoolInfo = await schoolService.getSchoolsById(req.params.schoolId);
    console.log(schoolInfo);
    req.session.currentSchoolId = req.params.schoolId;
    console.log(schoolInfo[0].professors);
    res.render("pages/professorSelect", {
      schoolName: "Professors at " + schoolInfo[0].name,
      title: "Professors",
      schoolId: req.params.schoolId,
      professors: schoolInfo[0].professors,
    });
  } catch (e) {
    res.status(404);
    console.log(e);
  }
});

router.get("/newProfessor", async (req, res) => {
  try {
    res.render("pages/professorAddition", {
      title: "Add a Professor",
      schoolId: req.params.schoolId,
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/createReview", async (req, res) => {
  try {
    res.render("pages/reviewAddition", { title: "Add a Review" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/newProfessor", async (req, res) => {
  const professorFirstName = req.body.professorFirstName;
  const professorLastName = req.body.professorLastName;
  const schoolId = req.session.currentSchoolId;
  console.log(schoolId);

  //TODO: WHEN IMPLEMENTING CLIENT-SIDE JS MAKE SURE TO CONFIRM PASSWORD 1 = PASSWORD 2

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

module.exports = router;
