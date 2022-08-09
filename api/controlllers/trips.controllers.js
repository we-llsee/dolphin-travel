const { selectTrips } = require("../models/trips.models");

exports.getTrips = (req, res, next) => {
  console.log("in function");
  selectTrips()
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      console.log(err);
    });
};
