const dbConnection = require("../config/mongoConnection");
const data = require("../data/");

(async () => {
  try {
    const db = await dbConnection();
    await db.dropDatabase();

    // TODO - logic for seeding DB

    console.log("Done seeding database");
    await db.serverConfig.close();
  } catch (e) {
    console.error(e);
  }
})();
