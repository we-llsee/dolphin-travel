const {
  selectTrips,
  postTrip,
  selectSingleTrip,
  removeTrip,
  updateTrip,
  selectDayById,
} = require("../models/trips.models");

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

exports.getSingleTrip = (req, res, next) => {
  const { trip_id } = req.params;
  const { username } = req.query;

  selectSingleTrip(trip_id, username)
    .then((trip) => {
      res.status(200).send({ trip });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteTrip = (req, res, next) => {
  const { trip_id } = req.params;
  const { username } = req.query;

  removeTrip(trip_id, username)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};

exports.changeTrip = (req, res, next) => {
  const { trip_id } = req.params;
  const { username } = req.query;
  const newTripDetails = req.body;

  updateTrip(trip_id, username, newTripDetails)
    .then((trip) => {
      res.status(200).send({ trip });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getDayById = (req, res, next) => {
  const { trip_id } = req.params;
  const { day_id } = req.params;
  return selectDayById(trip_id, day_id)
    .then((day) => {
      res.status(200).send({ day });
    })
    .catch((err) => {
      next(err);
    });
};
