const app = require("./app.js");
const { client } = require("../db/connection");

const { PORT = 3030 } = process.env;

client.connect().then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Now listening on port ${PORT}...`);
  });
});