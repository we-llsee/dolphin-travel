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
    it("200: /api/trips/TRIPX/DAYZ returns a day object on a key of 'day'", () => {
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
          return request(app).get(`/api/trips/${testTripId}/${testDayId}`);
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

    it('400: /api/trips/INVALIDTRIP/VALIDDAY returns "trip_id is an invalid trip ID"', () => {
      return request(app)
        .get("/api/trips/1/62f66caf2215f735d7243ab4")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("'1' is an invalid trip_id.");
        });
    });

    it('400: /api/trips/VALIDTRIP/INVALIDDAY returns "Day_id "X" is invalid"', () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .expect(200)
        .then(({ body }) => {
          const testTripId = body.trips[0]._id;
          return request(app).get(`/api/trips/${testTripId}/1`).expect(400);
        })
        .then(({ body }) => {
          expect(body.msg).toBe("'1' is an invalid day_id.");
        });
    });

    it('404: /api/trips/NONEXISTENTTRIP/VALIDDAY returns "trip_id does not exist"', () => {
      return request(app)
        .get("/api/trips/eeeeeeeeeeeeeeeeeeeeeeee/62f66caf2215f735d7243ab4")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "trip_id 'eeeeeeeeeeeeeeeeeeeeeeee' does not exist."
          );
        });
    });

    it('404: /api/trips/VALIDTRIP/NONEXISTENTDAY returns "trip_id does not exist"', () => {
      return request(app)
        .get("/api/trips?username=willclegg")
        .expect(200)
        .then(({ body }) => {
          const testTripId = body.trips[0]._id;
          return request(app)
            .get(`/api/trips/${testTripId}/eeeeeeeeeeeeeeeeeeeeeeee`)
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

module.exports=dayTests;