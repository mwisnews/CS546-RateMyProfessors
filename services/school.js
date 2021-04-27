const schoolData = require("../data").schoolData;
const userData = require("../data").userData;

const ObjectID = require("mongodb").ObjectID;

/*
 * addSchool() - Adds new school to Schools Collection and School Id to Users collection
 * input: name, educationLevel, city, state, zipcode, addedBy
 * output: true - if school added successfully to Schools collection and Users collection
 *         false - if unsuccessful
 */
const addSchool = async (
  name,
  educationLevel,
  city,
  state,
  zipcode,
  addedBy
) => {
  let isSchoolInserted = false;
  let isSchoolAddedToUser = false;
  try {
    const result = await schoolData.addSchool(
      name,
      educationLevel,
      city,
      state,
      zipcode,
      addedBy
    );
    isSchoolInserted = result.insertedCount > 0 ? true : false;
    if (isSchoolInserted) {
      let insertedId = result.insertedId;
      const schoolAdded = await userData.addSchoolToUser(addedBy, insertedId);
      isSchoolAddedToUser = schoolAdded.modifiedCount > 0 ? true : false;
    }
  } catch (err) {
    console.error(`${__filename} - addSchool()`);
    console.error(err);
  }
  return isSchoolAddedToUser;
};

/*
 * removeSchool() - Removes school from Schools Collection and School Id to Users collection
 * input: schoolId
 * output: true - if school successfully deleted
 *         false - if unsuccessful
 */
const removeSchool = async (schoolId) => {
  isDeleted = false;
  try {
    const userId = await userData.getUserIdWhoAddedSchoolId(schoolId);
    userId = userId[0]._id;
    let result = await userData.deleteSchoolFromUser(userId, schoolId);
    if (result.modifiedCount > 0) {
      result = await schoolData.removeSchool(schoolId);
      isDeleted = result.deletedCount > 0 ? true : false;
    }
  } catch (err) {
    console.error(`${__filename} - removeSchool()`);
    console.error(err);
  }
  return isDeleted;
};

/*
 * getAllSchools() - fetched all schools (note that this does not fetch reviews associates with professors. for that, call getProfessorsById())
 * input: -
 * output: array
 */
const getAllSchools = async () => {
  try {
    const result = await schoolData.getAllSchools();
    return result;
  } catch (err) {
    console.error(`${__filename} - getAllSchools()`);
    console.error(err);
  }
};

/*
 * getSchoolsById() - fetched schools based on Ids (note that this does not fetch reviews associates with professors. for that, call getProfessorsById())
 * input: string of school ID or array of strings of school Ids
 * output: array
 */
const getSchoolsById = async (schoolIds) => {
  try {
    const result = await schoolData.getSchoolsById(schoolIds);
    return result;
  } catch (err) {
    console.error(`${__filename} - getSchoolsById()`);
    console.error(err);
  }
};

/*
 * addProfessorToSchool() - Adds professor to Schools Collection
 * input: firstName, lastName, schoolId, courses = []
 * output: true - if professor successfully added to School
 *         false - if unsuccessful
 */
const addProfessorToSchool = async (
  firstName,
  lastName,
  schoolId,
  courses = []
) => {
  let isProfessorAdded = false;
  try {
    const result = await schoolData.addProfessorToSchool(
      firstName,
      lastName,
      schoolId,
      (courses = [])
    );
    isProfessorAdded = result.modifiedCount > 0 ? true : false;
  } catch (err) {
    console.error(`${__filename} - addProfessorToSchool()`);
    console.error(err);
  }
  return isProfessorAdded;
};

/*
 * removeProfessorFromSchool() - Remove professor from Schools Collection
 * input: schoolId, professorId
 * output: true - if professor successfully removed from School
 *         false - if unsuccessful
 */
const removeProfessorFromSchool = async (schoolId, professorId) => {
  let isProfessorRemoved = false;
  try {
    const result = await schoolData.removeProfessorFromSchool(
      schoolId,
      professorId
    );
    isProfessorRemoved = result.modifiedCount > 0 ? true : false;
  } catch (err) {
    console.error(`${__filename} - removeProfessorFromSchool()`);
    console.error(err);
  }
  return isProfessorRemoved;
};

/*
 * getAllProfessorsFromSchool() - get all professors from School
 * input: schoolId
 * output: array of professors (doesn't include reviews. to get reviews of professors along with other content, use getProfessorsById())
 */
const getAllProfessorsFromSchool = async (schoolId) => {
  let professors = [];
  try {
    const [result] = await schoolData.getAllProfessorsFromSchool(schoolId);
    professors = result.professors;
  } catch (err) {
    console.error(`${__filename} - getAllProfessorsFromSchool()`);
    console.error(err);
  }
  return professors;
};

