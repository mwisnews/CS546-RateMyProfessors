const express = require("express");
const router = express.Router();
const { schoolService } = require("../services");

router.get("/newSchool", async (req, res) => {
  try {
    res.render("pages/schoolAddition", { title: "Add a School" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/newSchool", async (req, res) => {
  const schoolName = req.body.schoolName;
  const educationLevel = req.body.educationLevel;
  const schoolCity = req.body.schoolCity;
  const schoolState = req.body.schoolState;
  const schoolZipCode = req.body.schoolZipCode;
  const userID = req.session.user._id;

  //TODO: WHEN IMPLEMENTING CLIENT-SIDE JS MAKE SURE TO CONFIRM PASSWORD 1 = PASSWORD 2

  try {
    const addedSchoolStatus = await schoolService.addSchool(
      schoolName,
      educationLevel,
      schoolCity,
      schoolState,
      schoolZipCode,
      userID
    );

    if (addedSchoolStatus === true) {
      res.redirect("/");
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(401).render("pages/schoolAddition", {
      title: "Add a School",
      error: true,
    });
  }
});

router.get("/", async (req, res) => {
  let schools;

  try {
    schools = await schoolService.getAllSchools();
  } catch (e) {
    schools = [];
  }

  res.render("pages/schoolSelect", {
    title: "Select School",
    schools,
    schoolName: "",
  });
});

router.post("/", async (req, res) => {
  let schools;

  try {
    schools = await schoolService.getAllSchools();
  } catch (e) {
    schools = [];
  }

  const schoolName = req.body.schoolName || "";
  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().startsWith(schoolName.toLowerCase())
  );

  res.render("pages/schoolSelect", {
    title: "Select School",
    schools: filteredSchools,
    schoolName,
  });
});

module.exports = router;
