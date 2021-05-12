const mongodbConnection = require("../config/mongoConnection");
const ObjectID = require("mongodb").ObjectID;
const validation = require("../Validation/schoolData");
const _collection = "Schools";

const addSchool = async (
  name,
  educationLevel,
  city,
  state,
  zipcode,
  addedBy
) => {
  validation.addSchool(name, educationLevel, city, state, zipcode, addedBy);

  const db = await mongodbConnection.getDB();

  const existingSchool = await db
    .collection(_collection)
    .findOne({ name: { $regex: `^${name}$`, $options: "i" } });

  if (existingSchool) throw ["School already exists"];

  try {
    const schoolDocument = {
      name,
      educationLevel,
      city,
      state,
      zipcode,
      addedBy: ObjectID(addedBy),
    };
    return await db.collection(_collection).insertOne(schoolDocument);
  } catch (err) {
    throw [err.toString()];
  }
};

const removeSchool = async (schoolId) => {
  try {
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .deleteOne({ _id: ObjectID(schoolId) });
  } catch (err) {
    throw err;
  }
};

const getAllSchools = async () => {
  try {
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .find({})
      .project({ "professors.reviews": 0 })
      .toArray();
  } catch (err) {
    throw err;
  }
};

const getSchoolsById = async (schoolIds) => {
  if (!Array.isArray(schoolIds)) schoolIds = [schoolIds];
  schoolIds.forEach((id, index) => {
    schoolIds[index] = ObjectID(id);
  });
  try {
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .find({ _id: { $in: schoolIds } })
      .project({ "professors.reviews": 0 })
      .toArray();
  } catch (err) {
    throw err;
  }
};

/*
 * Professors
 */

const addProfessorToSchool = async (
  firstName,
  lastName,
  schoolId,
  courses = []
) => {
  try {
    const _id = new ObjectID();
    const professorDocument = {
      _id,
      firstName,
      lastName,
      schoolId,
      courses,
      overallRating: 0,
      numberOfReviews: 0,
    };
    const db = await mongodbConnection.getDB();
    let result = await db
      .collection(_collection)
      .updateOne(
        { _id: ObjectID(schoolId) },
        { $addToSet: { professors: professorDocument } }
      );
    // console.log(result);
    return { id: _id, isInserted: result.modifiedCount > 0 ? true : false };
  } catch (err) {
    throw err;
  }
};

const removeProfessorFromSchool = async (schoolId, professorId) => {
  try {
    const db = await mongodbConnection.getDB();
    return await db.collection(_collection).updateOne(
      { _id: ObjectID(schoolId) },
      {
        $pull: {
          professors: { _id: ObjectID(professorId) },
        },
      }
    );
  } catch (err) {
    throw err;
  }
};

const getAllProfessorsFromSchool = async (schoolId) => {
  try {
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .find({ _id: ObjectID(schoolId) })
      .project({
        _id: 0,
        "professors._id": 1,
        "professors.firstName": 1,
        "professors.lastName": 1,
        "professors.schoolId": 1,
        "professors.courses": 1,
        "professors.overallRating": 1,
        "professors.numberOfReviews": 1,
      })
      .toArray();
  } catch (err) {
    throw err;
  }
};

const getProfessorsById = async (professorIds) => {
  if (!Array.isArray(professorIds)) professorIds = [professorIds];
  professorIds.forEach((id, index) => {
    professorIds[index] = ObjectID(id);
  });
  try {
    const db = await mongodbConnection.getDB();
    return db
      .collection(_collection)
      .aggregate([
        { $unwind: { path: "$professors" } },
        { $match: { "professors._id": { $in: professorIds } } },
      ])
      .project({
        professors: 1,
        _id: 0,
      })
      .toArray();
  } catch (err) {
    throw err;
  }
};

/*
 * Reviews
 */

