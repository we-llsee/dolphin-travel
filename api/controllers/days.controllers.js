const { selectDayById } = require("../models/days.models");

exports.getDayById = (req, res, next) => {
  const { trip_id } = req.params;
  const { day_id } = req.params;
  const {username} = req.query;

  return selectDayById(trip_id, day_id,username)
    .then((day) => {
      res.status(200).send({ day });
    })
    .catch((err) => {
      next(err);
    });
};
