const mongodbConnection = require("../config/mongoConnection");
const ObjectID = require("mongodb").ObjectID;

const _collection = "Users";

const addUser = async (firstName, lastName, password, email, dateJoined) => {
  try {
    const user = {
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      password,
      email: email.toUpperCase(),
      dateJoined,
    };
    const db = await mongodbConnection.getDB();
    const [result] = await db
      .collection(_collection)
      .find({ email: email.toUpperCase() })
      .project({ email: 1, _id: 0 })
      .toArray();
    if (result?.email) {
      if (result.email.toUpperCase() == email.toUpperCase()) {
        return false;
      }
    } else {
      return await db.collection(_collection).insertOne(user);
    }
  } catch (err) {
    throw err;
  }
};

const removeUser = async (id) => {
  try {
    const db = await mongodbConnection.getDB();
    return await db.collection(_collection).deleteOne({ _id: ObjectID(id) });
  } catch (err) {
    throw err;
  }
};

const getUsersById = async (userIds) => {
  try {
    if (!Array.isArray(userIds)) userIds = [userIds];
    userIds.forEach((id, index) => {
      userIds[index] = ObjectID(id);
    });
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .find({ _id: { $in: userIds } })
      .project({ password: 0 })
      .toArray();
  } catch (err) {
    console.log(err);
  }
};

const checkLogin = async (email, password) => {
  try {
    const db = await mongodbConnection.getDB();
    let [user] = await db
      .collection(_collection)
      .find({ email: email.toUpperCase() })
      .project({ email: 1, password: 1 })
      .limit(1)
      .toArray();
    if (user) {
      if (user.email.toUpperCase() == email.toUpperCase()) {
        if (user.password == password) return 1;
        // correct login
        else return -1; // incorrect password
      }
    } else {
      return 0; // username not found
    }
  } catch (err) {
    throw err;
  }
};

const addReviewToUser = async (userId, reviewId) => {
  try {
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .updateOne(
        { _id: ObjectID(userId) },
        { $addToSet: { reviewsMade: ObjectID(reviewId) } }
      );
  } catch (err) {
    throw err;
  }
};

const deleteReviewFromUser = async (userId, reviewId) => {
  try {
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .updateOne(
        { _id: ObjectID(userId) },
        { $pull: { reviewsMade: ObjectID(reviewId) } }
      );
  } catch (err) {
    throw err;
  }
};

const getAllReviewsIdsMadeByUsers = async (userIds) => {
  try {
    if (!Array.isArray(userIds)) userIds = [userIds];
    userIds.forEach((id, index) => {
      userIds[index] = ObjectID(id);
    });
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .find({ _id: { $in: userIds } })
      .project({ reviewsMade: 1, _id: 1 })
      .toArray();
  } catch (err) {
    throw err;
  }
};

const getAllReviewsContentMadeByUsers = async (userIds) => {
  try {
    if (!Array.isArray(userIds)) userIds = [userIds];
    userIds.forEach((id, index) => {
      userIds[index] = ObjectID(id);
    });
    const db = await mongodbConnection.getDB();
    return db
      .collection(_collection)
      .aggregate([
        { $match: { _id: { $in: userIds } } },
        // {$unwind: {path: "$Schools"}},
        // {$unwind: {path: "$professors"}},
        // {$unwind: {path: "$professors.reviews"}},
        {
          $lookup: {
            localField: "reviewsMade",
            from: "Schools",
            foreignField: "professors.reviews._id",
            as: "fromResult",
          },
        },
        { $unwind: { path: "$fromResult" } },
        { $unwind: { path: "$fromResult.professors" } },
        { $unwind: { path: "$fromResult.professors.reviews" } },
        // {"$lookup": {
        //     "localField": "reviewsMade",
        //     "from": "fromResult",
        //     "foreignField": "professors.reviews._id",
        //     "as": "fromResult"
        // }},
        // {$match: {"fromResult.professors.reviews._id": {$in: "reviewsMade"}}},
      ])
      .project({ "fromResult.professors.reviews": 1, reviewsMade: 1, _id: 1 })
      .toArray();
  } catch (err) {
    throw err;
  }
};

const addSchoolToUser = async (userId, schoolId) => {
  try {
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .updateOne(
        { _id: ObjectID(userId) },
        { $addToSet: { schoolsAdded: ObjectID(schoolId) } }
      );
  } catch (err) {
    throw err;
  }
};

const deleteSchoolFromUser = async (userId, schoolId) => {
  try {
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .updateOne(
        { _id: ObjectID(userId) },
        { $pull: { schoolsAdded: ObjectID(schoolId) } }
      );
  } catch (err) {
    throw err;
  }
};

const getAllSchoolsAddedByUsers = async (userIds) => {
  try {
    if (!Array.isArray(userIds)) userIds = [userIds];
    userIds.forEach((id, index) => {
      userIds[index] = ObjectID(id);
    });
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .find({ _id: { $in: userIds } })
      .project({ schoolsAdded: 1, _id: 1 })
      .toArray();
  } catch (err) {
    throw err;
  }
};

const getUserIdWhoAddedSchoolId = async (schoolId) => {
  try {
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .aggregate([
        { $unwind: { path: "$schoolsAdded" } },
        { $match: { schoolsAdded: ObjectID(schoolId) } },
      ])
      .project({ _id: 1 })
      .toArray();
  } catch (err) {
    throw err;
  }
};

const addCommentToUser = async (userId, commentId) => {
  try {
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .updateOne(
        { _id: ObjectID(userId) },
        { $addToSet: { commentsLeft: ObjectID(commentId) } }
      );
  } catch (err) {
    throw err;
  }
};

const deleteCommentFromUser = async (userId, commentId) => {
  try {
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .updateOne(
        { _id: ObjectID(userId) },
        { $pull: { commentsLeft: ObjectID(commentId) } }
      );
  } catch (err) {
    throw err;
  }
};

const getAllCommentsLeftByUsers = async (userIds) => {
  try {
    if (!Array.isArray(userIds)) userIds = [userIds];
    userIds.forEach((id, index) => {
      userIds[index] = ObjectID(id);
    });
    const db = await mongodbConnection.getDB();
    return await db
      .collection(_collection)
      .find({ _id: { $in: userIds } })
      .project({ commentsLeft: 1, _id: 1 })
      .toArray();
  } catch (err) {
    throw err;
  }
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
