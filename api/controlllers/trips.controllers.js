const { selectTrips } = require("../models/trips.models");

exports.getTrips = (req, res) => {
  selectTrips()
    .then((trips) => {
      res.status(200).send({ trips });
    })
    .catch((err) => {
      console.log(err);
    });
};
