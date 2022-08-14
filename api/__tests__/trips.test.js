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
    it("404: Returns 'User 'X' does not exist.' when one username in the array is not in the users collection", () => {
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
        .expect(404)
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
    it("200: Returns an object containing the updated trip on a key of trip where details are changed and a person is added to the trip", () => {
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
              console.log(body);
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
              expect(body.trip.attending).toEqual([
                "willclegg",
                "alexrong",
                "mohamedelrofai",
              ]);
            });
        });
    });
    it("200: Returns an object containing the updated trip where a new creator has been assigned", () => {
      let trip_id;
      const changeTripData = {
        newCreator: "jesskemp",
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
              expect(body.trip.attending).toEqual([
                "jesskemp",
                "willclegg",
                "alexrong",
                "mohamedelrofai",
              ]);
            });
        });
    });
    it("200: Returns an object containing the updated trip when the creator has added people to the trip and assigned a new creator at the same time", () => {
      let trip_id;
      const changeTripData = {
        addPeople: ["jesskemp", "alexrong"],
        newCreator: "jesskemp",
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
              expect(body.trip.attending).toEqual([
                "jesskemp",
                "willclegg",
                "alexrong",
              ]);
            });
        });
    });
    it("200: Returns an object containing the updated trip when the creator has added a new person to the trip, assigned them as the creator and removed themselves at the same time", () => {
      let trip_id;
      const changeTripData = {
        addPeople: ["jesskemp"],
        newCreator: "jesskemp",
        removePeople: ["willclegg"],
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
              expect(body.trip.attending).toEqual(["jesskemp"]);
            });
        });
    });
    describe("General Errors", () => {
      it("401: Returns {msg: You are unauthorised to change this trip.} when a user not listed as attending attempts to change the trip", () => {
        let trip_id;
        const changeTripData = {
          tripName: "Greece Takeover!",
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=jesskemp`)
                .send(changeTripData)
                .expect(401)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("You are unauthorised to change this trip.");
                });
            })
        );
      });
      it("400: Returns {msg: Please provide details of the updates to be made.} when no details are provided on the request body.", () => {
        let trip_id;
        const changeTripData = {};
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe(
                    "Please provide details of the updates to be made."
                  );
                });
            })
        );
      });
      it("400: Returns {msg: Cannot update field 'country'.} when the user tries to update the country field (a field they cannot update).", () => {
        let trip_id;
        const changeTripData = {
          tripName: "Turkey Takeover",
          country: "Turkey",
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Cannot update field 'country'.");
                });
            })
        );
      });
    });
    describe("Username Errors", () => {
      it("400: Returns {msg: Username Not Specified} when no username query", () => {
        const changeTripData = {
          tripName: "Greece Takeover!",
        };
        return request(app)
          .get("/api/trips?username=willclegg")
          .then(({ body: { trips } }) => {
            const trip_id = trips[0]._id;
            return trip_id;
          })
          .then((trip_id) => {
            return request(app)
              .patch(`/api/trips/${trip_id}`)
              .send(changeTripData)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Username Not Specified");
              });
          });
      });
      it("400: Returns {msg: User 'X' is an invalid username.} for invalid username query", () => {
        const changeTripData = {
          tripName: "Greece Takeover!",
        };
        return request(app)
          .get("/api/trips?username=willclegg")
          .then(({ body: { trips } }) => {
            const trip_id = trips[0]._id;
            return trip_id;
          })
          .then((trip_id) => {
            return request(app)
              .patch(`/api/trips/${trip_id}?username=23`)
              .send(changeTripData)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("User '23' is an invalid username.");
              });
          });
      });
      it("404: Returns {msg: User 'jimstevenson' does not exist.} when username cannot be found", () => {
        const changeTripData = {
          tripName: "Greece Takeover!",
        };
        return request(app)
          .get("/api/trips?username=willclegg")
          .then(({ body: { trips } }) => {
            const trip_id = trips[0]._id;
            return trip_id;
          })
          .then((trip_id) => {
            return request(app)
              .patch(`/api/trips/${trip_id}?username=jimstevenson`)
              .send(changeTripData)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("User 'jimstevenson' does not exist.");
              });
          });
      });
    });
    describe("Trip ID Errors", () => {
      it("400: Returns {msg: trip_id 'X' is an invalid trip ID.} when a user tries to access a trip id with the wrong format.", () => {
        const changeTripData = {
          tripName: "Greece Takeover!",
        };
        return request(app)
          .patch(`/api/trips/234?username=alexrong`)
          .send(changeTripData)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("trip_id '234' is an invalid trip ID.");
          });
      });
      it("404: Returns {msg: trip_id 'X' does not exist.} when trip cannot be found", () => {
        const changeTripData = {
          tripName: "Greece Takeover!",
        };
        return request(app)
          .patch("/api/trips/507f1f77bcf86cd799439011?username=willclegg")
          .send(changeTripData)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "trip_id '507f1f77bcf86cd799439011' does not exist."
            );
          });
      });
    });
    describe("Trip Name Errors", () => {
      it("400: Returns 'tripName is not type 'string'.' for a tripName that is the wrong type", () => {
        let trip_id;
        const changeTripData = {
          tripName: 23,
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("tripName is not type 'string'.");
                });
            })
        );
      });
    });
    describe("Budget Errors", () => {
      it("400: Returns 'budgetGBP is not type 'number'.' for a budget that is the wrong type", () => {
        let trip_id;
        const changeTripData = {
          budgetGBP: "hello",
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("budgetGBP is not type 'number'.");
                });
            })
        );
      });
      it("400: Returns 'Budget cannot be £0 or less.' when the user tries to change the budget to be 0 or lower", () => {
        let trip_id;
        const changeTripData = {
          budgetGBP: -1000,
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Budget cannot be £0 or less.");
                });
            })
        );
      });
    });
    describe("Accommodation Errors", () => {
      it("400: Returns 'accommodation is not type 'object'.' for an accommodation that is the wrong type", () => {
        let trip_id;
        const changeTripData = {
          accommodation: ["hey"],
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("accommodation is not type 'object'.");
                });
            })
        );
      });
      it("400: Returns 'accommodationName is not type 'string'.' for an accommodation name that is the wrong type", () => {
        let trip_id;
        const changeTripData = {
          accommodation: {
            accommodationName: 268,
            latitude: 36.2648311,
            longitude: 29.409945,
            address: {},
          },
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("accommodationName is not type 'string'.");
                });
            })
        );
      });
      it("400: Returns 'latitude is not type 'number'.' for an latitude that is the wrong type", () => {
        let trip_id;
        const changeTripData = {
          accommodation: {
            accommodationName: "Hilton Hotel",
            latitude: "here",
            longitude: 29.409945,
            address: {},
          },
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("latitude is not type 'number'.");
                });
            })
        );
      });
      it("400: Returns 'longitude is not type 'number'.' for an longitude that is the wrong type", () => {
        let trip_id;
        const changeTripData = {
          accommodation: {
            accommodationName: "Hilton Hotel",
            latitude: 29.409945,
            longitude: [],
            address: {},
          },
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("longitude is not type 'number'.");
                });
            })
        );
      });
      it("400: Returns 'address is not type 'object'.' for an address that is the wrong type", () => {
        let trip_id;
        const changeTripData = {
          accommodation: {
            accommodationName: "Hilton Hotel",
            latitude: 29.409945,
            longitude: 36.2648311,
            address: true,
          },
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("address is not type 'object'.");
                });
            })
        );
      });
    });
    describe("Add People Errors", () => {
      it("400: Returns 'addPeople is not type 'array'.' for an addPeople request that is the wrong type", () => {
        let trip_id;
        const changeTripData = {
          addPeople: 256,
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("addPeople is not type 'array'.");
                });
            })
        );
      });
      it("400: Returns {msg: addPeople requires one or more usernames.} when no username are given in the array", () => {
        let trip_id;
        const changeTripData = {
          addPeople: [],
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("addPeople requires one or more usernames.");
                });
            })
        );
      });
      it("400: Returns {msg: User 'X' is an invalid username.} for invalid username query", () => {
        let trip_id;
        const changeTripData = {
          addPeople: [234],
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("User '234' is an invalid username.");
                });
            })
        );
      });
      it("404: Returns {msg: User 'jimstevenson' does not exist.} when username cannot be found", () => {
        let trip_id;
        const changeTripData = {
          addPeople: ["jimstevenson"],
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("User 'jimstevenson' does not exist.");
                });
            })
        );
      });
      it("400: Returns {msg: User 'jesskemp' is already attending.} when username cannot be found", () => {
        let trip_id;
        const changeTripData = {
          addPeople: ["jesskemp"],
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[2]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("User 'jesskemp' is already attending.");
                });
            })
        );
      });
    });
    describe("Remove People Erros", () => {
      it("400: Returns 'removePeople is not type 'array'.' for a removePeople request that is the wrong type", () => {
        let trip_id;
        const changeTripData = {
          removePeople: false,
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("removePeople is not type 'array'.");
                });
            })
        );
      });
      it("400: Returns {msg: removePeople requires one or more usernames.} when no username are given in the array", () => {
        let trip_id;
        const changeTripData = {
          removePeople: [],
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe(
                    "removePeople requires one or more usernames."
                  );
                });
            })
        );
      });
      it("400: Returns {msg: User 'X' is an invalid username.} for invalid username query", () => {
        let trip_id;
        const changeTripData = {
          removePeople: [true],
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("User 'true' is an invalid username.");
                });
            })
        );
      });
      it("404: Returns {msg: User 'jimstevenson' does not exist.} when username cannot be found", () => {
        let trip_id;
        const changeTripData = {
          removePeople: ["jimstevenson"],
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("User 'jimstevenson' does not exist.");
                });
            })
        );
      });
      it("401: Returns {msg: You are unauthorised to remove user 'X' from this trip.} when user who is not the creator or the person themselves tries to remove someone from the trip.", () => {
        let trip_id;
        const changeTripData = {
          removePeople: ["alexrong"],
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[2]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=jesskemp`)
                .send(changeTripData)
                .expect(401)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe(
                    "You are unauthorised to remove user 'alexrong' from this trip."
                  );
                });
            })
        );
      });
      it("400: Returns {msg: User 'X' is not listed as attending this trip.} when the user tries to remove someone who is not attending the trip.", () => {
        let trip_id;
        const changeTripData = {
          removePeople: ["alexrong"],
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe(
                    "User 'alexrong' is not listed as attending this trip."
                  );
                });
            })
        );
      });
      it("400: Returns {msg: Your trip must have a creator.} when the user tries to remove the one person on the trip (the creator).", () => {
        let trip_id;
        const changeTripData = {
          removePeople: ["willclegg"],
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Your trip must have a creator.");
                });
            })
        );
      });
      it("400: Returns {msg: Your trip must have a creator.} when the creator adds a new person to the trip and tries to remove thenselves without setting a new creator.", () => {
        let trip_id;
        const changeTripData = {
          addPeople: ["jesskemp"],
          removePeople: ["willclegg"],
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("Your trip must have a creator.");
                });
            })
        );
      });
    });
    describe("Start Date Errors", () => {
      it("400: Returns 'startDate is not type 'date'.' for a startDate that is the wrong type", () => {
        let trip_id;
        const changeTripData = {
          startDate: "hey",
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("startDate is not type 'date'.");
                });
            })
        );
      });
      it("400: Returns 'startDate cannot be in the past.' for a startDate that is in the past", () => {
        let trip_id;
        const changeTripData = {
          startDate: new Date(2019, 2, 12),
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("startDate cannot be in the past.");
                });
            })
        );
      });
      it("400: Returns 'startDate cannot be moved to after the endDate.' if given a startDate which is after the current endDate", () => {
        let trip_id;
        const changeTripData = {
          startDate: new Date(2024, 5, 10),
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe(
                    "startDate cannot be moved to after the endDate."
                  );
                });
            })
        );
      });
    });
    describe("End Date Errors", () => {
      it("400: Returns 'endDate is not type 'date'.' for a endDate that is the wrong type", () => {
        let trip_id;
        const changeTripData = {
          endDate: 26835,
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("endDate is not type 'date'.");
                });
            })
        );
      });
      it("400: Returns 'endDate cannot be before startDate.' if given an endDate which is before the current startDate", () => {
        let trip_id;
        const changeTripData = {
          endDate: new Date(2019, 2, 12),
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("endDate cannot be before startDate.");
                });
            })
        );
      });
      it("400: Returns 'endDate cannot be before startDate.' if given an endDate which is before the new startDate", () => {
        let trip_id;
        const changeTripData = {
          endDate: new Date(2023, 2, 12),
          startDate: new Date(2023, 3, 2),
        };
        return (
          request(app)
            // Will Clegg created the trip (first user listed in attending)
            .get("/api/trips?username=willclegg")
            .then(({ body: { trips } }) => {
              trip_id = trips[0]._id;
            })
            .then(() => {
              return request(app)
                .patch(`/api/trips/${trip_id}?username=willclegg`)
                .send(changeTripData)
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("endDate cannot be before startDate.");
                });
            })
        );
      });
    });
  });
});
