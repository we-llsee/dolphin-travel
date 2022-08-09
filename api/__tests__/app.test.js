const seed = require("../../db/seed");

jest.setTimeout(15000);

beforeEach(() => {
  return seed();
});

afterAll(() => {});

describe("", () => {
  it("", () => {
    console.log("test1");
  });
});
