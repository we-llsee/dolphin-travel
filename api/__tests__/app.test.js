const seed = require("../../db/seed");
const { client } = require("../../db/connection");
const app = require("../app");
const request = require("supertest");
const { ObjectId } = require("bson");

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
            })
          );
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

    it("400: Returns {msg: User 'X' is an invalid username.} for invalid username query", () => {
      return request(app)
        .get("/api/trips?username=23")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("User '23' is an invalid username.");
        });
    });

    it("404: Returns {msg: User 'jimstevenson' does not exist.} when username cannot be found", () => {
      return request(app)
        .get("/api/trips?username=jimstevenson")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("User 'jimstevenson' does not exist.");
        });
    });
  });

  describe("POST /api/trips", () => {
    it("200: Returns an object containing the newly posted trip on a key of trip", () => {
      const newTripData = {
        tripName: "Turkey 2K22",
        attending: ["willclegg", "alexrong", "mohamedelrofai"],
        budgetGBP: 3000,
        startDate: new Date(2022, 9, 10),
        endDate: new Date(2022, 9, 17),
        country: "Turkey",
        accommodation: {
          accommodationName: "Meldi Hotel",
          latitude: 36.2648311,
          longitude: 29.409945,
          address: {
            name: "Meldi Hotel",
            road: "Nilüfer Sokak",
            city: "Kaş",
            state: "Antalya",
            postcode: "07960",
            country: "Turkey",
            country_code: "TR",
          },
        },
      };
      return request(app)
        .post("/api/trips")
        .send(newTripData)
        .expect(200)
        .then(({ body }) => {
          body.trip.startDate = new Date(body.trip.startDate);
          body.trip.endDate = new Date(body.trip.endDate);
          body.trip._id = new ObjectId(body.trip._id);
          expect(body.trip).toEqual(
            expect.objectContaining({
              ...newTripData,
              days: [],
              _id: expect.any(ObjectId),
            })
          );
        });
    });
    it("400: Returns 'startDate is not type 'date'.' for a startDate that is the wrong type", () => {
      const newTripData = {
        tripName: "Turkey 2K22",
        attending: ["willclegg", "alexrong", "mohamedelrofai"],
        budgetGBP: 3000,
        startDate: "sandwiches",
        endDate: new Date(2022, 9, 17),
        country: "Turkey",
        accommodation: {
          accommodationName: "Meldi Hotel",
          latitude: 36.2648311,
          longitude: 29.409945,
          address: {
            name: "Meldi Hotel",
            road: "Nilüfer Sokak",
            city: "Kaş",
            state: "Antalya",
            postcode: "07960",
            country: "Turkey",
            country_code: "TR",
          },
        },
      };
      return request(app)
        .post("/api/trips")
        .send(newTripData)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("startDate is not type 'date'.");
        });
    });
    it("400: Returns 'latitude is not a number.' for a latitude that is the wrong type", () => {
      const newTripData = {
        tripName: "Turkey 2K22",
        attending: ["willclegg", "alexrong", "mohamedelrofai"],
        budgetGBP: 3000,
        startDate: new Date(2022, 9, 16),
        endDate: new Date(2022, 9, 17),
        country: "Turkey",
        accommodation: {
          accommodationName: "Meldi Hotel",
          latitude: "hello",
          longitude: 29.409945,
          address: {
            name: "Meldi Hotel",
            road: "Nilüfer Sokak",
            city: "Kaş",
            state: "Antalya",
            postcode: "07960",
            country: "Turkey",
            country_code: "TR",
          },
        },
      };
      return request(app)
        .post("/api/trips")
        .send(newTripData)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("latitude is not type 'number'.");
        });
    });
    it("400: Returns 'attending is not an array.' for a list of attending users that is the wrong type", () => {
      const newTripData = {
        tripName: "Turkey 2K22",
        attending: {
          name1: "willclegg",
          name2: "alexrong",
          name3: "mohamedelrofai",
        },
        budgetGBP: 3000,
        startDate: new Date(2022, 9, 16),
        endDate: new Date(2022, 9, 17),
        country: "Turkey",
        accommodation: {
          accommodationName: "Meldi Hotel",
          latitude: 29.409945,
          longitude: 29.409945,
          address: {
            name: "Meldi Hotel",
            road: "Nilüfer Sokak",
            city: "Kaş",
            state: "Antalya",
            postcode: "07960",
            country: "Turkey",
            country_code: "TR",
          },
        },
      };
      return request(app)
        .post("/api/trips")
        .send(newTripData)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("attending is not type 'array'.");
        });
    });
    it("400: Returns 'budgetGBP has not been provided.' if no budget is provided on the request", () => {
      const newTripData = {
        tripName: "Turkey 2K22",
        attending: ["willclegg"],
        startDate: new Date(2022, 9, 16),
        endDate: new Date(2022, 9, 17),
        country: "Turkey",
        accommodation: {
          accommodationName: "Meldi Hotel",
          latitude: 29.409945,
          longitude: 29.409945,
          address: {
            name: "Meldi Hotel",
            road: "Nilüfer Sokak",
            city: "Kaş",
            state: "Antalya",
            postcode: "07960",
            country: "Turkey",
            country_code: "TR",
          },
        },
      };
      return request(app)
        .post("/api/trips")
        .send(newTripData)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("budgetGBP has not been provided.");
        });
    });
    it("400: Returns 'startDate cannot be in the past.' if given a startDate in the past", () => {
      const newTripData = {
        tripName: "Turkey 2K22",
        attending: ["willclegg"],
        budgetGBP: 3000,
        startDate: new Date(2021, 2, 8),
        endDate: new Date(2022, 9, 17),
        country: "Turkey",
        accommodation: {
          accommodationName: "Meldi Hotel",
          latitude: 29.409945,
          longitude: 29.409945,
          address: {
            name: "Meldi Hotel",
            road: "Nilüfer Sokak",
            city: "Kaş",
            state: "Antalya",
            postcode: "07960",
            country: "Turkey",
            country_code: "TR",
          },
        },
      };
      return request(app)
        .post("/api/trips")
        .send(newTripData)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("startDate cannot be in the past.");
        });
    });
    it("400: Returns 'endDate cannot be before startDate.' if given an endDate before a startDate", () => {
      const newTripData = {
        tripName: "Turkey 2K22",
        attending: ["willclegg"],
        budgetGBP: 3000,
        startDate: new Date(2022, 10, 8),
        endDate: new Date(2022, 4, 4),
        country: "Turkey",
        accommodation: {
          accommodationName: "Meldi Hotel",
          latitude: 29.409945,
          longitude: 29.409945,
          address: {
            name: "Meldi Hotel",
            road: "Nilüfer Sokak",
            city: "Kaş",
            state: "Antalya",
            postcode: "07960",
            country: "Turkey",
            country_code: "TR",
          },
        },
      };
      return request(app)
        .post("/api/trips")
        .send(newTripData)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("endDate cannot be before startDate.");
        });
    });
    it("400: Returns 'User 'X' does not exist.' when one username in the array is not in the users collection", () => {
      const newTripData = {
        tripName: "Turkey 2K22",
        attending: ["willclegg", "jessk"],
        budgetGBP: 3000,
        startDate: new Date(2022, 10, 8),
        endDate: new Date(2022, 10, 18),
        country: "Turkey",
        accommodation: {
          accommodationName: "Meldi Hotel",
          latitude: 29.409945,
          longitude: 29.409945,
          address: {
            name: "Meldi Hotel",
            road: "Nilüfer Sokak",
            city: "Kaş",
            state: "Antalya",
            postcode: "07960",
            country: "Turkey",
            country_code: "TR",
          },
        },
      };
      return request(app)
        .post("/api/trips")
        .send(newTripData)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("User 'jessk' does not exist.");
        });
    });
    it.only("400: Returns 'Budget cannot be £0 or less.' when the user gives a budget that is negative or 0", () => {
      const newTripData = {
        tripName: "Turkey 2K22",
        attending: ["willclegg", "jesskemp"],
        budgetGBP: 0,
        startDate: new Date(2022, 10, 8),
        endDate: new Date(2022, 10, 18),
        country: "Turkey",
        accommodation: {
          accommodationName: "Meldi Hotel",
          latitude: 29.409945,
          longitude: 29.409945,
          address: {
            name: "Meldi Hotel",
            road: "Nilüfer Sokak",
            city: "Kaş",
            state: "Antalya",
            postcode: "07960",
            country: "Turkey",
            country_code: "TR",
          },
        },
      };
      return request(app)
        .post("/api/trips")
        .send(newTripData)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Budget cannot be £0 or less.");
        });
    });
  });
});
