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

  console.log(schoolName);
  console.log(educationLevel);
  console.log(schoolCity);
  console.log(schoolState);
  console.log(schoolZipCode);
  console.log(req);

  //TODO: WHEN IMPLEMENTING CLIENT-SIDE JS MAKE SURE TO CONFIRM PASSWORD 1 = PASSWORD 2
  /*
  try {
    const addedUserStatus = await userService.addUser(
      firstName,
      lastName,
      password,
      email,
      dateJoined
    );

    if (addedUserStatus.isInserted === true) {
      res.redirect("/login");
    } else {
      if (addedUserStatus.alreadyExists === true) {
        res.render("pages/newUser", {
          title: "Sign Up",
          error: true,
          alreadyExists: true,
        });
      }
      throw new Error();
    }
  } catch (err) {
    res.status(401).render("pages/newUser", {
      title: "New User",
      error: true,
    });
  }
  */
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
