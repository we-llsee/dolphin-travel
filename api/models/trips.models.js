const { db } = require("../../db/connection");
const { selectUsername } = require("./users.models");
const { checkTypes, checkDates } = require("../utility");
//TODO further investigation of MongoDB injection attacks
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
    checkTypes("attending", newTrip.attending, "array"),
    checkTypes("budgetGBP", newTrip.budgetGBP, "number"),
    checkTypes("country", newTrip.country, "string"),
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
