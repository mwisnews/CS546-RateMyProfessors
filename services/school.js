const schoolData = require("../data").schoolData;
const userData = require("../data").userData;
const validation = require("../Validation/schoolServices");
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
  console.info("addSchool() :: services :: start");

  let isSchoolInserted = false;
  let isSchoolAddedToUser = false;
  let insertedId = null;
  let duplicateSchool = false;
  try {
    validation.addSchool(name, educationLevel, city, state, zipcode, addedBy);
    const result = await schoolData.addSchool(
      name,
      educationLevel,
      city,
      state,
      zipcode,
      addedBy
    );
    if (result?.insertedCount) {
      isSchoolInserted = result.insertedCount > 0 ? true : false;
      if (isSchoolInserted && result?.insertedId) {
        insertedId = result.insertedId;
        const schoolAdded = await userData.addSchoolToUser(addedBy, insertedId);
        if (schoolAdded?.modifiedCount)
          isSchoolAddedToUser = schoolAdded.modifiedCount > 0 ? true : false;
      }
    }
  } catch (err) {
    console.error(`${__filename} - addSchool()`);
    console.error(err);
    duplicateSchool = true;
  } finally {
    console.info("addSchool() :: services :: end");
    return { isSchoolAddedToUser, insertedId, duplicateSchool };
  }
};

/*
 * removeSchool() - Removes school from Schools Collection and School Id to Users collection
 * input: schoolId
 * output: true - if school successfully deleted
 *         false - if unsuccessful
 */
const removeSchool = async (schoolId) => {
  console.info("removeSchool() :: services :: start");
  isDeleted = false;
  try {
    validation.removeSchool(schoolId);
    let userId = await userData.getUserIdWhoAddedSchoolId(schoolId);
    if (userId[0]?._id) {
      userId = userId[0]._id;
      let userResult = await userData.deleteSchoolFromUser(userId, schoolId);
      // console.log(userResult);
      if (userResult?.modifiedCount) {
        if (userResult.modifiedCount > 0) {
          schoolResult = await schoolData.removeSchool(schoolId);
          // console.log(schoolResult);
          if (schoolResult?.deletedCount)
            isDeleted = schoolResult.deletedCount > 0 ? true : false;
        }
      }
    }
  } catch (err) {
    console.error(`${__filename} - removeSchool()`);
    console.error(err);
  } finally {
    console.info("removeSchool() :: services :: end");
    return isDeleted;
  }
};

/*
 * getAllSchools() - fetched all schools (note that this does not fetch reviews associates with professors. for that, call getProfessorsById())
 * input: -
 * output: array
 */
const getAllSchools = async () => {
  console.info("getAllSchools() :: services :: start");
  let result = [];
  try {
    result = await schoolData.getAllSchools();
    result.sort((schoolA, schoolB) => {
      const nameA = schoolA.name.toLowerCase();
      const nameB = schoolB.name.toLowerCase();
      if (nameA === nameB) return 0;
      return nameA > nameB ? 1 : -1;
    });
  } catch (err) {
    console.error(`${__filename} - getAllSchools()`);
    console.error(err);
  } finally {
    console.info("getAllSchools() :: services :: end");
    return result;
  }
};

/*
 * getSchoolsById() - fetched schools based on Ids (note that this does not fetch reviews associates with professors. for that, call getProfessorsById())
 * input: string of school ID or array of strings of school Ids
 * output: array
 */
const getSchoolsById = async (schoolIds) => {
  console.info("getSchoolsById() :: services :: start");
  let result = [];
  try {
    validation.getSchoolsById(schoolIds);
    result = await schoolData.getSchoolsById(schoolIds);
  } catch (err) {
    console.error(`${__filename} - getSchoolsById()`);
    console.error(err);
  } finally {
    console.info("getSchoolsById() :: services :: end");
    return result;
  }
};

/*
 * addProfessorToSchool() - Adds professor to Schools Collection
 * input: firstName, lastName, schoolId, courses = []
 * output: professor Id,
 *         true - if professor successfully added to School
 *         false - if unsuccessful
 */
const addProfessorToSchool = async (
  firstName,
  lastName,
  schoolId,
  courses = []
) => {
  console.info("addProfessorToSchool() :: services :: start");
  let isProfessorAdded = false;
  let result = null;
  let id = null;
  try {
    validation.addProfessorToSchool(firstName, lastName, schoolId);
    result = await schoolData.addProfessorToSchool(
      firstName,
      lastName,
      schoolId,
      courses
    );
    isProfessorAdded = result.isInserted;
    id = result.id;
  } catch (err) {
    console.error(`${__filename} - addProfessorToSchool()`);
    console.error(err);
  } finally {
    console.info("addProfessorToSchool() :: services :: end");
    return { id: result.id, isProfessorAdded: isProfessorAdded };
  }
};

