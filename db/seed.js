const util = require("util");

const ENV = process.env.NODE_ENV || "test";

const { MongoClient } = require("mongodb");

if (ENV !== "production") {
  require("dotenv").config({
    path: `${__dirname}/../${ENV}.env`,
  });
}

const MONGO_PW = process.env.MONGO_PW;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_HOST = process.env.MONGO_HOST;

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@${MONGO_HOST}/?retryWrites=true&w=majority`;

//data
const userData = require("./data/users");
const tripData = require("./data/trips");

//schema
const userSchema = require("./schemas/userSchema.json");
const tripSchema = require("./schemas/tripSchema.json");

function seed() {
  const client = new MongoClient(uri);
  return connectToCluster(client).then(() => {
    return dropDatabase(client)
      .then(() => {
        const userPromise = createCollection(
          client,
          "users",
          userData,
          userSchema
        );
        const tripPromise = createCollection(
          client,
          "trips",
          tripData,
          tripSchema
        );
        return Promise.all([userPromise, tripPromise]);
      })
      .then(() => {
        return client.close();
      });
  });
}

function connectToCluster(client) {
  return client.connect().catch((err) => {
    console.log(err);
    console.log("connection to the cluster has failed");
  });
}

function dropDatabase(client) {
  return client
    .db()
    .admin()
    .listDatabases()
    .then((dbs) => {
      dbs.databases.forEach((db) => {
        if (db.name === ENV) {
          const db = client.db(ENV);
          return db.dropDatabase();
        }
      });
    })
    .catch((err) => {
      console.log(`an error occured while trying to drop the ${ENV} database`);
      console.log(err);
    });
}

function createCollection(client, collectionName, data, schema = {}) {
  return client
    .db(ENV)
    .createCollection(collectionName, { validator: schema })
    .then(() => {
      return client.db(ENV).collection(collectionName).insertMany(data);
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
