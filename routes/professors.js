const express = require("express");
const router = express.Router();
const { schoolService } = require("../services");

router.get("/newProfessor", async (req, res) => {
  try {
    res.render("pages/professorAddition", { title: "Add a Professor" });
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
    const addedSchoolStatus = await schoolService.addProfessorToSchool(
      professorFirstName,
      professorLastName,
      schoolId
    );

    if (addedSchoolStatus === true) {
      res.redirect("/schools/" + schoolId);
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
