const {
  postActivity,
  removeActivity,
  selectActivitiesByDayId,
} = require("../models/activities.models");

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

exports.deleteActivity = (req, res, next) => {
  const { trip_id } = req.params;
  const { day_id } = req.params;
  const { activity_id } = req.params;
  const { username } = req.query;

  removeActivity(trip_id, day_id, activity_id, username)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};

exports.getActivitiesByDayId = (req, res, next) => {
  const { trip_id } = req.params;
  const { day_id } = req.params;
  const { username } = req.query;

  selectActivitiesByDayId(trip_id, day_id, username)
    .then((activities) => {
      res.status(200).send({ activities });
    })
    .catch((err) => {
      next(err);
    });
};
