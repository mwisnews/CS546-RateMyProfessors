const ObjectId = require("mongodb").ObjectID;

const isNonEmptyString = (str) =>
  str && typeof str === "string" && str.trim().length > 0;
const isValidEmail = (str) =>
  str && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str);
const isValidId = (id) => Boolean(id);
//const isValidIds = (userIds) => userIds && Array.isArray(userIds) && userIds.length;
const isValidIArray = (str) => Array.isArray(str) && str.length;
const isValidObjectId = (id) => ObjectId(id.toString());
const isValidNumber = (num) => num && typeof num === "number";
const isValidRating = (num) =>
  num && typeof num === "number" && (num > 0) & (num <= 5);
const isValidZipcode = (num) =>
  num && /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(num) && typeof num === "number";

const addUser = (firstName, lastName, password, email) => {
  console.log("In addUser Validation Start");
  const errors = [];
  if (!isNonEmptyString(firstName))
    errors.push("First Name must be a non-empty string!");
  if (!isNonEmptyString(lastName))
    errors.push("Last Name must be a non-empty string!");
  if (!isNonEmptyString(password))
    errors.push("Password must be a non-empty string!");
  if (!isValidEmail(email))
    errors.push("You have entered an invalid email address!");
  if (errors.length) throw errors;
  console.log("In addUser Validation End");
};

const removeUser = (id) => {
  console.log("In removeUser Validation Start");
  const errors = [];
  if (!isValidId(id)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(id)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In removeUser Validation End");
};

const getUsersById = (userId) => {
  console.log("In getUsersById Validation Start");
  // console.log(userId);
  // console.log(typeof userId);
  const errors = [];
  // if (!isValidIds(userIds)) errors.push("You must provide valid ID!");
  if (!isValidId(userId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In getUsersById Validation End");
};

const checkLogin = (email, password) => {
  console.log("In checkLogin Validation Start");
  const errors = [];
  if (!isValidEmail(email))
    errors.push("You have entered an invalid email address!");
  if (!isNonEmptyString(password))
    errors.push("Password must be a non-empty string!");
  if (errors.length) throw errors;
  console.log("In checkLogin Validation End");
};

const addReviewToUser = (userId, reviewId) => {
  console.log("In addReviewToUser Validation Start");
  const errors = [];
  if (!isValidId(userId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object ID!");
  if (!isValidId(reviewId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(reviewId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In addReviewToUser Validation End");
};

const deleteReviewFromUser = (userId, reviewId) => {
  console.log("In deleteReviewFromUser Validation Start");
  const errors = [];
  if (!isValidId(userId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object ID!");
  if (!isValidId(reviewId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(reviewId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In deleteReviewFromUser Validation End");
};

const getAllReviewsIdsMadeByUsers = (userId) => {
  console.log("In getAllReviewsIdsMadeByUsers Validation Start");
  const errors = [];
  if (!isValidIds(userId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In getAllReviewsIdsMadeByUsers Validation End");
};

const getAllReviewsContentMadeByUsers = (userId) => {
  console.log("In getAllReviewsContentMadeByUsers Validation Start");
  const errors = [];
  if (!isValidIds(userId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In getAllReviewsContentMadeByUsers Validation End");
};

const addSchoolToUser = (userId, schoolId) => {
  console.log("In addSchoolToUser Validation Start");
  const errors = [];
  if (!isValidId(userId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object ID!");
  if (!isValidId(schoolId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In addSchoolToUser Validation End");
};

const deleteSchoolFromUser = (userId, schoolId) => {
  console.log("In deleteSchoolFromUser Validation Start");
  const errors = [];
  if (!isValidId(schoolId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid Object ID!");
  if (!isValidId(userId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In deleteSchoolFromUser Validation End");
};

const getAllSchoolsAddedByUsers = (userId) => {
  console.log("In getAllSchoolsAddedByUsers Validation Start");
  const errors = [];
  if (!isValidIds(userId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In getAllSchoolsAddedByUsers Validation End");
};

const getUserIdWhoAddedSchoolId = (schoolId) => {
  console.log("In getUserIdWhoAddedSchoolId Validation Start");
  const errors = [];
  if (!isValidId(schoolId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In getUserIdWhoAddedSchoolId Validation End");
};

const addCommentToUser = (userId, commentId) => {
  console.log("In addCommentToUser Validation Start");
  const errors = [];
  if (!isValidId(userId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object ID!");
  if (!isValidId(commentId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(commentId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In addCommentToUser Validation End");
};

const deleteCommentFromUser = (userId, commentId) => {
  console.log("In deleteCommentFromUser Validation Start");
  const errors = [];
  if (!isValidId(userId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object ID!");
  if (!isValidId(commentId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(commentId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In deleteCommentFromUser Validation End");
};

const getAllCommentsLeftByUsers = (userId) => {
  console.log("In getAllCommentsLeftByUsers Validation Start");
  const errors = [];
  if (!isValidIds(userId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In getAllCommentsLeftByUsers Validation End");
};

module.exports = {
  addUser,
  removeUser,
  getUsersById,
  checkLogin,
  addReviewToUser,
  deleteReviewFromUser,
  getAllReviewsIdsMadeByUsers,
  getAllReviewsContentMadeByUsers,
  addSchoolToUser,
  deleteSchoolFromUser,
  getAllSchoolsAddedByUsers,
  getUserIdWhoAddedSchoolId,
  addCommentToUser,
  deleteCommentFromUser,
  getAllCommentsLeftByUsers,
};
