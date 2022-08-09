const ENV = process.env.NODE_ENV || "test";

const { MongoClient } = require("mongodb");

require("dotenv").config({
  path: `${__dirname}/../${ENV}.env`,
});

const MONGO_PW = process.env.MONGO_PW;
const MONGO_USER = process.env.MONGO_USER;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PW}@test.tqgebtp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

module.exports = client;
