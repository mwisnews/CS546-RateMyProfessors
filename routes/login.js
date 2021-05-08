const express = require("express");
const { userService } = require("../services");

const router = express.Router();

router.get("/", async (req, res) => res.redirect("/login"));

router.get("/login", async (req, res) => {
  if (req.session.authenticated) {
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
  if (req.session.authenticated) {
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
    const authenticationStatus = await userService.checkLogin(
      username,
      password
    );

    if (authenticationStatus === 1) {
      req.session.authenticated = true;
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

  //TODO: WHEN IMPLEMENTING CLIENT-SIDE JS MAKE SURE TO CONFIRM PASSWORD 1 = PASSWORD 2

  if (password !== passwordConfirm) {
    res.status(400).render("pages/newUser", {
      title: "Sign Up",
      error: true,
      notMatchingPasswords: true,
    });
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
});

router.use(async (req, res, next) => {
  if (!req.session.authenticated) {
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
