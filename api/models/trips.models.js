const client = require("../../db/connection");
const ENV = process.env.NODE_ENV || "test";

exports.selectTrips = () => {
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
      return arr;
    })
    .finally(() => {
      client.close();
    });
};
