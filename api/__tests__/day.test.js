const seed = require("../../db/seed");
const app = require("../app");
const request = require("supertest");

const dayTests = () => {
  beforeAll(() => {
    return seed();
  });

  beforeEach(() => {
    if (process.env.TEST_FREQ === "each") {
      return seed();
    }
  });

  describe("GET /api/trips/:trip_id/:day_id", () => {
    it("200: /api/trips/tripx/dayz?username=willclegg returns a day object on a key of 'day'", () => {
      let testTripId;
      let testDayId;
      let testDays;

      return request(app)
        .get("/api/trips?username=willclegg")
        .expect(200)
        .then(({ body }) => {
          testTripId = body.trips[0]._id;
          testDayId = body.trips[0].days[0]._id;
          testDays = body.trips[0].days;
          return request(app).get(
            `/api/trips/${testTripId}/${testDayId}?username=willclegg`
          );
        })
        .then(({ body }) => {
          expect(testDays).toEqual(expect.arrayContaining([body.day]));
          expect(typeof body.day).toBe("object");
          expect(body.day).toEqual(
            expect.objectContaining({
              _id: testDayId,
              dayNumber: expect.any(Number),
              activities: expect.any(Array),
            })
          );
        });
    });

    it("400: /api/trips/validtrip/validday?username=INVALIDUSER returns a invalid username error", () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .expect(200)
        .then(({ body }) => {
          const testTripId = body.trips[0]._id;
          const testDayId = body.trips[0].days[0]._id;
          return request(app)
            .get(`/api/trips/${testTripId}/${testDayId}?username=1`)
            .expect(400);
        })
        .then(({ body }) => {
          expect(body.msg).toBe("User '1' is an invalid username.");
        });
    });

    it('400: /api/trips/INVALIDTRIP/validday returns "trip_id is an invalid trip ID"', () => {
      return request(app)
        .get("/api/trips/1/62f66caf2215f735d7243ab4?username=willclegg")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("'1' is an invalid trip_id.");
        });
    });

    it('400: /api/trips/validtrip/INVALIDDAY returns "Day_id "X" is invalid"', () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .expect(200)
        .then(({ body }) => {
          const testTripId = body.trips[0]._id;
          return request(app)
            .get(`/api/trips/${testTripId}/1?username=willclegg`)
            .expect(400);
        })
        .then(({ body }) => {
          expect(body.msg).toBe("'1' is an invalid day_id.");
        });
    });

    it("401: /api/trips/validtrip/validday?username=NONAUTHUSER returns a not-authorised error", () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .expect(200)
        .then(({ body }) => {
          const testTripId = body.trips[0]._id;
          const testDayId = body.trips[0].days[0]._id;
          return request(app)
            .get(`/api/trips/${testTripId}/${testDayId}?username=jesskemp`)
            .expect(401);
        })
        .then(({ body }) => {
          expect(body.msg).toBe("You are unauthorised to access this trip.");
        });
    });

    it("404: /api/trips/validtrip/validday?username=NONEXISTENTUSER returns a non-existent user error", () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .expect(200)
        .then(({ body }) => {
          const testTripId = body.trips[0]._id;
          const testDayId = body.trips[0].days[0]._id;
          return request(app)
            .get(`/api/trips/${testTripId}/${testDayId}?username=pcopley`)
            .expect(404);
        })
        .then(({ body }) => {
          expect(body.msg).toBe("User 'pcopley' does not exist.");
        });
    });

    it('404: /api/trips/NONEXISTENTTRIP/validday returns "trip_id does not exist"', () => {
      return request(app)
        .get(
          "/api/trips/eeeeeeeeeeeeeeeeeeeeeeee/62f66caf2215f735d7243ab4?username=willclegg"
        )
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "trip_id 'eeeeeeeeeeeeeeeeeeeeeeee' does not exist."
          );
        });
    });

    it('404: /api/trips/valitrip/NONEXISTENTDAY returns "trip_id does not exist"', () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .expect(200)
        .then(({ body }) => {
          const testTripId = body.trips[0]._id;
          return request(app)
            .get(
              `/api/trips/${testTripId}/eeeeeeeeeeeeeeeeeeeeeeee?username=willclegg`
            )
            .expect(404);
        })
        .then(({ body }) => {
          expect(body.msg).toBe(
            "day_id 'eeeeeeeeeeeeeeeeeeeeeeee' does not exist."
          );
        });
    });
  });
  describe("DELETE /api/trips/:trip_id/:day_id", () => {
    beforeEach(() => {
      if (process.env.TEST_FREQ === "all") {
        return seed();
      }
    });
    it("204 no content: successfully deletes the specified day", () => {
      let trip_id;
      let day_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(`/api/trips/${trip_id}/${day_id}?username=jesskemp`)
            .expect(204);
        })
        .then(() => {
          return request(app)
            .get(`/api/trips/${trip_id}/${day_id}?username=jesskemp`)
            .expect(404);
        });
    });
    it("401: Returns {msg: You are unauthorised to access this trip.} when a user who is not attending the trip tries to delete a day.", () => {
      let trip_id;
      let day_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(`/api/trips/${trip_id}/${day_id}?username=alexrong`)
            .expect(401)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("You are unauthorised to access this trip.");
            });
        });
    });
    it("400: Returns {msg: Username Not Specified} when no username query.", () => {
      let trip_id;
      let day_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(`/api/trips/${trip_id}/${day_id}`)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Username Not Specified");
            });
        });
    });
    it("400: Returns {msg: User 'X' is an invalid username.} for invalid username query", () => {
      let trip_id;
      let day_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(`/api/trips/${trip_id}/${day_id}?username=234`)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("User '234' is an invalid username.");
            });
        });
    });
    it("404: Returns {msg: User 'jimstevenson' does not exist.} when username cannot be found", () => {
      let trip_id;
      let day_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(`/api/trips/${trip_id}/${day_id}?username=jimstevenson`)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("User 'jimstevenson' does not exist.");
            });
        });
    });
    it("400: Returns {msg: 'X' is an invalid trip_id.} when a user tries to access a trip id with the wrong format.", () => {
      let day_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(`/api/trips/2345/${day_id}?username=jesskemp`)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("'2345' is an invalid trip_id.");
            });
        });
    });
    it("404: Returns {msg: trip_id 'X' does not exist.} when trip cannot be found", () => {
      let day_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          day_id = trips[1].days[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(
              `/api/trips/507f1f77bcf86cd799439011/${day_id}?username=jesskemp`
            )
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
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
        })
        .then(() => {
          return request(app)
            .delete(`/api/trips/${trip_id}/777?username=jesskemp`)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("'777' is an invalid day_id.");
            });
        });
    });
    it("404: Returns {msg: day_id 'X' does not exist.} when a day cannot be found.", () => {
      let trip_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
        })
        .then(() => {
          return request(app)
            .delete(
              `/api/trips/${trip_id}/507f1f77bcf86cd799439011?username=jesskemp`
            )
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                "day_id '507f1f77bcf86cd799439011' does not exist."
              );
            });
        });
    });
  });
};

module.exports = dayTests;
