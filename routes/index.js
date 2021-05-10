const loginRoutes = require("./login");
const schoolRoutes = require("./schools");
const professorRoutes = require("./professors");

const constructorMethod = (app) => {
  app.use("/", loginRoutes);
  app.use("/schools", schoolRoutes);
  app.use("/professors", professorRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
