const ObjectId = require("mongodb").ObjectID;

const isNonEmptyString = (str) =>
  str && typeof str === "string" && str.trim().length > 0;
const isValidEmail = (str) =>
  str && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str);
const isValidId = (id) => Boolean(id);
const isValidIds = (userIds) =>
  userIds && Array.isArray(userIds) && userIds.length;
const isValidIArray = (str) => Array.isArray(str) && str.length;
const isValidObjectId = (id) => ObjectId(id.toString());
const isValidNumber = (num) => num && typeof num === "number";
const isValidRating = (num) =>
  num && typeof num === "number" && (num > 0) & (num <= 5);
const isValidZipcode = (num) =>
  num && /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(num) && typeof num === "number";

const addSchool = (name, educationLevel, city, state, zipcode, addedBy) => {
  console.log("In addSchool Validation Start");
  const errors = [];
  if (!isNonEmptyString(name)) errors.push("Name must be a non-empty string!");
  if (!isNonEmptyString(educationLevel))
    errors.push("Education Level must be a non-empty string!");
  if (!isNonEmptyString(city)) errors.push("City must be a non-empty string!");
  if (!isNonEmptyString(state))
    errors.push("State must be a non-empty string!");
  if (!isNonEmptyString(zipcode))
    errors.push("Zipcode must be a non-empty string!");
  if (!isValidId(addedBy)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(addedBy)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In addSchool Validation End");
};

const removeSchool = (schoolId) => {
  console.log("In removeSchool Validation Start");
  const errors = [];
  if (!isValidId(schoolId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In removeSchool Validation End");
};

const getSchoolsById = (schoolId) => {
  console.log("In getSchoolsById Validation Start");
  const errors = [];
  if (Array.isArray(schoolId))
    if (!isValidIds(schoolId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In getSchoolsById Validation End");
};

const addProfessorToSchool = (firstName, lastName, schoolId) => {
  console.log("In addProfessorToSchool Validation Start");
  const errors = [];
  if (!isNonEmptyString(firstName))
    errors.push("First Name must be a non-empty string!");
  if (!isNonEmptyString(lastName))
    errors.push("Last Name must be a non-empty string!");
  if (!isValidId(schoolId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In addProfessorToSchool Validation End");
};

const removeProfessorFromSchool = (schoolId, professorId) => {
  console.log("In removeProfessorFromSchool Validation Start");
  const errors = [];
  if (!isValidId(schoolId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid Object ID!");
  if (!isValidId(professorId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(professorId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In removeProfessorFromSchool Validation End");
};

const getAllProfessorsFromSchool = (schoolId) => {
  console.log("In getAllProfessorsFromSchool Validation Start");
  const errors = [];
  if (!isValidId(schoolId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In getAllProfessorsFromSchool Validation End");
};

const getProfessorsById = (professorId) => {
  console.log("In getProfessorsById Validation Start");
  const errors = [];
  if (Array.isArray(professorId))
    if (!isValidIds(professorId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(professorId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In getProfessorsById Validation End");
};

const addReviewToProfessor = (
  rating,
  difficulty,
  course,
  review,
  date,
  professorId,
  schoolId
) => {
  console.log("In addReviewToProfessor Validation Start");
  const errors = [];
  if (!isValidRating(rating))
    errors.push("Rating must be a number between 1 and 5!");
  if (!isValidRating(difficulty))
    errors.push("Difficulty must be a number between 1 and 5!");
  if (!isNonEmptyString(course))
    errors.push("Courses must be a non-empty string!");
  if (!isNonEmptyString(review))
    errors.push("Review must be a non-empty string!");
  // Date
  if (!isValidId(professorId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(professorId)) errors.push("Invalid Object ID!");
  if (!isValidId(schoolId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In addReviewToProfessor Validation End");
};

const removeReviewFromProfessor = (professorId, reviewId) => {
  console.log("In removeReviewFromProfessor Validation Start");
  const errors = [];
  if (!isValidId(professorId))
    errors.push("You must provide valid professor ID!");
  if (!isValidObjectId(professorId))
    errors.push("Invalid Professor Object ID!");
  if (!isValidId(reviewId)) errors.push("You must provide valid Review ID!");
  if (!isValidObjectId(reviewId)) errors.push("Invalid Object Review ID!");
  if (errors.length) throw errors;
  console.log("In removeReviewFromProfessor Validation End");
};

const getReviewsById = (userId) => {
  console.log("In getReviewsById Validation Start");
  const errors = [];
  if (Array.isArray(userId))
    if (!isValidIds(userId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In getReviewsById Validation End");
};

const addThumbsUpToReview = async (schoolId, professorId, reviewId, userId) => {
  console.log("In addThumbsUpToReview Validation Start");
  const errors = [];
  if (!isValidId(schoolId)) errors.push("You must provide valid Review ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid Object Review ID!");
  if (!isValidId(professorId))
    errors.push("You must provide valid professor ID!");
  if (!isValidObjectId(professorId))
    errors.push("Invalid Professor Object ID!");
  if (!isValidId(reviewId)) errors.push("You must provide valid Review ID!");
  if (!isValidObjectId(reviewId)) errors.push("Invalid Object Review ID!");
  if (!isValidId(userId)) errors.push("You must provide valid User ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object User ID!");
  if (errors.length) throw errors;
  console.log("In addThumbsUpToReview Validation End");
};

const removeThumbsUpFromReview = async (
  schoolId,
  professorId,
  reviewId,
  userId
) => {
  console.log("In removeThumbsUpFromReview Validation Start");
  const errors = [];
  if (!isValidId(schoolId)) errors.push("You must provide valid Review ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid Object Review ID!");
  if (!isValidId(professorId))
    errors.push("You must provide valid professor ID!");
  if (!isValidObjectId(professorId))
    errors.push("Invalid Professor Object ID!");
  if (!isValidId(reviewId)) errors.push("You must provide valid Review ID!");
  if (!isValidObjectId(reviewId)) errors.push("Invalid Object Review ID!");
  if (!isValidId(userId)) errors.push("You must provide valid User ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object User ID!");
  if (errors.length) throw errors;
  console.log("In removeThumbsUpFromReview Validation End");
};

const addThumbsDownToReview = async (
  schoolId,
  professorId,
  reviewId,
  userId
) => {
  console.log("In addThumbsDownToReview Validation Start");
  const errors = [];
  if (!isValidId(schoolId)) errors.push("You must provide valid Review ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid Object Review ID!");
  if (!isValidId(professorId))
    errors.push("You must provide valid professor ID!");
  if (!isValidObjectId(professorId))
    errors.push("Invalid Professor Object ID!");
  if (!isValidId(reviewId)) errors.push("You must provide valid Review ID!");
  if (!isValidObjectId(reviewId)) errors.push("Invalid Object Review ID!");
  if (!isValidId(userId)) errors.push("You must provide valid User ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object User ID!");
  if (errors.length) throw errors;
  console.log("In addThumbsDownToReview Validation End");
};

const removeThumbsDownFromReview = async (
  schoolId,
  professorId,
  reviewId,
  userId
) => {
  console.log("In removeThumbsDownFromReview Validation Start");
  const errors = [];
  if (!isValidId(schoolId)) errors.push("You must provide valid Review ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid Object Review ID!");
  if (!isValidId(professorId))
    errors.push("You must provide valid professor ID!");
  if (!isValidObjectId(professorId))
    errors.push("Invalid Professor Object ID!");
  if (!isValidId(reviewId)) errors.push("You must provide valid Review ID!");
  if (!isValidObjectId(reviewId)) errors.push("Invalid Object Review ID!");
  if (!isValidId(userId)) errors.push("You must provide valid User ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object User ID!");
  if (errors.length) throw errors;
  console.log("In removeThumbsDownFromReview Validation End");
};

const addCommentToReview = (
  date,
  text,
  schoolId,
  professorId,
  reviewId,
  userId
) => {
  const errors = [];
  if (!isNonEmptyString(text)) errors.push("Text must be a non-empty string!");
  if (!isValidId(schoolId.toString()))
    errors.push("You must provide valid School ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid School Object ID!");
  if (!isValidId(professorId.toString()))
    errors.push("You must provide valid professor ID!");
  if (!isValidObjectId(professorId))
    errors.push("Invalid Professor Object ID!");
  if (!isValidId(reviewId.toString()))
    errors.push("You must provide valid Review ID!");
  if (!isValidObjectId(reviewId)) errors.push("Invalid Object Review ID!");
  if (!isValidId(userId.toString()))
    errors.push("You must provide valid User ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object User ID!");
  if (errors.length) throw errors;
  console.log("In addCommentToReview Validation End");
};

const removeCommentFromReview = (
  schoolId,
  professorId,
  reviewId,
  commentId
) => {
  console.log("In removeCommentFromReview Validation Start");
  const errors = [];
  if (!isValidId(schoolId)) errors.push("You must provide valid professor ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid School Object ID!");
  if (!isValidId(professorId))
    errors.push("You must provide valid professor ID!");
  if (!isValidObjectId(professorId))
    errors.push("Invalid Professor Object ID!");
  if (!isValidId(reviewId)) errors.push("You must provide valid Review ID!");
  if (!isValidObjectId(reviewId)) errors.push("Invalid Object Review ID!");
  if (!isValidId(commentId)) errors.push("You must provide valid User ID!");
  if (!isValidObjectId(commentId)) errors.push("Invalid Object User ID!");
  if (errors.length) throw errors;
  console.log("In removeCommentFromReview Validation End");
};

const getCommentsById = (commentId) => {
  console.log("In getCommentsById Validation Start");
  const errors = [];
  if (Array.isArray(commentId))
    if (!isValidIds(commentId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(commentId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In getCommentsById Validation End");
};

module.exports = {
  addSchool,
  removeSchool,
  getSchoolsById,
  addProfessorToSchool,
  removeProfessorFromSchool,
  getAllProfessorsFromSchool,
  getProfessorsById,
  addReviewToProfessor,
  removeReviewFromProfessor,
  getReviewsById,
  addThumbsUpToReview,
  removeThumbsUpFromReview,
  addThumbsDownToReview,
  removeThumbsDownFromReview,
  addCommentToReview,
  removeCommentFromReview,
  getCommentsById,
};
