const express = require("express");
const session = require("express-session");
const nocache = require("nocache");
const exphbs = require("express-handlebars");
const configRoutes = require("./routes");

const PORT = 3000;

const app = express();

app.use(nocache());
app.use("/public", express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

configRoutes(app);

app.listen(PORT, () =>
  console.log(`Server listening for requests on port ${PORT}`)
);
