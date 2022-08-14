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
const client = new MongoClient(uri);

// client.connect()

const db = client.db(ENV);

module.exports = { client, db };
