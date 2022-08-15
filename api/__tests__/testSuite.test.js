const appTests = require("./app.test");
const userTests = require("./users.test");
const tripTests = require("./trips.test");
const { client } = require("../../db/connection");

beforeAll(() => {
  return client.connect();
});

afterAll(() => {
  return client.close();
});

describe("App Tests", appTests);
describe("User Tests", userTests);
describe("Trip Tests", tripTests);
