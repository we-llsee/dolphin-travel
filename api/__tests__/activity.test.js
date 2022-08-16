const seed = require("../../db/seed");
const app = require("../app");
const request = require("supertest");

jest.setTimeout(15000);

const activityTests = () => {
  beforeAll(() => {
    return seed();
  });

  beforeEach(() => {
    if (process.env.TEST_FREQ === "each") {
      return seed();
    }
  });

  describe("POST /api/trips/:trip_id/:day_id/activities", () => {
    it("201: Returns an object containing the new activity on a key of activity", () => {
      let trip_id;
      let day_id;
      const newActivity = {
        username: "jesskemp",
        activityName: "Trevi Fountain",
        latitude: 41.9009778,
        longitude: 12.483284842339874,
        address: {
          attraction: "Trevi Fountain",
          road: "Piazza di Trevi",
          quarter: "Trevi",
          suburb: "Municipio Roma I",
          city: "Rome",
          county: "Roma Capitale",
          state: "Lazio",
          postcode: "00187",
          country: "Italy",
          country_code: "it",
        },
        type: "attraction",
      };
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .post(`/api/trips/${trip_id}/${day_id}`)
            .send(newActivity)
            .expect(201)
            .then(({ body: { activity } }) => {
              expect(activity).toEqual({
                _id: expect.any(String),
                activityName: "Trevi Fountain",
                latitude: 41.9009778,
                longitude: 12.483284842339874,
                address: {
                  attraction: "Trevi Fountain",
                  road: "Piazza di Trevi",
                  quarter: "Trevi",
                  suburb: "Municipio Roma I",
                  city: "Rome",
                  county: "Roma Capitale",
                  state: "Lazio",
                  postcode: "00187",
                  country: "Italy",
                  country_code: "it",
                },
                type: "attraction",
              });
            });
        });
    });
    it("201: Returns an object containing the new activity on a key of activity when a type is not provided", () => {
      let trip_id;
      let day_id;
      const newActivity = {
        username: "jesskemp",
        activityName: "Trevi Fountain",
        latitude: 41.9009778,
        longitude: 12.483284842339874,
        address: {},
      };
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .post(`/api/trips/${trip_id}/${day_id}`)
            .send(newActivity)
            .expect(201)
            .then(({ body: { activity } }) => {
              expect(activity).toEqual({
                _id: expect.any(String),
                activityName: "Trevi Fountain",
                latitude: 41.9009778,
                longitude: 12.483284842339874,
                address: {},
                type: "other",
              });
            });
        });
    });
    it("400: Returns {msg: User 'X' is an invalid username.} for invalid username query", () => {
      let trip_id;
      let day_id;
      const newActivity = {
        username: 136842,
        activityName: "Trevi Fountain",
        latitude: 41.9009778,
        longitude: 12.483284842339874,
        address: {},
        type: "attraction",
      };
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .post(`/api/trips/${trip_id}/${day_id}`)
            .send(newActivity)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("User '136842' is an invalid username.");
            });
        });
    });
    it("400: Returns {msg: Username Not Specified} when no username query", () => {
      let trip_id;
      let day_id;
      const newActivity = {
        activityName: "Trevi Fountain",
        latitude: 41.9009778,
        longitude: 12.483284842339874,
        address: {},
        type: "attraction",
      };
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .post(`/api/trips/${trip_id}/${day_id}`)
            .send(newActivity)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Username Not Specified");
            });
        });
    });
    it("404: Returns {msg: User 'jimstevenson' does not exist.} when username cannot be found", () => {
      let trip_id;
      let day_id;
      const newActivity = {
        username: "jimstevenson",
        activityName: "Trevi Fountain",
        latitude: 41.9009778,
        longitude: 12.483284842339874,
        address: {},
        type: "attraction",
      };
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .post(`/api/trips/${trip_id}/${day_id}`)
            .send(newActivity)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("User 'jimstevenson' does not exist.");
            });
        });
    });
    it("400: Returns {msg: 'X' is an invalid trip_id.} when a user tries to access a trip id with the wrong format.", () => {
      let day_id;
      const newActivity = {
        username: "jesskemp",
        activityName: "Trevi Fountain",
        latitude: 41.9009778,
        longitude: 12.483284842339874,
        address: {},
        type: "attraction",
      };
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .post(`/api/trips/5472/${day_id}`)
            .send(newActivity)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("'5472' is an invalid trip_id.");
            });
        });
    });
    it("404: Returns {msg: trip_id 'X' does not exist.} when trip cannot be found", () => {
      let day_id;
      const newActivity = {
        username: "jesskemp",
        activityName: "Trevi Fountain",
        latitude: 41.9009778,
        longitude: 12.483284842339874,
        address: {},
        type: "attraction",
      };
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .post(`/api/trips/507f1f77bcf86cd799439011/${day_id}`)
            .send(newActivity)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                "trip_id '507f1f77bcf86cd799439011' does not exist."
              );
            });
        });
    });
    it("400: Returns {msg: 'true' is an invalid day_id.} when a user tries to access a day id with the wrong format.", () => {
      let trip_id;
      const newActivity = {
        username: "jesskemp",
        activityName: "Trevi Fountain",
        latitude: 41.9009778,
        longitude: 12.483284842339874,
        address: {},
        type: "attraction",
      };
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
        })
        .then(() => {
          return request(app)
            .post(`/api/trips/${trip_id}/true`)
            .send(newActivity)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("'true' is an invalid day_id.");
            });
        });
    });
    it("404: Returns {msg: day_id 'X' does not exist.} when day cannot be found", () => {
      let trip_id;
      const newActivity = {
        username: "jesskemp",
        activityName: "Trevi Fountain",
        latitude: 41.9009778,
        longitude: 12.483284842339874,
        address: {},
        type: "attraction",
      };
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
        })
        .then(() => {
          return request(app)
            .post(`/api/trips/${trip_id}/507f1f77bcf86cd799439011`)
            .send(newActivity)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                "day_id '507f1f77bcf86cd799439011' does not exist."
              );
            });
        });
    });
    it("400: Returns {msg: activityName is not type 'string'.} when the activityName is the wrong type", () => {
      let trip_id;
      let day_id;
      const newActivity = {
        username: "jesskemp",
        activityName: false,
        latitude: 41.9009778,
        longitude: 12.483284842339874,
        address: {},
        type: "attraction",
      };
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .post(`/api/trips/${trip_id}/${day_id}`)
            .send(newActivity)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("activityName is not type 'string'.");
            });
        });
    });
    it("400: Returns {msg: address has not been provided.} when no address is provided", () => {
      let trip_id;
      let day_id;
      const newActivity = {
        username: "jesskemp",
        activityName: "Trevi Fountain",
        latitude: 41.9009778,
        longitude: 12.483284842339874,
        type: "attraction",
      };
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .post(`/api/trips/${trip_id}/${day_id}`)
            .send(newActivity)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("address has not been provided.");
            });
        });
    });
    it("401: Returns {msg: You are unauthorised to access this trip.} when the user is not attending the trip", () => {
      let trip_id;
      let day_id;
      const newActivity = {
        username: "willclegg",
        activityName: "Trevi Fountain",
        latitude: 41.9009778,
        longitude: 12.483284842339874,
        address: {},
        type: "attraction",
      };
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .post(`/api/trips/${trip_id}/${day_id}`)
            .send(newActivity)
            .expect(401)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("You are unauthorised to access this trip.");
            });
        });
    });
  });

  describe("GET /api/trips/:trip_id/:day_id/activities", () => {
    it("200: /api/trips/validtrip/validday/activities returns activities array on a key of activies", () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body }) => {
          const testTripId = body.trips[1]._id;
          const testDayId = body.trips[1].days[1]._id;
          return request(app)
            .get(
              `/api/trips/${testTripId}/${testDayId}/activities?username=willclegg`
            )
            .expect(200);
        })
        .then(({ body }) => {
          expect(Array.isArray(body.activities)).toBe(true);
          body.activities.forEach((activity) => {
            expect(activity).toEqual(
              expect.objectContaining({
                _id: expect.any(String),
                activityName: expect.any(String),
                latitude: expect.any(Number),
                longitude: expect.any(Number),
                address: expect.any(Object),
                type: expect.any(String),
              })
            );
          });
        });
    });

    it("200: /api/trips/validtrip/validday/activities returns an empty activities array for a new day", () => {
      let trip_id;
      const createDay = {
        username: "willclegg",
        dayNumber: 3,
      };

      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body: { trips } }) => {
          trip_id = trips[0]._id;
          return request(app)
            .post(`/api/trips/${trip_id}`)
            .send(createDay)
            .expect(201);
        })
        .then(({ body: { day } }) => {
          return request(app)
            .get(
              `/api/trips/${trip_id}/${day._id}/activities?username=willclegg`
            )
            .expect(200);
        })
        .then(({ body }) => {
          expect(Array.isArray(body.activities)).toBe(true);
          expect(body.activities.length).toBe(0);
        });
    });

    it("400: /api/trips/INVALIDTRIP/validday/activities returns an invalid trip_id error", () => {
      let testDayId;

      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body }) => {
          testDayId = body.trips[0].days[0]._id;
          return request(app)
            .get(`/api/trips/1/${testDayId}/activities?username=willclegg`)
            .expect(400);
        })
        .then(({ body }) => {
          expect(body.msg).toBe(`'1' is an invalid trip_id.`);
        });
    });

    it("400: /api/trips/validtrip/INVALIDDAY/activities returns an invalid day_id error", () => {
      let testTripId;

      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body }) => {
          testTripId = body.trips[0]._id;
          return request(app)
            .get(`/api/trips/${testTripId}/a/activities?username=willclegg`)
            .expect(400);
        })
        .then(({ body }) => {
          expect(body.msg).toBe(`'a' is an invalid day_id.`);
        });
    });

    it("400: /api/trips/validtrip/validday/activities?username=INVALIDUSER returns an invalid username error", () => {
      let testTripId;
      let testDayId;

      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body }) => {
          testTripId = body.trips[0]._id;
          testDayId = body.trips[0].days[0]._id;
          return request(app)
            .get(`/api/trips/${testTripId}/${testDayId}/activities?username=12`)
            .expect(400);
        })
        .then(({ body }) => {
          expect(body.msg).toBe(`User '12' is an invalid username.`);
        });
    });

    it("401: /api/trips/validtrip/validday/activities?username=UNAUTHUSER returns an unauthorised error", () => {
      let testTripId;
      let testDayId;

      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body }) => {
          testTripId = body.trips[0]._id;
          testDayId = body.trips[0].days[0]._id;
          return request(app)
            .get(
              `/api/trips/${testTripId}/${testDayId}/activities?username=jesskemp`
            )
            .expect(401);
        })
        .then(({ body }) => {
          expect(body.msg).toBe(`You are unauthorised to access this trip.`);
        });
    });

    it("404: /api/trips/validtrip/validday/activities?username=NONEXISTENTUSER returns a user not found error", () => {
      let testTripId;
      let testDayId;

      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body }) => {
          testTripId = body.trips[0]._id;
          testDayId = body.trips[0].days[0]._id;
          return request(app)
            .get(
              `/api/trips/${testTripId}/${testDayId}/activities?username=jekemp`
            )
            .expect(404);
        })
        .then(({ body }) => {
          expect(body.msg).toBe(`User 'jekemp' does not exist.`);
        });
    });

    it("404: /api/trips/NONEXISTENTTRIP/validday/activities returns a trip not found error", () => {
      let testDayId;

      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body }) => {
          testDayId = body.trips[0].days[0]._id;
          return request(app)
            .get(
              `/api/trips/eeeeeeeeeeeeeeeeeeeeeeee/${testDayId}/activities?username=willclegg`
            )
            .expect(404);
        })
        .then(({ body }) => {
          expect(body.msg).toBe(
            `trip_id 'eeeeeeeeeeeeeeeeeeeeeeee' does not exist.`
          );
        });
    });

    it("404: /api/trips/validtrip/NONEXISTENTDAY/activities returns a day not found error", () => {
      let testTripId;

      return request(app)
        .get("/api/trips?username=willclegg")
        .then(({ body }) => {
          testTripId = body.trips[0]._id;
          return request(app)
            .get(
              `/api/trips/${testTripId}/eeeeeeeeeeeeeeeeeeeeeeee/activities?username=willclegg`
            )
            .expect(404);
        })
        .then(({ body }) => {
          expect(body.msg).toBe(
            `day_id 'eeeeeeeeeeeeeeeeeeeeeeee' does not exist.`
          );
        });
    });
  });
};

module.exports = activityTests;
