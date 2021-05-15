const chalk = require("chalk");

const mongodbConnection = require("../config/mongoConnection");
const schoolService = require("../services").schoolService;
const userService = require("../services").userService;
const schoolData = require("../data/school");

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
        user.unshift(result.userId.toString());
      } else
        console.error(
          chalk.red(`User - ${user[0]} ${user[1]} could not be added`)
        );
    }

    // console.log(users);

    // Schools Collection
    // Add Schools
    let schools = [
      [
        "Stevens Institute of Technology",
        "College",
        "Hoboken",
        "New Jersey",
        "07030",
        users[0][0],
      ],
      ["NJIT", "College", "Newark", "New Jersey", "07102", users[1][0]],
      ["NYU", "College", "New York City", "New York", "10003", users[2][0]],
      [
        "Rutgers University",
        "College",
        "New Brunswick",
        "New Jersey",
        "08901",
        users[3][0],
      ],
    ];

    for (const school of schools) {
      result = await schoolService.addSchool(...school);
      if (result) {
        console.log(chalk.green(`School - ${school[0]} added successfully`));
        school.unshift(result.insertedId.toString());
      } else
        console.error(chalk.red(`School - ${school[0]} could not be added`));
    }

    // console.log(schools);

    // Add Professors
    let professors = [
      ["Patrick", "Hill", schools[0][0], ["CS 546", "CS 554"]],
      ["Khasha", "Dehnad", schools[0][0], ["CS 513"]],
      ["Insuk", "Jang", schools[0][0], ["CS 590"]],
      ["Tim", "Howard", schools[1][0], ["MIS 555", "MIS 597"]],
      ["Mike", "Dayson", schools[1][0], ["BIA 500"]],
      ["Connor", "Williams", schools[1][0], ["BIA 505"]],
      ["Kyle", "Walker", schools[2][0], ["CE 147", "CE 258"]],
      ["Jason", "Nodd", schools[2][0], ["BIA 500"]],
      ["Chris", "Morris", schools[2][0], ["BIA 505"]],
      ["Adam", "King", schools[3][0], ["EE 150", "EE 502"]],
      ["James", "Rudd", schools[3][0], ["CS 500"]],
      ["Nathan", "Lyon", schools[3][0], ["CS 550"]],
    ];

    for (const professor of professors) {
      result = await schoolService.addProfessorToSchool(...professor);
      if (result) {
        console.log(
          chalk.green(`Professor - ${professor[0]} added successfully`)
        );
        professor.unshift(result.id.toString());
      } else
        console.error(
          chalk.red(`Professor - ${professor[0]} could not be added`)
        );
    }

    // Add reviews to professors
    let reviews = [
      // prof 1 school 1
      [
        5,
        3,
        "CS 546",
        "Good lecture!",
        new Date(),
        professors[0][0],
        schools[0][0],
        users[0][0],
      ],
      [
        4,
        4,
        "CS 554",
        "Good lecture!",
        new Date(),
        professors[0][0],
        schools[0][0],
        users[1][0],
      ],
      // prof 2 school 1
      [
        4,
        3,
        "CS 513",
        "Good lecture!",
        new Date(),
        professors[1][0],
        schools[0][0],
        users[2][0],
      ],
      [
        5,
        5,
        "CS 513",
        "Good lecture!",
        new Date(),
        professors[1][0],
        schools[0][0],
        users[3][0],
      ],
      // prof 3 school 1
      [
        3.5,
        4,
        "CS 590",
        "Good lecture!",
        new Date(),
        professors[2][0],
        schools[0][0],
        users[1][0],
      ],
      [
        4,
        4,
        "CS 590",
        "Good lecture!",
        new Date(),
        professors[2][0],
        schools[0][0],
        users[2][0],
      ],

      // prof 1 school 2
      [
        4,
        4.5,
        "MIS 555",
        "Good lecture!",
        new Date(),
        professors[3][0],
        schools[1][0],
        users[0][0],
      ],
      [
        3,
        3.5,
        "MIS 597",
        "Good lecture!",
        new Date(),
        professors[3][0],
        schools[1][0],
        users[1][0],
      ],
      // prof 2 school 2
      [
        5,
        5,
        "BIA 500",
        "Good lecture!",
        new Date(),
        professors[4][0],
        schools[1][0],
        users[2][0],
      ],
      [
        5,
        4.5,
        "BIA 500",
        "Good lecture!",
        new Date(),
        professors[4][0],
        schools[1][0],
        users[3][0],
      ],
      // prof 3 school 2
      [
        3,
        3,
        "BIA 505",
        "Good lecture!",
        new Date(),
        professors[5][0],
        schools[1][0],
        users[1][0],
      ],
      [
        2.5,
        2.5,
        "BIA 505",
        "Good lecture!",
        new Date(),
        professors[5][0],
        schools[1][0],
        users[2][0],
      ],

      // prof 1 school 3
      [
        4,
        5,
        "CE 147",
        "Good lecture!",
        new Date(),
        professors[6][0],
        schools[2][0],
        users[0][0],
      ],
      [
        4.5,
        4.5,
        "CE 258",
        "Good lecture!",
        new Date(),
        professors[6][0],
        schools[2][0],
        users[1][0],
      ],
      // prof 2 school 3
      [
        3,
        1,
        "BIA 500",
        "Good lecture!",
        new Date(),
        professors[7][0],
        schools[2][0],
        users[2][0],
      ],
      [
        4,
        2,
        "BIA 500",
        "Good lecture!",
        new Date(),
        professors[7][0],
        schools[2][0],
        users[3][0],
      ],
      // prof 3 school 3
      [
        2.5,
        4,
        "BIA 505",
        "Good lecture!",
        new Date(),
        professors[8][0],
        schools[2][0],
        users[1][0],
      ],
      [
        3,
        5,
        "BIA 505",
        "Good lecture!",
        new Date(),
        professors[8][0],
        schools[2][0],
        users[2][0],
      ],

      // prof 1 school 4
      [
        4,
        4,
        "EE 150",
        "Good lecture!",
        new Date(),
        professors[9][0],
        schools[3][0],
        users[0][0],
      ],
      [
        5,
        5,
        "EE 502",
        "Good lecture!",
        new Date(),
        professors[9][0],
        schools[3][0],
        users[1][0],
      ],
      // prof 2 school 4
      [
        4,
        3,
        "CS 500",
        "Good lecture!",
        new Date(),
        professors[10][0],
        schools[3][0],
        users[2][0],
      ],
      [
        5,
        2,
        "CS 500",
        "Good lecture!",
        new Date(),
        professors[10][0],
        schools[3][0],
        users[3][0],
      ],
      // prof 3 school 4
      [
        4,
        5,
        "CS 550",
        "Good lecture!",
        new Date(),
        professors[11][0],
        schools[3][0],
        users[1][0],
      ],
      [
        3,
        5,
        "CS 550",
        "Good lecture!",
        new Date(),
        professors[11][0],
        schools[3][0],
        users[2][0],
      ],
    ];

    for (const review of reviews) {
      // console.log(review);
      result = await schoolService.addReviewToProfessor(...review);
      // console.log(result);
      if (result) {
        console.log(chalk.green(`Review - ${review[3]} added successfully`));
      } else
        console.error(chalk.red(`Review - ${review[3]} could not be added`));
    }

    // Add Comments
    let schoolsData = await schoolData.getAllSchoolsData();
    // console.log(schoolsData);

    for (schData of schoolsData) {
      for (prof of schData.professors) {
        for (rev of prof.reviews) {
          try {
            await schoolService.addCommentToReview(
              new Date(),
              "I agree with the review!",
              schData._id,
              prof._id,
              rev._id,
              users[0][0]
            );
            // Add Thumbs Up
            await schoolService.addThumbsUpToReview(
              schData._id,
              prof._id,
              rev._id,
              users[2][0]
            );
            console.log(chalk.green("Comment added successfully"));
          } catch (err) {
            console.log(chalk.red("Comment could not be added"));
          }
          try {
            await schoolService.addCommentToReview(
              new Date(),
              "Partially agree with the review!",
              schData._id,
              prof._id,
              rev._id,
              users[1][0]
            );
            // Add Thumbs Down
            await schoolService.addThumbsDownToReview(
              schData._id,
              prof._id,
              rev._id,
              users[3][0]
            );
            console.log(chalk.green("Comment added successfully"));
          } catch (err) {
            console.log(chalk.red("Comment could not be added"));
          }
        }
      }
    }

    console.log(chalk.blue("Done seeding database"));
    await db.serverConfig.close();
  } catch (e) {
    console.error(e);
  }
})();
