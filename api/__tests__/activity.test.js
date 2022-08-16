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
  describe("DELETE /api/trips/:trip_id/:day_id/:activity_id", () => {
    beforeEach(() => {
      if (process.env.TEST_FREQ === "all") {
        return seed();
      }
    });
    it("204 no content: successfully deletes the specified activity", () => {
      let trip_id;
      let day_id;
      let activity_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
          activity_id = trips[1].days[0].activities[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(
              `/api/trips/${trip_id}/${day_id}/${activity_id}?username=jesskemp`
            )
            .expect(204);
        });
    });
    it("401: Returns {msg: You are unauthorised to access this trip.} when a user who is not attending the trip tries to delete an activity.", () => {
      let trip_id;
      let day_id;
      let activity_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
          activity_id = trips[1].days[0].activities[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(
              `/api/trips/${trip_id}/${day_id}/${activity_id}?username=alexrong`
            )
            .expect(401)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("You are unauthorised to access this trip.");
            });
        });
    });
    it("400: Returns {msg: Username Not Specified} when no username query.", () => {
      let trip_id;
      let day_id;
      let activity_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
          activity_id = trips[1].days[0].activities[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(`/api/trips/${trip_id}/${day_id}/${activity_id}`)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Username Not Specified");
            });
        });
    });
    it("400: Returns {msg: User 'X' is an invalid username.} for invalid username query", () => {
      let trip_id;
      let day_id;
      let activity_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
          activity_id = trips[1].days[0].activities[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(
              `/api/trips/${trip_id}/${day_id}/${activity_id}?username=105835`
            )
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("User '105835' is an invalid username.");
            });
        });
    });
    it("404: Returns {msg: User 'jimstevenson' does not exist.} when username cannot be found", () => {
      let trip_id;
      let day_id;
      let activity_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          day_id = trips[1].days[0]._id;
          activity_id = trips[1].days[0].activities[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(
              `/api/trips/${trip_id}/${day_id}/${activity_id}?username=jimstevenson`
            )
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("User 'jimstevenson' does not exist.");
            });
        });
    });
    it("400: Returns {msg: 'X' is an invalid trip_id.} when a user tries to access a trip id with the wrong format.", () => {
      let day_id;
      let activity_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          day_id = trips[1].days[0]._id;
          activity_id = trips[1].days[0].activities[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(
              `/api/trips/eeeeeee/${day_id}/${activity_id}?username=jesskemp`
            )
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("'eeeeeee' is an invalid trip_id.");
            });
        });
    });
    it("404: Returns {msg: trip_id 'X' does not exist.} when trip cannot be found", () => {
      let day_id;
      let activity_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          day_id = trips[1].days[0]._id;
          activity_id = trips[1].days[0].activities[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(
              `/api/trips/507f1f77bcf86cd799439011/${day_id}/${activity_id}?username=jesskemp`
            )
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                "trip_id '507f1f77bcf86cd799439011' does not exist."
              );
            });
        });
    });
    it("400: Returns {msg: 'X' is an invalid day_id.} when a user tries to access a day id with the wrong format.", () => {
      let trip_id;
      let activity_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          activity_id = trips[1].days[0].activities[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(
              `/api/trips/${trip_id}/234/${activity_id}?username=jesskemp`
            )
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("'234' is an invalid day_id.");
            });
        });
    });
    it("404: Returns {msg: day_id 'X' does not exist.} when a day cannot be found.", () => {
      let trip_id;
      let activity_id;
      return request(app)
        .get("/api/trips?username=jesskemp")
        .then(({ body: { trips } }) => {
          trip_id = trips[1]._id;
          activity_id = trips[1].days[0].activities[0]._id;
        })
        .then(() => {
          return request(app)
            .delete(
              `/api/trips/${trip_id}/507f1f77bcf86cd799439011/${activity_id}?username=jesskemp`
            )
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                "day_id '507f1f77bcf86cd799439011' does not exist."
              );
            });
        });
    });
    it("400: Returns {msg: 'X' is an invalid activity_id.} when a user tries to access a activity id with the wrong format.", () => {
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
            .delete(`/api/trips/${trip_id}/${day_id}/2793?username=jesskemp`)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("'2793' is an invalid activity_id.");
            });
        });
    });
    it("404: Returns {msg: activity_id 'X' does not exist.} when a activity cannot be found.", () => {
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
            .delete(
              `/api/trips/${trip_id}/${day_id}/507f1f77bcf86cd799439011?username=jesskemp`
            )
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                "activity_id '507f1f77bcf86cd799439011' does not exist."
              );
            });
        });
    });
  });
};

module.exports = activityTests;
