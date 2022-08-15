require("dotenv").config({
  path: `${__dirname}/../${process.env.NODE_ENV}.env`,
});
const { client } = require("./connection");
const seed = require("./seed");

function runSeed() {
  return client
    .connect()
    .then(() => {
      console.log("Mongo client connected");
      return seed();
    })
    .then(() => {
      console.log("Production DB seeded");
      return client.close();
    });
}

runSeed();
