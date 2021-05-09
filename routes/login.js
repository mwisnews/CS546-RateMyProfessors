const express = require("express");
const { userService } = require("../services");

const router = express.Router();

router.get("/", async (req, res) => res.redirect("/login"));

router.get("/login", async (req, res) => {
  if (req.session.user) {
    // user is already logged in, let's redirect them to
    // the schools page
    res.redirect("/schools");
    return;
  }

  try {
    res.render("pages/login", { title: "Login" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.get("/newUser", async (req, res) => {
  if (req.session.user) {
    // user is already logged in, let's redirect them to
    // the schools page
    res.redirect("/schools");
    return;
  }

  try {
    res.render("pages/newUser", { title: "Sign Up" });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const result = await userService.checkLogin(username, password);

    if (typeof result === "object") {
      req.session.user = result;
      res.redirect("/schools");
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(401).render("pages/login", {
      title: "Login",
      username,
      password,
      error: true,
    });
  }
});

router.use(async (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
});

//DEV FOR LOGOUT
router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.render("pages/logout", { title: "Log Out" });
});

module.exports = router;
