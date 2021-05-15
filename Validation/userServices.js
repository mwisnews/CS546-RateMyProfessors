const ObjectId = require("mongodb").ObjectID;

const isNonEmptyString = (str) =>
  str && typeof str === "string" && str.trim().length > 0;
const isValidEmail = (str) =>
  str && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str);
const isValidId = (id) => Boolean(id);
const isValidIds = (userIds) =>
  userIds && Array.isArray(userIds) && userIds.length;
const isValidObjectId = (id) => ObjectId(id.toString());

const addUser = (firstName, lastName, email, password, passwordConfirm) => {
  console.log("addUser() Validation Start");
  const errors = [];
  if (!isNonEmptyString(firstName))
    errors.push("First Name must be a non-empty string!");
  if (!isNonEmptyString(lastName))
    errors.push("Last Name must be a non-empty string!");
  if (!isValidEmail(email))
    errors.push("You have entered an invalid email address!");
  if (!isNonEmptyString(password))
    errors.push("Password must be a non-empty string!");
  if (password !== passwordConfirm) errors.push("Passwords do not match!");
  if (errors.length) throw errors;
  console.log("addUser() Validation End");
};

const addUserBE = (firstName, lastName, password, email) => {
  console.log("addUser() Validation Start");
  const errors = [];
  if (!isNonEmptyString(firstName))
    errors.push("First Name must be a non-empty string!");
  if (!isNonEmptyString(lastName))
    errors.push("Last Name must be a non-empty string!");
  if (!isValidEmail(email))
    errors.push("You have entered an invalid email address!");
  if (!isNonEmptyString(password))
    errors.push("Password must be a non-empty string!");
  if (errors.length) throw errors;
  console.log("addUser() Validation End");
};

const removeUser = (id) => {
  console.log("removeUser() Validation Start");
  const errors = [];
  if (!isValidId(id)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(id)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("removeUser() Validation End");
};

const getUsersById = (userId) => {
  console.log("getUserById() Validation Start");
  const errors = [];
  if (!isValidId(userId)) errors.push("You must provide valid ID");
  if (!isValidObjectId(userId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("getUserById() Validation End");
};

const checkLogin = (email, password) => {
  console.log("In checkLogin Validation Start");
  const errors = [];
  if (!isValidEmail(email)) errors.push("Invalid Email!");
  if (!isNonEmptyString(password))
    errors.push("Password must be a non-empty string!");
  if (errors.length) throw errors;
  console.log("In checkLogin Validation End");
};

module.exports = {
  addUser,
  addUserBE,
  removeUser,
  getUsersById,
  checkLogin,
};
