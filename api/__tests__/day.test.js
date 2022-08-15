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
};

module.exports = dayTests;
