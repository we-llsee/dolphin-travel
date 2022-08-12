const seed = require("../../db/seed");
const { client } = require("../../db/connection");
const app = require("../app");
const request = require("supertest");

jest.setTimeout(15000);

beforeEach(() => {
  return seed();
});

afterAll(() => client.close());

describe("Users", () => {
  it('200: GET /api/users returns an array of users on a key of "users"', () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        console.log(body);
      });
  });
});
