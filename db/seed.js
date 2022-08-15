const util = require("util");

const { db } = require("./connection");

//data
const userData = require("./data/users");
const tripData = require("./data/trips");

//schema
const userSchema = require("./schemas/userSchema.json");
const tripSchema = require("./schemas/tripSchema.json");

function seed() {
  return dropDatabase().then(() => {
    const userPromise = createCollection("users", userData, userSchema);
    const tripPromise = createCollection("trips", tripData, tripSchema);
    return Promise.all([userPromise, tripPromise]);
  });
}

function dropDatabase() {
  return db.dropDatabase();
}

function createCollection(collectionName, data, schema = {}) {
  return db
    .createCollection(collectionName, { validator: schema })
    .then(() => {
      return db.collection(collectionName).insertMany(data);
    })
    .catch((err) => {
      if (err.code === 121) {
        console.log("validation error - data does not adhere to schema");
        console.log(
          util.inspect(err, { showHidden: false, depth: null, colors: true })
        );
      } else {
        console.log(
          `an error occured while trying to create and populate the ${collectionName} collection`,
          err
        );
      }
    });
}

module.exports = seed;
