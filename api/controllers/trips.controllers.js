const { selectTrips } = require("../models/trips.models");

exports.getTrips = (req, res, next) => {
  const { username } = req.query;

  selectTrips(username)
    .then((trips) => {
      res.status(200).send({ trips });
    })
    .catch((err) => {
      next(err);
    });
};
