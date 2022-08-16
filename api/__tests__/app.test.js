const seed = require("../../db/seed");
const app = require("../app");
const request = require("supertest");

const appTests = () => {
  beforeAll(() => {
    return seed();
  });

  beforeEach(() => {
    if (process.env.TEST_FREQ === "each") {
      return seed();
    }
  });

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
              "DELETE /api/trips/:trip_id": expect.any(Object),
              "GET /api/users": expect.any(Object),
              "GET /api/users/:username": expect.any(Object),
              "PATCH /api/trips/:trip_id": expect.any(Object),
              "POST /api/trips/:trip_id": expect.any(Object),
              "GET /api/trips/:trip_id/:day_id": expect.any(Object),
              "POST /api/trips/:trip_id/:day_id": expect.any(Object),
            })
          );
        });
    });
  });
};

module.exports = appTests;
