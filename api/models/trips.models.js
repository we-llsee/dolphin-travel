const { db } = require("../../db/connection");

exports.selectTrips = () => {
  const trips = db.collection("trips");

  const query = {
    attending: { $in: ["willclegg"] },
  };

  return trips
    .find(query)
    .toArray()
    .then((arr) => {
      return arr;
    });
};
