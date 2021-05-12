const ObjectId = require("mongodb").ObjectID;

const isNonEmptyString = (str) =>
  str && typeof str === "string" && str.trim().length > 0;
const isValidEmail = (str) =>
  str && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(str);
const isValidId = (id) => id && typeof id === "string" && id.trim().length > 0;
const isValidIds = (userIds) =>
  userIds && Array.isArray(userIds) && userIds.length;
const isValidIArray = (str) => Array.isArray(str) && str.length;
const isValidObjectId = (id) => ObjectId(id);
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

const getSchoolsById = (schoolIds) => {
  console.log("In getSchoolsById Validation Start");
  const errors = [];
  if (!isValidIds(schoolIds)) errors.push("You must provide valid ID!");
  for (let i = 0; i < schoolIds.length; i++)
    if (!(typeof schoolIds[i] === "string") || !schoolIds[i].trim().length > 0)
      errors.push("You must provide valid ID!");
  if (!isValidObjectId(schoolIds[i])) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In getSchoolsById Validation End");
};

const addProfessorToSchool = (firstName, lastName) => {
  console.log("In addProfessorToSchool Validation Start");
  const errors = [];
  if (!isNonEmptyString(firstName))
    errors.push("First Name must be a non-empty string!");
  if (!isNonEmptyString(lastName))
    errors.push("Last Name must be a non-empty string!");
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

const getProfessorsById = (professorIds) => {
  console.log("In getProfessorsById Validation Start");
  const errors = [];
  if (!isValidId(professorIds)) errors.push("You must provide valid ID!");
  for (let i = 0; i < professorIds.length; i++)
    if (
      !(typeof professorIds[i] === "string") ||
      !professorIds[i].trim().length > 0
    )
      errors.push("You must provide valid ID!");
  if (!isValidObjectId(professorIds[i])) errors.push("Invalid Object ID!");
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
  schoolId,
  userId
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
  if (!isValidId(userId)) errors.push("You must provide valid ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object ID!");
  if (errors.length) throw errors;
  console.log("In addReviewToProfessor Validation End");
};

const removeReviewFromProfessor = async (professorId, reviewId, userId) => {
  console.log("In removeReviewFromProfessor Validation Start");
  const errors = [];
  if (!isValidId(professorId))
    errors.push("You must provide valid professor ID!");
  if (!isValidObjectId(professorId))
    errors.push("Invalid Professor Object ID!");
  if (!isValidId(reviewId)) errors.push("You must provide valid Review ID!");
  if (!isValidObjectId(reviewId)) errors.push("Invalid Object Review ID!");
  if (!isValidId(userId)) errors.push("You must provide valid User ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object User ID!");
  if (errors.length) throw errors;
  console.log("In removeReviewFromProfessor Validation End");
};

const addCommentToReview = async (
  date,
  text,
  schoolId,
  professorId,
  reviewId,
  userId
) => {
  console.log("In addCommentToReview Validation Start");
  const errors = [];
  if (!isNonEmptyString(text)) errors.push("Text must be a non-empty string!");
  if (!isValidId(schoolId)) errors.push("You must provide valid School ID!");
  if (!isValidObjectId(schoolId)) errors.push("Invalid School Object ID!");
  if (!isValidId(professorId))
    errors.push("You must provide valid professor ID!");
  if (!isValidObjectId(professorId))
    errors.push("Invalid Professor Object ID!");
  if (!isValidId(reviewId)) errors.push("You must provide valid Review ID!");
  if (!isValidObjectId(reviewId)) errors.push("Invalid Object Review ID!");
  if (!isValidId(userId)) errors.push("You must provide valid User ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object User ID!");
  if (errors.length) throw errors;
  console.log("In addCommentToReview Validation End");
};

const removeCommentFromReview = async (
  schoolId,
  professorId,
  reviewId,
  commentId,
  userId
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
  if (!isValidId(userId)) errors.push("You must provide valid User ID!");
  if (!isValidObjectId(userId)) errors.push("Invalid Object User ID!");
  if (errors.length) throw errors;
  console.log("In removeCommentFromReview Validation End");
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
  addCommentToReview,
  removeCommentFromReview,
};
