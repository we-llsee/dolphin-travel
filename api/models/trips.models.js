const { db } = require("../../db/connection");
const { selectUsername } = require("./users.models");
const { ObjectId } = require("bson");
const {
  checkTypes,
  checkDate,
  checkDateRelationship,
  checkUsersExist,
  checkBudget,
  checkCountry,
  buildSetQuery,
  checkFields,
} = require("../utility");
//TODO further investigation of MongoDB injection attacks
// TODO look into getting more country information
// TODO error handling for the latitude and longitude ranges, every key on address object should be string
const trips = db.collection("trips");

exports.selectTrips = (username) => {
  const query = {
    attending: { $in: [username] },
  };

  return selectUsername(username)
    .then(() => {
      return trips.find(query).toArray();
    })
    .then((arr) => {
      return arr;
    });
};

exports.postTrip = (newTrip) => {
  return Promise.all([
    checkTypes("tripName", newTrip.tripName, "string"),
    checkUsersExist("attending", newTrip.attending),
    checkBudget(newTrip.budgetGBP),
    checkCountry(newTrip.country),
    checkTypes("accommodation", newTrip.accommodation, "object"),
    checkTypes(
      "accommodationName",
      newTrip.accommodation.accommodationName,
      "string"
    ),
    checkTypes("latitude", newTrip.accommodation.latitude, "number"),
    checkTypes("longitude", newTrip.accommodation.longitude, "number"),
    checkTypes("address", newTrip.accommodation.address, "object"),
    checkDate("startDate", newTrip.startDate),
    checkDate("endDate", newTrip.endDate),
    checkDateRelationship(newTrip.startDate, newTrip.endDate),
  ])
    .then(() => {
      newTrip.days = [];
      newTrip.startDate = new Date(newTrip.startDate);
      newTrip.endDate = new Date(newTrip.endDate);

      return trips.insertOne(newTrip);
    })
    .then((trip) => {
      const tripEntered = {
        _id: trip.insertedId,
        ...newTrip,
      };
      return tripEntered;
    });
};

exports.doesTripExist = (trip_id) => {
  if (Number.isInteger(+trip_id) || trip_id.length < 24) {
    return Promise.reject({
      status: 400,
      msg: `trip_id '${trip_id}' is an invalid trip ID.`,
    });
  } else {
    return trips.findOne({ _id: new ObjectId(trip_id) }).then((trip) => {
      if (trip === null) {
        return Promise.reject({
          status: 404,
          msg: `trip_id '${trip_id}' does not exist.`,
        });
      }
    });
  }
};

exports.selectSingleTrip = (trip_id, username) => {
  return Promise.all([selectUsername(username), this.doesTripExist(trip_id)])
    .then(() => {
      const query = {
        _id: new ObjectId(trip_id),
        attending: { $in: [username] },
      };
      return trips.findOne(query);
    })
    .then((trip) => {
      if (trip === null) {
        return Promise.reject({
          status: 401,
          msg: "You are unauthorised to access this trip.",
        });
      } else {
        return trip;
      }
    });
};

exports.removeTrip = (trip_id, username) => {
  return Promise.all([selectUsername(username), this.doesTripExist(trip_id)])
    .then(() => {
      const query = {
        _id: new ObjectId(trip_id),
        "attending.0": username,
      };
      return trips.deleteOne(query);
    })
    .then((res) => {
      if (res.deletedCount === 0) {
        return Promise.reject({
          status: 401,
          msg: "You are unauthorised to delete this trip.",
        });
      }
    });
};

exports.updateTrip = (trip_id, username, newTripDetails) => {
  return Promise.all([
    this.doesTripExist(trip_id),
    selectUsername(username),
    checkFields(newTripDetails),
  ])
    .then(() => {
      return trips.findOne({
        _id: new ObjectId(trip_id),
        attending: { $in: [username] },
      });
    })
    .then((trip) => {
      if (trip === null) {
        return Promise.reject({
          status: 401,
          msg: "You are unauthorised to change this trip.",
        });
      }
      return trip;
    })
    .then((trip) => {
      if (newTripDetails.addPeople) {
        for (let i = 0; i < newTripDetails.addPeople.length; i++) {
          if (trip.attending.includes(newTripDetails.addPeople[i])) {
            return Promise.reject({
              status: 400,
              msg: `User '${newTripDetails.addPeople[i]}' is already attending.`,
            });
          }
        }
      }
      if (newTripDetails.removePeople) {
        for (let i = 0; i < newTripDetails.removePeople.length; i++) {
          if (
            (trip.attending.length === 1 &&
              !newTripDetails.addPeople &&
              username === newTripDetails.removePeople[0]) ||
            (trip.attending.length === 1 &&
              newTripDetails.addPeople &&
              !newTripDetails.newCreator)
          ) {
            return Promise.reject({
              status: 400,
              msg: `Your trip must have a creator.`,
            });
          }
          if (
            trip.attending.includes(newTripDetails.removePeople[i]) === false
          ) {
            return Promise.reject({
              status: 400,
              msg: `User '${newTripDetails.removePeople[i]}' is not listed as attending this trip.`,
            });
          }
          if (
            trip.attending[0] !== username &&
            newTripDetails.removePeople[i] !== username
          ) {
            return Promise.reject({
              status: 401,
              msg: `You are unauthorised to remove user '${newTripDetails.removePeople[i]}' from this trip.`,
            });
          }
        }
      }
      if (newTripDetails.endDate && !newTripDetails.startDate) {
        if (new Date(newTripDetails.endDate) < new Date(trip.startDate)) {
          return Promise.reject({
            status: 400,
            msg: `endDate cannot be before startDate.`,
          });
        }
      }
      if (newTripDetails.startDate && !newTripDetails.endDate) {
        if (new Date(trip.endDate) < new Date(newTripDetails.startDate)) {
          return Promise.reject({
            status: 400,
            msg: `startDate cannot be moved to after the endDate.`,
          });
        }
      }
      if (newTripDetails.startDate && newTripDetails.endDate) {
        if (
          new Date(newTripDetails.endDate) < new Date(newTripDetails.startDate)
        ) {
          return Promise.reject({
            status: 400,
            msg: `endDate cannot be before startDate.`,
          });
        }
      }

      const setDetails = buildSetQuery(trip_id, newTripDetails, trip.attending);
      return trips.updateOne(
        {
          _id: new ObjectId(trip_id),
          attending: { $in: [username] },
        },
        setDetails,
        { upsert: true }
      );
    })
    .then(() => {
      return trips.findOne({ _id: new ObjectId(trip_id) });
    })
    .then((trip) => {
      return trip;
    });
};
