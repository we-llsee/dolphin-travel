const { db } = require("../../db/connection");
const { selectUsername } = require("./users.models");
const {
  checkTypes,
  checkDates,
  checkUsersExist,
  checkBudget,
  checkCountry,
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
