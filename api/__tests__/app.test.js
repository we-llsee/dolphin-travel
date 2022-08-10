const seed = require("../../db/seed");
const { client } = require("../../db/connection");

// jest.setTimeout(15000);

beforeEach(() => {
  return seed();
});

afterAll(() => client.close());

describe("", () => {
  it("", () => {
    console.log("test1");
  });
});
