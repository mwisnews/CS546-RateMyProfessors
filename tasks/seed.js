const mongodbConnection = require("../config/mongoConnection");
const schoolService = require('../services').schoolService;
const userService = require('../services').userService;

(async () => {
  try {
    const db = await mongodbConnection.getDB();
    await db.dropDatabase();
    console.log("Database dropped");
    console.log("Starting database seed");

    let result = null;

    // Users Collection
    // Add Users
    let users = [
      ["Ronak", "Kachalia", "Password", "rkachali@stevens.edu"],
      ["Sam", "Severance", "Password", "sam@stevens.edu"],
      ["Matt", "Wisnewski", "Password", "matt@stevens.edu"],
      ["Karan", "Shah", "Password", "kshah@stevens.edu"]
    ];
    users.forEach(async (user) => {
      result = await userService.addUser(...user, new Date());
      if(result.isInserted) {
        console.log(`User - ${user[0]} ${user[1]} added successfully`);
        user.push(result.userId);
      }
      else console.log(`User - ${user[0]} ${user[1]} could not be added`);
    });

    // Schools Collection
    // Add Schools
    let schools = [
      ["Stevens Institute of Technology", "College", "Hoboken", "New Jersey", "07030", users[0][4]],
      ["NJIT", "College", "Newark", "New Jersey", "07102", users[1][4]],
      ["NYU", "College", "New York City", "New York", "10003", users[2][4]],
      ["Rutgers University", "New Brunswick", "New Jersey", "08901", users[3][4]]
    ];

    schools.forEach(async (school) => {
      result = await schoolService.addSchool(...school);
      if(result) console.log(`School - ${school[0]} added successfully`);
      else console.log(`School - ${school[0]} could not be added`);
    });
    console.log("Done seeding database");
    // await db.serverConfig.close();
  } catch (e) {
    console.error(e);
  }
})();