/*
 * removeProfessorFromSchool() - Remove professor from Schools Collection
 * input: schoolId, professorId
 * output: true - if professor successfully removed from School
 *         false - if unsuccessful
 */
const removeProfessorFromSchool = async (schoolId, professorId) => {
  console.info("removeProfessorFromSchool() :: services :: start");
  let isProfessorRemoved = false;
  try {
    validation.removeProfessorFromSchool(schoolId, professorId);
    const result = await schoolData.removeProfessorFromSchool(
      schoolId,
      professorId
    );
    if (result?.modifiedCount)
      isProfessorRemoved = result.modifiedCount > 0 ? true : false;
  } catch (err) {
    console.error(`${__filename} - removeProfessorFromSchool()`);
    console.error(err);
  } finally {
    console.info("removeProfessorFromSchool() :: services :: end");
    return isProfessorRemoved;
  }
};

/*
 * getAllProfessorsFromSchool() - get all professors from School
 * input: schoolId
 * output: array of professors (doesn't include reviews. to get reviews of professors along with other content, use getProfessorsById())
 */
const getAllProfessorsFromSchool = async (schoolId) => {
  console.info("getAllProfessorsFromSchool() :: services :: start");
  let professors = [];
  try {
    validation.getAllProfessorsFromSchool(schoolId);
    const [result] = await schoolData.getAllProfessorsFromSchool(schoolId);
    if (result?.professors) professors = result.professors;
  } catch (err) {
    console.error(`${__filename} - getAllProfessorsFromSchool()`);
    console.error(err);
  } finally {
    console.info("getAllProfessorsFromSchool() :: services :: end");
    return professors;
  }
};

/*
 * getProfessorsById() - get all professors by Id
 * input: string of professor ID or array of strings of professor Ids
 * output: array of professors
 */
const getProfessorsById = async (professorIds) => {
  console.info("getProfessorsById() :: services :: start");
  let professorsList = [];
  try {
    validation.getProfessorsById(professorIds);
    if (!Array.isArray(professorIds)) professorIds = [professorIds];
    const result = await schoolData.getProfessorsById(professorIds);
    result.forEach((professor) => {
      professorsList.push(professor.professors);
    });
  } catch (err) {
    console.error(`${__filename} - getProfessorsById()`);
    console.error(err);
  } finally {
    console.info("getProfessorsById() :: services :: end");
    return professorsList;
  }
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
  console.info("addReviewToProfessor() :: services :: start");
  let isReviewAddedToProfessor = false;
  let isReviewAddedToUser = false;
  try {
    validation.addReviewToProfessor(
      rating,
      difficulty,
      course,
      review,
      date,
      professorId,
      schoolId,
      userId
    );
    const user = await userData.getUsersById(userId);
    // console.log(user);
    if (Array.isArray(user)) {
      if (user.length > 0) {
        const { result: schoolResult, id: reviewId } =
          await schoolData.addReviewToProfessor(
            rating,
            difficulty,
            course,
            review,
            date,
            professorId,
            schoolId
          );
        // console.log(schoolResult);
        // console.log(reviewId);
        if (schoolResult?.modifiedCount)
          isReviewAddedToProfessor =
            schoolResult.modifiedCount > 0 ? true : false;
        if (isReviewAddedToProfessor) {
          const userResult = await userData.addReviewToUser(userId, reviewId);
          // console.log(userResult);
          if (userResult?.modifiedCount)
            isReviewAddedToUser = userResult.modifiedCount > 0 ? true : false;
        }
      }
    }
  } catch (err) {
    console.error(`${__filename} - addReviewToProfessor()`);
    console.error(err);
  } finally {
    console.info("addReviewToProfessor() :: services :: end");
    return isReviewAddedToUser;
  }
};

