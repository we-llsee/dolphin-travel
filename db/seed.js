const util = require("util");

// const ENV = process.env.NODE_ENV || "test";

// const { MongoClient } = require("mongodb");

// if (ENV !== "production") {
//   require("dotenv").config({
//     path: `${__dirname}/../${ENV}.env`,
//   });
// }

// const MONGO_PW = process.env.MONGO_PW;
// const MONGO_USER = process.env.MONGO_USER;
// const MONGO_HOST = process.env.MONGO_HOST;

// const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@${MONGO_HOST}/?retryWrites=true&w=majority`;

const { db } = require("./connection");

//data
const userData = require("./data/users");
const tripData = require("./data/trips");

//schema
const userSchema = require("./schemas/userSchema.json");
const tripSchema = require("./schemas/tripSchema.json");

function seed() {
  // const client = new MongoClient(uri);
  // return connectToCluster(client).then(() => {
  return dropDatabase().then(() => {
    const userPromise = createCollection("users", userData, userSchema);
    const tripPromise = createCollection("trips", tripData, tripSchema);
    return Promise.all([userPromise, tripPromise]);
  });
  // });
}

// function connectToCluster(client) {
//   return client.connect().catch((err) => {
//     console.log(err);
//     console.log("connection to the cluster has failed");
//   });
// }

function dropDatabase() {
  // return client.db('test').dropDatabase();
  return db.dropDatabase();
}

function createCollection(collectionName, data, schema = {}) {
  // return client
  //   .db(ENV)
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
