const { db } = require("../../db/connection");
const { selectUsername } = require("./users.models");
const { ObjectId } = require("bson");
const {
  checkTypes,
  checkDates,
  checkUsersExist,
  checkBudget,
  checkCountry,
  buildSetQuery,
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
    checkUsersExist(newTrip.attending),
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
    checkDates(newTrip.startDate, newTrip.endDate),
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
  return trips
    .findOne({ _id: new ObjectId(trip_id) })
    .then((trip) => {
      const currentlyAttending = [...trip.attending];
      return currentlyAttending;
    })
    .then((currentlyAttending) => {
      const setDetails = buildSetQuery(
        trip_id,
        newTripDetails,
        currentlyAttending
      );
      const query = {
        _id: new ObjectId(trip_id),
      };
      return trips
        .updateOne(query, setDetails, { upsert: true })
        .then(() => {
          return trips.findOne({ _id: new ObjectId(trip_id) });
        })
        .then((trip) => {
          return trip;
        });
    });
};
