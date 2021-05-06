const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.render("pages/login", { title: "Login" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/login", async (req, res) => {
  try {
    res.render("pages/login", { title: "Login" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/newUser", async (req, res) => {
  try {
    res.render("pages/newUser", { title: "Sign Up" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

//DEV FOR LOGOUT
router.get("/logout", async (req, res) => {
  try {
    res.render("pages/logout", { title: "Log Out" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
