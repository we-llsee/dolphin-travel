const seed = require("../../db/seed");
const { client } = require("../../db/connection");

const app = require("../app");
const request = require("supertest");

jest.setTimeout(15000);

beforeEach(() => {
  return seed();
});

afterAll(() => client.close());

describe("Express App", () => {
  describe("General Error Handling", () => {
    it("404: Specified path not found (e.g. /trips)", () => {
      return request(app)
        .get("/TRIPS")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid Path");
        });
    });
  });

  describe("GET /api", () => {
    it("200: Returns an object with keys describing the different endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toEqual(
            expect.objectContaining({
              "GET /api/trips": expect.any(Object),
              "POST /api/trips": expect.any(Object),
              "GET /api/trips/:trip_id": expect.any(Object),
            })
          );
        });
    });
  });
});