const addReviewToProfessor = async (
  rating,
  difficulty,
  course,
  review,
  date,
  professorId,
  schoolId
) => {
  let result;
  try {
    let id = new ObjectID();
    const reviewDocument = {
      _id: id,
      rating,
      difficulty,
      course,
      review,
      date,
    };
    const db = await mongodbConnection.getDB();
    let [ratings] = await db
      .collection(_collection)
      .aggregate([
        { $unwind: { path: "$professors" } },
        // {$unwind: {path: "$professors.reviews"}},
        { $match: { "professors._id": ObjectID(professorId) } },
      ])
      .project({ _id: 0, "professors.reviews.rating": 1 })
      .toArray();
    // console.log(">>>", ratings);
    let sum = 0;
    let avg_rating = rating;
    if (ratings?.professors?.reviews) {
      ratings = ratings.professors.reviews;
      if (Array.isArray(ratings)) {
        if (ratings.length > 0) {
          ratings.forEach((data) => {
            sum += data.rating;
          });
          avg_rating = Number(
            ((sum + rating) / (ratings.length + 1)).toFixed(1)
          );
        }
        // console.log(avg_rating)
      }
    }
    result = await db.collection(_collection).updateOne(
      {
        _id: ObjectID(schoolId),
        "professors._id": ObjectID(professorId),
      },
      {
        $set: { "professors.$.overallRating": avg_rating },
        $addToSet: {
          "professors.$.reviews": reviewDocument,
        },
        $inc: { "professors.$.numberOfReviews": 1 },
      }
    );
    // console.log("<<<<<", result);
    return { result, id: id.toString() };
  } catch (err) {
    throw err;
  }
};

const removeReviewFromProfessor = async (professorId, reviewId) => {
  try {
    const db = await mongodbConnection.getDB();
    let [ratings] = await db
      .collection(_collection)
      .aggregate([
        { $unwind: { path: "$professors" } },
        // {$unwind: {path: "$professors.reviews"}},
        { $match: { "professors._id": ObjectID(professorId) } },
      ])
      .project({
        _id: 0,
        "professors.reviews.rating": 1,
        "professors.reviews._id": 1,
      })
      .toArray();
    let sum = 0;
    let avg_rating = 0;
    let reviewIdFound = false;
    if (ratings?.professors) {
      ratings = ratings.professors.reviews;
      // console.log(ratings);
      if (ratings.length > 0) {
        ratings.forEach((data) => {
          if (data._id == reviewId) {
            reviewIdFound = true;
          } else {
            sum += data.rating;
          }
        });
        if (reviewIdFound) {
          if (ratings.length > 1)
            avg_rating = Number((sum / (ratings.length - 1)).toFixed(1));
          else avg_rating = 0;
        } else avg_rating = Number((sum / ratings.length).toFixed(1));
      }
    }
    // console.log(avg_rating);
    if (reviewIdFound) {
      return await db.collection(_collection).updateOne(
        {
          // "_id": ObjectID(schoolId),
          "professors._id": ObjectID(professorId),
        },
        {
          $set: { "professors.$.overallRating": avg_rating },
          $pull: {
            "professors.$.reviews": { _id: ObjectID(reviewId) },
          },
          $inc: { "professors.$.numberOfReviews": -1 },
        }
      );
    } else return null;
  } catch (err) {
    throw err;
  }
};

const getReviewsById = async (reviewIds) => {
  if (!Array.isArray(reviewIds)) reviewIds = [reviewIds];
  reviewIds.forEach((id, index) => {
    reviewIds[index] = ObjectID(id);
  });
  try {
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .aggregate([
        { $unwind: { path: "$professors" } },
        { $unwind: { path: "$professors.reviews" } },
        { $match: { "professors.reviews._id": { $in: reviewIds } } },
      ])
      .project({ "professors.reviews": 1, _id: 0 })
      .toArray();
  } catch (err) {
    throw err;
  }
};

/*
* Thumbs dp & Thumbs down
*/

const addThumbsUpToReview = async (schoolId, professorId, reviewId, userId) => {
  try{
    const db = await mongodbConnection.getDB();
    return db.collection(_collection).updateOne(
      {
        _id: ObjectID(schoolId),
      },
      {
        $addToSet: { "professors.$[a].reviews.$[b].thumbsUp": ObjectID(userId) },
      },
      {
        arrayFilters: [
          { "a._id": ObjectID(professorId) },
          { "b._id": ObjectID(reviewId) },
        ],
      }
    );
  }catch(err){
    throw err;
  }
};

