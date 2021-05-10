const express = require("express");
const { userService } = require("../services");
const validation = require("../Validation/userServices");
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

router.post("/newUser", async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const dateJoined = new Date();

  try {
    validation.addUser(firstName, lastName, email, password, passwordConfirm);
  } catch (errorArr) {
    res.status(400).render("pages/newUser", {
      title: "Sign Up",
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
      error: errorArr.join(", "),
    });
    return;
  }

  try {
    const addedUserStatus = await userService.addUser(
      firstName,
      lastName,
      password,
      email,
      dateJoined
    );

    if (addedUserStatus.isInserted === true) {
      const user = await userService.checkLogin(email, password);
      req.session.user = user;
      res.redirect("/schools");
      return;
    } else {
      if (addedUserStatus.alreadyExists === true) {
        res.render("pages/newUser", {
          title: "Sign Up",
          firstName,
          lastName,
          email,
          password,
          passwordConfirm,
          error: "Email is already linked to an account",
        });
        return;
      }
      throw new Error();
    }
  } catch (err) {
    res.status(500).render("pages/newUser", {
      title: "New User",
      title: "Sign Up",
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
      error: "An error has occurred. Account not created",
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
