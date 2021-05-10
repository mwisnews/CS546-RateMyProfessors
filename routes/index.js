const loginRoutes = require("./login");
const schoolRoutes = require("./schools");

const constructorMethod = (app) => {
  app.use("/", loginRoutes);
  app.use("/schools", schoolRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
