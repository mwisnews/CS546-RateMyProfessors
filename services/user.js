const schoolData = require("../data").schoolData;
const userData = require("../data").userData;

const ObjectID = require("mongodb").ObjectID;

/*
 * addUser() - adds new user
 * input: firstName, lastName, password, email, dateJoined
 * output: {isInserted: boolean, userId, alreadyExists: boolean}
 */
const addUser = async (firstName, lastName, password, email, dateJoined) => {
  let isInserted = false;
  let userId = null;
  let alreadyExists = false;
  try {
    const result = await userData.addUser(
      firstName,
      lastName,
      password,
      email,
      dateJoined
    );
    if (result == false) alreadyExists = true;
    else {
      isInserted = result.insertedCount != 0 ? true : false;
      userId = result.insertedCount != 0 ? result.insertedId : null;
    }
  } catch (err) {
    console.error(`${__filename} - addUser()`);
    console.error(err);
  } finally {
    return {
      isInserted,
      userId,
      alreadyExists,
    };
  }
};

/*
 * removeUser() - remove user
 * input: id
 * output: true - deleted successfully
 *         false - unsuccessful
 */
const removeUser = async (id) => {
  let isDeleted = false;
  try {
    const result = await userData.removeUser(id);
    isDeleted = result.deletedCount > 0 ? true : false;
  } catch (err) {
    console.error(`${__filename} - removeUser()`);
    console.error(err);
  } finally {
    return isDeleted;
  }
};

/*
 * getUsersById() - fetch user by ID
 * input: userIds - string user id or array of strings of user ids
 * output: array
 */
const getUsersById = async (userIds) => {
  let users = null;
  try {
    if (!Array.isArray(userIds)) userIds = [userIds];
    const result = await userData.getUsersById(userIds);
    users = await result;
  } catch (err) {
    console.error(`${__filename} - getUsersById()`);
    console.error(err);
  } finally {
    return users;
  }
};

/*
 * checkLogin() - user authentication
 * input: userId, password - string user id or array of strings of user ids
 * output: 1 - success
 *         0 - username not found
 *         -1 - incorrect password
 */
const checkLogin = async (userId, password) => {
  try {
    const result = await userData.checkLogin(userId, password);
    return result;
  } catch (err) {
    console.error(`${__filename} - checkLogin()`);
    console.error(err);
  }
};

module.exports = {
  addUser,
  removeUser,
  getUsersById,
  checkLogin,
};
