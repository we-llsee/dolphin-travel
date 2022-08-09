const util = require("util");

const ENV = process.env.NODE_ENV || "test";

const { MongoClient } = require("mongodb");

require("dotenv").config({
  path: `${__dirname}/../${ENV}.env`,
});

const MONGO_PW = process.env.MONGO_PW;
const MONGO_USER = process.env.MONGO_USER;

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@test.tqgebtp.mongodb.net/?retryWrites=true&w=majority`;

//data
const userData = require("./data/users");
const tripData = require("./data/trips");

//schema
const userSchema = require("./schemas/userSchema.json");
const tripSchema = require("./schemas/tripSchema.json");

function main() {
  const client = new MongoClient(uri);
  return connectToCluster(client).then(() => {
    console.log("successfully connected to cluster");
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
      .then(([listing1, listing2]) => {
        console.log(listing1);
        console.log(listing2);
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
        if (db.name === "test") {
          const db = client.db("test");
          return db.dropDatabase();
        }
      });
    });
}

function createCollection(client, collectionName, data, schema = {}) {
  return client
    .db("test")
    .createCollection(collectionName, { validator: schema })
    .then(() => {
      return client.db("test").collection(collectionName).insertMany(data);
    })
    .catch((err) => {
      if (err.code === 121) {
        console.log("validation error - data does not adhere to schema");
        console.log(
          util.inspect(err, { showHidden: false, depth: null, colors: true })
        );
        // console.log(err.result.result.writeErrors[0].err.errInfo.details.schemaRulesNotSatisfied);
        // err.writeErrors.forEach(err=>{
        //   console.log(err.errInfo.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied.forEach(property => {
        //     console.log(property.details)
        //   }))
        // })
      } else {
        console.log("error >>", err);
      }
    });
}

main();
