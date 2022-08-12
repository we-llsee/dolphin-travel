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
  it('200: GET /api/users?username=willclegg returns an array of users on a key of "users"', () => {
    return request(app)
      .get("/api/users?username=willclegg")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
      });
  });

  it('401: GET /api/users returns "You are unauthorised to access this resource""', () => {
    return request(app)
      .get("/api/users")
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("You are unauthorised to access this resource");
      });
  });

  it('401: GET /api/users?username=IMPOSTER returns "You are unauthorised to access this resource""', () => {
    return request(app)
      .get("/api/users?username=IMPOSTER")
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("You are unauthorised to access this resource");
      });
  });
});
