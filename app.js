const express = require("express");
const app = express();
const configRoutes = require("./routes");
const PORT = 3000;
const exphbs = require("express-handlebars");
const static = express.static(__dirname + "/public");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(PORT, () =>
  console.log(`Server listening for requests on port ${PORT}`)
);
