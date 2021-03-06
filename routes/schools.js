const express = require("express");
const router = express.Router({ mergeParams: true });
const { schoolService } = require("../services");
const professorRoutes = require("./professors");
const validation = require("../Validation/schoolServices");

const trim = (str) => (str || "").trim();

router.get("/newSchool", async (req, res) => {
  try {
    res.render("pages/schoolAddition", { title: "Add a School" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/newSchool", async (req, res) => {
  const schoolName = trim(req.body.schoolName);
  const educationLevel = trim(req.body.educationLevel);
  const schoolCity = trim(req.body.schoolCity);
  const schoolState = trim(req.body.schoolState);
  const schoolZipCode = trim(req.body.schoolZipCode);
  const userID = req.session.user._id;

  try {
    validation.addSchool(
      schoolName,
      educationLevel,
      schoolCity,
      schoolState,
      schoolZipCode,
      userID
    );
  } catch (errorArr) {
    res.status(400).render("pages/schoolAddition", {
      title: "Add a School",
      schoolName,
      educationLevel,
      schoolCity,
      schoolState,
      schoolZipCode,
      error: errorArr.join(", "),
    });
    return;
  }

  try {
    const { insertedId, duplicateSchool } = await schoolService.addSchool(
      schoolName,
      educationLevel,
      schoolCity,
      schoolState,
      schoolZipCode,
      userID
    );

    if (duplicateSchool) throw ["School already exists"];

    res.redirect(`/schools/${insertedId}/professors`);
  } catch (errorArr) {
    res.status(400).render("pages/schoolAddition", {
      title: "Add a School",
      schoolName,
      educationLevel,
      schoolCity,
      schoolState,
      schoolZipCode,
      error: errorArr.join(", "),
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

router.use("/:schoolId/professors", async (req, res, next) => {
  try {
    let schoolInfo = await schoolService.getSchoolsById(req.params.schoolId);

    if (schoolInfo.length) {
      next();
      return;
    }
  } catch (e) {}

  res.status(404).render("pages/404", {
    message: "School not found",
  });
});

router.post("/:schoolId/professors", async (req, res) => {
  let schoolInfo;
  let professors;

  try {
    schoolInfo = await schoolService.getSchoolsById(req.params.schoolId);
    professors = await schoolService.getAllProfessorsFromSchool(
      req.params.schoolId
    );
  } catch (e) {
    professors = [];
  }

  const professorName = trim(req.body.professorName);
  const filteredProfessors = professors.filter(
    (proff) =>
      proff.firstName.toLowerCase().startsWith(professorName.toLowerCase()) ||
      proff.lastName.toLowerCase().startsWith(professorName.toLowerCase())
  );

  res.render("pages/professorSelect", {
    schoolName: "Professors at " + schoolInfo[0].name,
    title: "Professors",
    schoolId: req.params.schoolId,
    professors: filteredProfessors,
    professorName,
  });
});

router.use("/:schoolId/professors", professorRoutes);

module.exports = router;