const removeThumbsUpFromReview = async (schoolId, professorId, reviewId, userId) => {
  try{
    const db = await mongodbConnection.getDB();
    return await db.collection(_collection).updateOne(
      { _id: ObjectID(schoolId) },
      {
        $pull: {
          "professors.$[a].reviews.$[b].thumbsUp": ObjectID(userId),
        },
      },
      {
        arrayFilters: [
          { "a._id": ObjectID(professorId) },
          { "b._id": ObjectID(reviewId) },
        ],
      }
    );
  }catch(err){
    throw err;
  }
};

const addThumbsDownToReview = async (schoolId, professorId, reviewId, userId) => {
  try{
    const db = await mongodbConnection.getDB();
    return db.collection(_collection).updateOne(
      {
        _id: ObjectID(schoolId),
      },
      {
        $addToSet: { "professors.$[a].reviews.$[b].thumbsDown": ObjectID(userId) },
      },
      {
        arrayFilters: [
          { "a._id": ObjectID(professorId) },
          { "b._id": ObjectID(reviewId) },
        ],
      }
    );
  }catch(err){
    throw err;
  }
};

const removeThumbsDownFromReview = async (schoolId, professorId, reviewId, userId) => {
  try{
    const db = await mongodbConnection.getDB();
    return await db.collection(_collection).updateOne(
      { _id: ObjectID(schoolId) },
      {
        $pull: {
          "professors.$[a].reviews.$[b].thumbsDown": ObjectID(userId),
        },
      },
      {
        arrayFilters: [
          { "a._id": ObjectID(professorId) },
          { "b._id": ObjectID(reviewId) },
        ],
      }
    );
  }catch(err){
    throw err;
  }
};

/*
 * Comments
 */

const addCommentToReview = async (
  date,
  text,
  schoolId,
  professorId,
  reviewId,
  userId
) => {
  try {
    let id = new ObjectID();
    const commentDocument = {
      _id: id,
      userId,
      date,
      text,
    };
    const db = await mongodbConnection.getDB();
    let result = await db.collection(_collection).updateOne(
      {
        _id: ObjectID(schoolId),
      },
      {
        $addToSet: { "professors.$[a].reviews.$[b].comments": commentDocument },
      },
      {
        arrayFilters: [
          { "a._id": ObjectID(professorId) },
          { "b._id": ObjectID(reviewId) },
        ],
      }
    );
    return { result, id: id.toString() };
  } catch (err) {
    throw err;
  }
};

const removeCommentFromReview = async (
  schoolId,
  professorId,
  reviewId,
  commentId
) => {
  try {
    const db = await mongodbConnection.getDB();
    return await db.collection(_collection).updateOne(
      { _id: ObjectID(schoolId) },
      {
        $pull: {
          "professors.$[a].reviews.$[b].comments": { _id: ObjectID(commentId) },
        },
      },
      {
        arrayFilters: [
          { "a._id": ObjectID(professorId) },
          { "b._id": ObjectID(reviewId) },
        ],
      }
    );
  } catch (err) {
    throw err;
  }
};

const getCommentsById = async (commentIds) => {
  try {
    if (!Array.isArray(commentIds)) commentIds = [commentIds];
    commentIds.forEach((id, index) => {
      commentIds[index] = ObjectID(id);
    });
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .aggregate([
        { $unwind: { path: "$professors" } },
        { $unwind: { path: "$professors.reviews" } },
        { $unwind: { path: "$professors.reviews.comments" } },
        { $match: { "professors.reviews.comments._id": { $in: commentIds } } },
      ])
      .project({ "professors.reviews.comments": 1, _id: 0 })
      .toArray();
  } catch (err) {
    throw err;
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
  getReviewsById,
  addThumbsUpToReview,
  removeThumbsUpFromReview,
  addThumbsDownToReview,
  removeThumbsDownFromReview,
  addCommentToReview,
  removeCommentFromReview,
  getCommentsById,
};
