const express = require("express");
const router = express.Router();

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

module.exports = router;
