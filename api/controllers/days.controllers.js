const { selectDayById } = require("../models/days.models");

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
