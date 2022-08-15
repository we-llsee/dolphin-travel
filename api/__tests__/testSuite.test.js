const appTests = require("./app.test");
const userTests = require("./user.test");
const tripTests = require("./trip.test");
const dayTests = require("./day.test")
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
describe("Day Tests", dayTests);
