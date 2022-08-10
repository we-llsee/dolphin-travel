const { db } = require("../../db/connection");
const { selectUsername } = require("./users.models");
//TODO further investigation of MongoDB injection attacks

exports.selectTrips = (username) => {
  const trips = db.collection("trips");

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
