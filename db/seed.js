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

function main() {
  const client = new MongoClient(uri);
  return connectToCluster(client).then(() => {
    console.log("successfully connected to cluster");
    return dropDatabase(client)
      .then(() => {
        const userPromise = createCollection(client, "users", userData);
        const tripPromise = createCollection(client, "trips", tripData);
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

function createCollection(client, collectionName, data) {
  return client
    .db("test")
    .createCollection(collectionName)
    .then(() => {
      return client.db("test").collection(collectionName).insertMany(data);
    });
}

main();
