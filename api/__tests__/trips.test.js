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

describe("Trips", () => {
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
    it("400: Returns 'Budget cannot be £0 or less.' when the user gives a budget that is negative or 0", () => {
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
    it("400: Returns 'Country 'X' does not exist'. when the user gives a country that does not exist", () => {
      const newTripData = {
        tripName: "Turkey 2K22",
        attending: ["willclegg", "jesskemp"],
        budgetGBP: 5000,
        startDate: new Date(2022, 10, 8),
        endDate: new Date(2022, 10, 18),
        country: "Sandwich",
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
          expect(msg).toBe("Country 'Sandwich' does not exist.");
        });
    });
  });
  describe("GET /api/trips/:trip_id?username=X", () => {
    it("200: Returns an object containing the trip requested", () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body: { trips } }) => {
          const trip_id = trips[0]._id;
          return trip_id;
        })
        .then((trip_id) => {
          return request(app)
            .get(`/api/trips/${trip_id}?username=willclegg`)
            .expect(200)
            .then(({ body: { trip } }) => {
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
    it("400: Returns {msg: Username Not Specified} when no username query", () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body: { trips } }) => {
          const trip_id = trips[0]._id;
          return trip_id;
        })
        .then((trip_id) => {
          return request(app)
            .get(`/api/trips/${trip_id}`)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Username Not Specified");
            });
        });
    });
    it("400: Returns {msg: User 'X' is an invalid username.} for invalid username query", () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body: { trips } }) => {
          const trip_id = trips[0]._id;
          return trip_id;
        })
        .then((trip_id) => {
          return request(app)
            .get(`/api/trips/${trip_id}?username=23`)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("User '23' is an invalid username.");
            });
        });
    });
    it("404: Returns {msg: User 'jimstevenson' does not exist.} when username cannot be found", () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body: { trips } }) => {
          const trip_id = trips[0]._id;
          return trip_id;
        })
        .then((trip_id) => {
          return request(app)
            .get(`/api/trips/${trip_id}?username=jimstevenson`)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("User 'jimstevenson' does not exist.");
            });
        });
    });
    it("401: Returns {msg: You are unauthorised to access this trip.} when a user not listed as attending on the trip tries to access the trip using it's ID", () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body: { trips } }) => {
          const trip_id = trips[0]._id;
          return trip_id;
        })
        .then((trip_id) => {
          return request(app)
            .get(`/api/trips/${trip_id}?username=alexrong`)
            .expect(401)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("You are unauthorised to access this trip.");
            });
        });
    });
    it("400: Returns {msg: trip_id 'X' is an invalid trip ID.} when a user tries to access a trip id with the wrong format.", () => {
      return request(app)
        .get(`/api/trips/234?username=alexrong`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("trip_id '234' is an invalid trip ID.");
        });
    });
    it("404: Returns {msg: trip_id 'X' does not exist.} when trip cannot be found", () => {
      return request(app)
        .get("/api/trips/507f1f77bcf86cd799439011?username=willclegg")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "trip_id '507f1f77bcf86cd799439011' does not exist."
          );
        });
    });
  });
  describe("DELETE /api/trips/:trip_id?username=X", () => {
    it("204 no content: successfully deletes the specified trip", () => {
      let trip_id;
      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body: { trips } }) => {
          trip_id = trips[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(`/api/trips/${trip_id}?username=willclegg`)
            .expect(204);
        })
        .then(() => {
          return request(app)
            .get(`/api/trips/${trip_id}?username=willclegg`)
            .expect(404);
        });
    });
    it("401: Returns {msg: You are unauthorised to delete this trip.} when a user who did not create the trip attempts to delete the trip", () => {
      let trip_id;
      return (
        request(app)
          // Will Clegg created the trip (first user listed in attending)
          .get("/api/trips?username=jesskemp")
          .then(({ body: { trips } }) => {
            trip_id = trips[0]._id;
          })
          .then(() => {
            return request(app)
              .delete(`/api/trips/${trip_id}?username=alexrong`)
              .expect(401)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("You are unauthorised to delete this trip.");
              });
          })
      );
    });
    it("400: Returns {msg: Username Not Specified} when no username query", () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body: { trips } }) => {
          const trip_id = trips[0]._id;
          return trip_id;
        })
        .then((trip_id) => {
          return request(app)
            .delete(`/api/trips/${trip_id}`)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Username Not Specified");
            });
        });
    });
    it("400: Returns {msg: User 'X' is an invalid username.} for invalid username query", () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body: { trips } }) => {
          const trip_id = trips[0]._id;
          return trip_id;
        })
        .then((trip_id) => {
          return request(app)
            .delete(`/api/trips/${trip_id}?username=23`)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("User '23' is an invalid username.");
            });
        });
    });
    it("404: Returns {msg: User 'jimstevenson' does not exist.} when username cannot be found", () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body: { trips } }) => {
          const trip_id = trips[0]._id;
          return trip_id;
        })
        .then((trip_id) => {
          return request(app)
            .delete(`/api/trips/${trip_id}?username=jimstevenson`)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("User 'jimstevenson' does not exist.");
            });
        });
    });
    it("400: Returns {msg: trip_id 'X' is an invalid trip ID.} when a user tries to access a trip id with the wrong format.", () => {
      return request(app)
        .delete(`/api/trips/234?username=alexrong`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("trip_id '234' is an invalid trip ID.");
        });
    });
    it("404: Returns {msg: trip_id 'X' does not exist.} when trip cannot be found", () => {
      return request(app)
        .delete("/api/trips/507f1f77bcf86cd799439011?username=willclegg")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "trip_id '507f1f77bcf86cd799439011' does not exist."
          );
        });
    });
  });
  describe("PATCH /api/trips/:trip_id?username=X", () => {
    it.only("200: Returns an object containing the updated trip on a key of trip where details are changed and a person is added to the trip", () => {
      let trip_id;
      const changeTripData = {
        tripName: "Wedding in Greece",
        addPeople: ["mohamedelrofai"],
        startDate: new Date(2023, 6, 10),
        endDate: new Date(2023, 6, 16),
        budgetGBP: 1200,
        accommodation: {
          accommodationName: "Hilton",
          latitude: 37.9756481,
          longitude: 23.751097,
          address: {
            parking: "Hilton",
            road: "Βασιλίσσης Σοφίας",
            suburb: "Kolonaki",
            city_district: "1st District of Athens",
            city: "Athens",
            municipality: "Municipality of Athens",
            county: "Regional Unit of Central Athens",
            state_district: "Attica",
            state: "Attica",
            postcode: "11528",
            country: "Greece",
            country_code: "gr",
          },
        },
      };
      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body: { trips } }) => {
          trip_id = trips[0]._id;
        })
        .then(() => {
          return request(app)
            .patch(`/api/trips/${trip_id}?username=willclegg`)
            .send(changeTripData)
            .expect(200)
            .then(({ body }) => {
              body.trip._id = new ObjectId(body.trip._id);
              expect(body.trip).toEqual({
                _id: new ObjectId(trip_id),
                tripName: "Wedding in Greece",
                attending: ["willclegg", "mohamedelrofai"],
                startDate: "2023-07-09T23:00:00.000Z",
                endDate: "2023-07-15T23:00:00.000Z",
                budgetGBP: 1200,
                country: "Greece",
                accommodation: {
                  accommodationName: "Hilton",
                  latitude: 37.9756481,
                  longitude: 23.751097,
                  address: {
                    parking: "Hilton",
                    road: "Βασιλίσσης Σοφίας",
                    suburb: "Kolonaki",
                    city_district: "1st District of Athens",
                    city: "Athens",
                    municipality: "Municipality of Athens",
                    county: "Regional Unit of Central Athens",
                    state_district: "Attica",
                    state: "Attica",
                    postcode: "11528",
                    country: "Greece",
                    country_code: "gr",
                  },
                },
                days: [
                  {
                    _id: expect.any(String),
                    dayNumber: 1,
                    activities: [
                      {
                        _id: expect.any(String),
                        activityName: "Mykonos Dive Center",
                        latitude: 37.41,
                        longitude: 25.356,
                        address: {
                          name: "Mykonos Dive Center",
                          road: "f",
                          city: "Plintri",
                          state: "Aegean",
                          postcode: "84600",
                          country: "Greece",
                          country_code: "GR",
                        },
                        type: "sport",
                      },
                    ],
                  },
                  {
                    _id: expect.any(String),
                    dayNumber: 2,
                    activities: [
                      {
                        _id: expect.any(String),
                        activityName: "Jackie O' Beach Club",
                        latitude: 37.414,
                        longitude: 25.367,
                        address: {
                          address:
                            "Jackie O' Beach Club, Μύκονος 84600, Greece",
                        },
                        type: "bar",
                      },
                    ],
                  },
                ],
              });
            });
        });
    });
    it("200: Returns an object containing the updated trip where a person has been removed from the trip", () => {
      let trip_id;
      const changeTripData = {
        removePeople: ["jesskemp"],
      };
      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body: { trips } }) => {
          trip_id = trips[2]._id;
        })
        .then(() => {
          return request(app)
            .patch(`/api/trips/${trip_id}?username=willclegg`)
            .send(changeTripData)
            .expect(200)
            .then(({ body }) => {
              expect(body.attending).toEqual([
                "willclegg",
                "alexrong",
                "mohammedelrofai",
              ]);
            });
        });
    });
  });
});
