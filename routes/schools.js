const express = require("express");
const router = express.Router();

router.get("/newSchool", async (req, res) => {
  try {
    res.render("pages/schoolAddition", { title: "Add a School" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/", async (req, res) => {
  res.render("pages/schoolSelect", { title: "Select School" });
});

module.exports = router;
