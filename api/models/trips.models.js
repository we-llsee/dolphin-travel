const { db } = require("../../db/connection");
const { selectUsername } = require("./users.models");
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
  newTrip.days = [];
  newTrip.startDate = new Date(newTrip.startDate);
  newTrip.endDate = new Date(newTrip.endDate);

  return trips.insertOne(newTrip).then((trip) => {
    return trip;
  });
};
