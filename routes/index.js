const loginRoutes = require("./login");
const schoolRoutes = require("./schools");

const constructorMethod = (app) => {
  app.use("/", loginRoutes);
  app.use("/schools", schoolRoutes);

  app.use("*", (req, res) => {
    res.status(404).render("pages/404", { message: "Not found" });
  });
};

module.exports = constructorMethod;
