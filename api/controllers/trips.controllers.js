const { selectTrips, postTrip } = require("../models/trips.models");

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

exports.addNewTrip = (req, res, next) => {
  const newTrip = req.body;
  postTrip(newTrip)
    .then((trip) => {
      res.status(200).send({ trip });
    })
    .catch((err) => {
      next(err);
    });
};
