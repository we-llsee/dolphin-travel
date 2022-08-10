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

  describe("GET /api/trips?username=X", () => {
    it("200: Returns an array of trips for specified user", () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.trips)).toBe(true);
          expect(body.trips.length).toBe(3);
          body.trips.forEach((trip) => {
            expect(trip).toEqual(
              expect.objectContaining({
                _id: expect.any(String),
                tripName: expect.any(String),
                attending: expect.any(Array),
                startDate: expect.any(String),
                endDate: expect.any(String),
                budgetGBP: expect.any(Number),
                accommodation: expect.any(Object),
                days: expect.any(Array),
              })
            );
          });
        });
    });

    it("400: Returns {msg:Username Not Specified} when no username query", () => {
      return request(app)
        .get("/api/trips")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Username Not Specified");
        });
    });

    it("400: Returns {msg:Invalid Username} for invalid username query", () => {
      return request(app)
        .get("/api/trips?username=23")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid Username");
        });
    });

    it("404: Returns {msg:Username does not exist} when username cannot be found", () => {
      return request(app)
        .get("/api/trips?username=jimstevenson")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Username does not exist");
        });
    });
  });
});
