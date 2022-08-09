const client = require("../../db/connection");
const ENV = process.env.NODE_ENV || "test";

exports.selectTrips = () => {
  let returnArr;
  return client
    .connect()
    .then(() => {
      const db = client.db(ENV);
      const trips = db.collection("trips");

      const query = {
        attending: { $in: ["willclegg"] },
      };

      return trips.find(query).toArray();
    })
    .then((arr) => {
      returnArr = arr;
      return client.close();
    })
    .then(() => {
      return returnArr;
    });
};
