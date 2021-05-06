const chalk = require("chalk");

const mongodbConnection = require("../config/mongoConnection");
const schoolService = require("../services").schoolService;
const userService = require("../services").userService;

(async () => {
  try {
    const db = await mongodbConnection.getDB();
    await db.dropDatabase();
    console.log(chalk.blue("Database dropped"));
    console.log(chalk.blue("Starting database seed"));

    let result = null;

    // Users Collection
    // Add Users
    let users = [
      ["Ronak", "Kachalia", "password", "rkachali@stevens.edu"],
      ["Sam", "Severance", "password", "sseveran@stevens.edu"],
      ["Matt", "Wisnewski", "password", "mwisnews@stevens.edu"],
      ["Karan", "Shah", "password", "kshah129@stevens.edu"],
    ];
    for (const user of users) {
      result = await userService.addUser(...user, new Date());
      if (result.isInserted) {
        console.log(
          chalk.green(`User - ${user[0]} ${user[1]} added successfully`)
        );
        user.push(result.userId);
      } else
        console.error(
          chalk.red(`User - ${user[0]} ${user[1]} could not be added`)
        );
    }

    // Schools Collection
    // Add Schools
    let schools = [
      [
        "Stevens Institute of Technology",
        "College",
        "Hoboken",
        "New Jersey",
        "07030",
        users[0][4],
      ],
      ["NJIT", "College", "Newark", "New Jersey", "07102", users[1][4]],
      ["NYU", "College", "New York City", "New York", "10003", users[2][4]],
      [
        "Rutgers University",
        "College",
        "New Brunswick",
        "New Jersey",
        "08901",
        users[3][4],
      ],
    ];

    for (const school of schools) {
      result = await schoolService.addSchool(...school);
      if (result)
        console.log(chalk.green(`School - ${school[0]} added successfully`));
      else console.error(chalk.red(`School - ${school[0]} could not be added`));
    }
    console.log(chalk.blue("Done seeding database"));
    await db.serverConfig.close();
  } catch (e) {
    console.error(e);
  }
})();
