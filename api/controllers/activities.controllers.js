const { postActivity } = require("../models/activities.models");

exports.addNewActivity = (req, res, next) => {
  const { trip_id } = req.params;
  const { day_id } = req.params;
  const activityDetails = req.body;

  postActivity(trip_id, day_id, activityDetails)
    .then((activity) => {
      res.status(201).send({ activity });
    })
    .catch((err) => {
      next(err);
    });
};
