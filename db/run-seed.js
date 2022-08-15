const seed = require("./seed");
const { client } = require("./connection");

function runSeed() {
  return client.connect().then(() => {
    return seed();
  });
}

runSeed();