/*
    * removeReviewFromProfessor() - remove review from professor and review id from user
    * input: professorId, reviewId, userId
    * output: true - review removed successfully
              false - unsuccessful
*/
const removeReviewFromProfessor = async (professorId, reviewId, userId) => {
  console.info("removeReviewFromProfessor() :: services :: start");
  let isReviewRemovedFromProfessor = false;
  let isReviewRemovedFromUser = false;
  let isReviewAddedToUserOnFailure = false;
  try {
    validation.removeReviewFromProfessor(professorId, reviewId, userId);
    const user = await userData.getUsersById(userId);
    // console.log(user);
    if (Array.isArray(user)) {
      if (user.length > 0) {
        let userResult = await userData.deleteReviewFromUser(userId, reviewId);
        // console.log(userResult);
        if (userResult?.modifiedCount)
          isReviewRemovedFromUser = userResult.modifiedCount > 0 ? true : false;
        if (isReviewRemovedFromUser) {
          const schoolResult = await schoolData.removeReviewFromProfessor(
            professorId,
            reviewId
          );
          // console.log(schoolResult);
          if (schoolResult?.modifiedCount)
            isReviewRemovedFromProfessor =
              schoolResult.modifiedCount > 0 ? true : false;
          if (!isReviewRemovedFromProfessor) {
            userResult = await userData.addReviewToUser(userId, reviewId);
            if (userResult?.modifiedCount)
              isReviewAddedToUserOnFailure =
                userResult.modifiedCount > 0 ? true : false;
          }
        }
      }
    }
  } catch (err) {
    console.error(`${__filename} - removeReviewFromProfessor()`);
    console.error(err);
  } finally {
    console.info("removeReviewFromProfessor() :: services :: end");
    // console.log(isReviewRemovedFromProfessor, isReviewAddedToUserOnFailure);
    return isReviewRemovedFromProfessor && !isReviewAddedToUserOnFailure;
  }
};

/*
    * addThumbsUpToReview() - add thumbs up to review
    * input: schoolId, professorId, reviewId, userId
    * output: true - thumbs up added successfully
              false - unsuccessful
*/
const addThumbsUpToReview = async (schoolId, professorId, reviewId, userId) => {
  console.info("addThumbsUpToReview() :: services :: start");
  isThumbsUpAddedToReview = false;
  try {
    validation.addThumbsUpToReview(schoolId, professorId, reviewId, userId);
    let temp_result = await schoolData.removeThumbsDownFromReview(
      schoolId,
      professorId,
      reviewId,
      userId
    );
    let result = await schoolData.addThumbsUpToReview(
      schoolId,
      professorId,
      reviewId,
      userId
    );
    // console.log(result);
    if (result?.modifiedCount)
      isThumbsUpAddedToReview = result?.modifiedCount > 0 ? true : false;
  } catch (err) {
    console.error(`${__filename} - addThumbsUpToReview()`);
    console.error(err);
  } finally {
    console.info("addThumbsUpToReview() :: services :: end");
    return isThumbsUpAddedToReview;
  }
};

/*
    * removeThumbsUpFromReview() - remove thumbs up from review
    * input: schoolId, professorId, reviewId, userId
    * output: true - thumbs up removed successfully
              false - unsuccessful
*/
const removeThumbsUpFromReview = async (
  schoolId,
  professorId,
  reviewId,
  userId
) => {
  console.info("removeThumbsUpFromReview() :: services :: start");
  isThumbsUpRemovedFromReview = false;
  try {
    validation.removeThumbsUpFromReview(
      schoolId,
      professorId,
      reviewId,
      userId
    );
    let result = await schoolData.removeThumbsUpFromReview(
      schoolId,
      professorId,
      reviewId,
      userId
    );
    // console.log(result);
    if (result?.modifiedCount)
      isThumbsUpRemovedFromReview = result?.modifiedCount > 0 ? true : false;
  } catch (err) {
    console.error(`${__filename} - removeThumbsUpFromReview()`);
    console.error(err);
  } finally {
    console.info("removeThumbsUpFromReview() :: services :: end");
    return isThumbsUpRemovedFromReview;
  }
};

/*
    * addThumbsDownToReview() - add thumbs down to review
    * input: schoolId, professorId, reviewId, userId
    * output: true - thumbs down added successfully
              false - unsuccessful
*/
const addThumbsDownToReview = async (
  schoolId,
  professorId,
  reviewId,
  userId
) => {
  console.info("addThumbsDownToReview() :: services :: start");
  isThumbsDownAddedToReview = false;
  try {
    validation.addThumbsDownToReview(schoolId, professorId, reviewId, userId);
    let temp_result = await schoolData.removeThumbsUpFromReview(
      schoolId,
      professorId,
      reviewId,
      userId
    );
    let result = await schoolData.addThumbsDownToReview(
      schoolId,
      professorId,
      reviewId,
      userId
    );
    if (result?.modifiedCount)
      isThumbsDownAddedToReview = result?.modifiedCount > 0 ? true : false;
  } catch (err) {
    console.error(`${__filename} - addThumbsDownToReview()`);
    console.error(err);
  } finally {
    console.info("addThumbsDownToReview() :: services :: end");
    return isThumbsDownAddedToReview;
  }
};