/*
 * getProfessorsById() - get all professors by Id
 * input: string of professor ID or array of strings of professor Ids
 * output: array of professors
 */
const getProfessorsById = async (professorIds) => {
  let professorsList = [];
  try {
    if (!Array.isArray(professorIds)) professorIds = [professorIds];
    const result = await schoolData.getProfessorsById(professorIds);
    result.forEach((professor) => {
      professorsList.push(professor.professors);
    });
  } catch (err) {
    console.error(`${__filename} - getProfessorsById()`);
    console.error(err);
  }
  return professorsList;
};

/*
    * addReviewToProfessor() - add review to professor and review id to user
    * input: rating, difficulty, course, review, date, professorId,     schoolId, userId
    * output: true - review added successfully
              false - unsuccessful
*/
const addReviewToProfessor = async (
  rating,
  difficulty,
  course,
  review,
  date,
  professorId,
  schoolId,
  userId
) => {
  let isReviewAddedToProfessor = false;
  let isReviewAddedToUser = false;
  try {
    const {
      result: schoolResult,
      reviewId,
    } = await schoolData.addReviewToProfessor(
      rating,
      difficulty,
      course,
      review,
      date,
      professorId,
      schoolId
    );
    // console.log(schoolResult);
    isReviewAddedToProfessor = schoolResult.modifiedCount > 0 ? true : false;
    if (isReviewAddedToProfessor) {
      const userResult = await userData.addReviewToUser(userId, reviewId);
      isReviewAddedToUser = userResult.modifiedCount > 0 ? true : false;
    }
  } catch (err) {
    console.error(`${__filename} - addReviewToProfessor()`);
    console.error(err);
  }
  return isReviewAddedToUser;
};

/*
    * removeReviewFromProfessor() - remove review from professor and review id from user
    * input: professorId, reviewId, userId
    * output: true - review removed successfully
              false - unsuccessful
*/
const removeReviewFromProfessor = async (professorId, reviewId, userId) => {
  let isReviewRemovedFromProfessor = false;
  let isReviewRemovedFromUser = false;
  try {
    const schoolResult = await schoolData.removeReviewFromProfessor(
      professorId,
      reviewId
    );
    isReviewRemovedFromProfessor =
      schoolResult.modifiedCount > 0 ? true : false;
    console.log(isReviewRemovedFromProfessor);
    if (isReviewRemovedFromProfessor) {
      const userResult = await userData.deleteReviewFromUser(userId, reviewId);
      isReviewRemovedFromUser = userResult.modifiedCount > 0 ? true : false;
    }
  } catch (err) {
    console.error(`${__filename} - removeReviewFromProfessor()`);
    console.error(err);
  }
  return isReviewRemovedFromUser;
};

/*
    * addCommentToReview() - add comment to review and comment id to user
    * input: user, date, text, schoolId, professorId, reviewId, userId
    * output: true - comment added successfully
              false - unsuccessful
*/
const addCommentToReview = async (
  user,
  date,
  text,
  schoolId,
  professorId,
  reviewId,
  userId
) => {
  let isCommentAddedToReview = false;
  let isCommentAddedToUser = false;
  try {
    const {
      result: schoolResult,
      commentId,
    } = await schoolData.addCommentToReview(
      user,
      date,
      text,
      schoolId,
      professorId,
      reviewId
    );
    isCommentAddedToReview = schoolResult.modifiedCount > 0 ? true : false;
    if (isCommentAddedToReview) {
      let userResult = await userData.addCommentToUser(userId, commentId);
      isCommentAddedToUser = userResult.modifiedCount > 0 ? true : false;
    }
  } catch (err) {
    console.error(`${__filename} - addCommentToReview()`);
    console.error(err);
  }
  return isCommentAddedToUser;
};

/*
    * removeCommentFromReview() - remove comment from review and comment id from user
    * input: schoolId, professorId, reviewId, commentId
    * output: true - comment removed successfully
              false - unsuccessful
*/
const removeCommentFromReview = async (
  schoolId,
  professorId,
  reviewId,
  commentId
) => {
  let isCommentRemovedToReview = false;
  let isCommentRemovedToUser = false;
  try {
    const schoolResult = await schoolData.removeCommentFromReview(
      schoolId,
      professorId,
      reviewId,
      commentId
    );
    isCommentRemovedToReview = schoolResult.modifiedCount > 0 ? true : false;
    if (isCommentRemovedToReview) {
      let userResult = await userData.deleteCommentFromUser(userId, commentId);
      isCommentRemovedToUser = userResult.modifiedCount > 0 ? true : false;
    }
  } catch (err) {
    console.error(`${__filename} - removeCommentFromReview()`);
    console.error(err);
  }
  return isCommentRemovedToUser;
};

module.exports = {
  addSchool,
  removeSchool,
  getAllSchools,
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
