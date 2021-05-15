const schoolData = require("../data").schoolData;
const userData = require("../data").userData;
const validation = require("../Validation/userServices");
const ObjectID = require("mongodb").ObjectID;

/*
 * addUser() - adds new user
 * input: firstName, lastName, password, email, dateJoined
 * output: {isInserted: boolean, userId, alreadyExists: boolean}
 */
const addUser = async (firstName, lastName, password, email, dateJoined) => {
  console.info("addUser() :: services :: start");
  let isInserted = false;
  let userId = null;
  let alreadyExists = false;
  try {
    validation.addUserBE(firstName, lastName, password, email);
    const result = await userData.addUser(
      firstName,
      lastName,
      password,
      email,
      dateJoined
    );
    if (result == false) alreadyExists = true;
    else {
      if (result?.insertedCount) {
        isInserted = result.insertedCount != 0 ? true : false;
        userId = result.insertedCount != 0 ? result.insertedId : null;
      }
    }
  } catch (err) {
    console.error(`${__filename} - addUser()`);
    console.error(err);
  } finally {
    console.info("addUser() :: services :: end");
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
  console.info("removeUser() :: services :: start");
  let isDeleted = false;
  try {
    validation.removeUser(id);
    const result = await userData.removeUser(id);
    if (result?.deletedCount)
      isDeleted = result.deletedCount > 0 ? true : false;
  } catch (err) {
    console.error(`${__filename} - removeUser()`);
    console.error(err);
  } finally {
    console.info("removeUser() :: services :: end");
    return isDeleted;
  }
};

/*
 * getUsersById() - fetch user by ID
 * input: userIds - string user id or array of strings of user ids
 * output: array
 */
const getUsersById = async (userIds) => {
  console.info("getUsersById() :: services :: start");
  let result = [];
  try {
    validation.getUsersById(userIds);
    if (!Array.isArray(userIds)) userIds = [userIds];
    result = await userData.getUsersById(userIds);
  } catch (err) {
    console.error(`${__filename} - getUsersById()`);
    console.error(err);
  } finally {
    console.info("getUsersById() :: services :: end");
    return result;
  }
};

/*
 * checkLogin() - user authentication
 * input: userId, password - string user id or array of strings of user ids
 * output: user - success
 *         0 - username not found
 *         -1 - incorrect password
 *         -9 - db error
 */
const checkLogin = async (userId, password) => {
  console.info("checkLogin() :: services :: start");
  let result = -9;
  try {
    validation.checkLogin(userId, password);
    result = await userData.checkLogin(userId, password);
  } catch (err) {
    console.error(`${__filename} - checkLogin()`);
    console.error(err);
  } finally {
    console.info("checkLogin() :: services :: end");
    return result;
  }
};

module.exports = {
  addUser,
  removeUser,
  getUsersById,
  checkLogin,
};
