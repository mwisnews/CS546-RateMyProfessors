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