/*
    * removeThumbsDownFromReview() - remove thumbs down from review
    * input: schoolId, professorId, reviewId, userId
    * output: true - thumbs down removed successfully
              false - unsuccessful
*/
const removeThumbsDownFromReview = async (
  schoolId,
  professorId,
  reviewId,
  userId
) => {
  console.info("removeThumbsDownFromReview() :: services :: start");
  isThumbsDownRemovedFromReview = false;
  try {
    validation.removeThumbsDownFromReview(
      schoolId,
      professorId,
      reviewId,
      userId
    );
    let result = await schoolData.removeThumbsDownFromReview(
      schoolId,
      professorId,
      reviewId,
      userId
    );
    if (result?.modifiedCount)
      isThumbsDownRemovedFromReview = result?.modifiedCount > 0 ? true : false;
  } catch (err) {
    console.error(`${__filename} - removeThumbsDownFromReview()`);
    console.error(err);
  } finally {
    console.info("removeThumbsDownFromReview() :: services :: end");
    return isThumbsDownRemovedFromReview;
  }
};

/*
    * addCommentToReview() - add comment to review and comment id to user
    * input: user, date, text, schoolId, professorId, reviewId, userId
    * output: true - comment added successfully
              false - unsuccessful
*/
const addCommentToReview = async (
  date,
  text,
  schoolId,
  professorId,
  reviewId,
  userId
) => {
  console.info("addCommentToReview() :: services :: start");
  let isCommentAddedToReview = false;
  let isCommentAddedToUser = false;
  try {
    validation.addCommentToReview(
      date,
      text,
      schoolId,
      professorId,
      reviewId,
      userId
    );
    const user = await userData.getUsersById(userId);
    if (Array.isArray(user)) {
      if (user.length > 0) {
        const { result: schoolResult, id: commentId } =
          await schoolData.addCommentToReview(
            date,
            text,
            schoolId,
            professorId,
            reviewId,
            userId
          );
        // console.log(">>>>", commentId);
        if (schoolResult?.modifiedCount)
          isCommentAddedToReview =
            schoolResult.modifiedCount > 0 ? true : false;
        if (isCommentAddedToReview) {
          let userResult = await userData.addCommentToUser(userId, commentId);
          if (userResult?.modifiedCount)
            isCommentAddedToUser = userResult.modifiedCount > 0 ? true : false;
          if (!isCommentAddedToUser) {
            isCommentRemovedFromReview = removeCommentFromReview(
              schoolId,
              professorId,
              reviewId,
              commentId
            );
          }
        }
      }
    }
  } catch (err) {
    console.error(`${__filename} - addCommentToReview()`);
    console.error(err);
  } finally {
    console.info("addCommentToReview() :: services :: end");
    return isCommentAddedToUser;
  }
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
  commentId,
  userId
) => {
  console.info("removeCommentFromReview() :: services :: start");
  let isCommentRemovedFromReview = false;
  let isCommentRemovedFromUser = false;
  let isCommentAddedToUserOnFailure = false;
  try {
    validation.removeCommentFromReview(
      schoolId,
      professorId,
      reviewId,
      commentId,
      userId
    );
    const user = await userData.getUsersById(userId);
    // console.log(user);
    if (Array.isArray(user)) {
      if (user.length > 0) {
        let userResult = await userData.deleteCommentFromUser(
          userId,
          commentId
        );
        if (userResult?.modifiedCount)
          isCommentRemovedFromUser =
            userResult.modifiedCount > 0 ? true : false;
        if (isCommentRemovedFromUser) {
          const schoolResult = await schoolData.removeCommentFromReview(
            schoolId,
            professorId,
            reviewId,
            commentId
          );
          // console.log(schoolResult);
          if (schoolResult?.modifiedCount)
            isCommentRemovedFromReview =
              schoolResult.modifiedCount > 0 ? true : false;
        }
        if (!isCommentRemovedFromReview) {
          const userResult = await userData.addCommentToUser(userId, commentId);
          if (userResult?.modifiedCount) {
            isCommentAddedToUserOnFailure =
              userResult.modifiedCount > 0 ? true : false;
          }
        }
      }
    }
  } catch (err) {
    console.error(`${__filename} - removeCommentFromReview()`);
    console.error(err);
  } finally {
    console.info("removeCommentFromReview() :: services :: end");
    return isCommentRemovedFromReview && !isCommentAddedToUserOnFailure;
  }
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
  addThumbsUpToReview,
  removeThumbsUpFromReview,
  addThumbsDownToReview,
  removeThumbsDownFromReview,
  addCommentToReview,
  removeCommentFromReview,
};
