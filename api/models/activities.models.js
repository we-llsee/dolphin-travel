const { db } = require("../../db/connection");
const trips = db.collection("trips");
const { ObjectId } = require("bson");
const { selectUsername } = require("./users.models");
const { checkTypes } = require("../utility");
const { selectDayById } = require("./days.models");

exports.postActivity = (trip_id, day_id, activityDetails) => {
  const newActivity = { _id: new ObjectId(), ...activityDetails };
  delete newActivity.username;
  if (!newActivity.type) {
    newActivity.type = "other";
  }
  let changedDay;

  return Promise.all([
    selectUsername(activityDetails.username),
    selectDayById(trip_id, day_id),
    checkTypes("activityName", newActivity.activityName, "string"),
    checkTypes("latitude", newActivity.latitude, "number"),
    checkTypes("longitude", newActivity.longitude, "number"),
    checkTypes("address", newActivity.address, "object"),
    checkTypes("type", newActivity.type, "string"),
  ])
    .then(() => {
      return trips.findOne({
        _id: new ObjectId(trip_id),
        attending: { $in: [activityDetails.username] },
        "days._id": new ObjectId(day_id),
      });
    })
    .then((trip) => {
      if (trip === null) {
        return Promise.reject({
          status: 401,
          msg: `You are unauthorised to add an activity to this day.`,
        });
      }
      changedDay = trip.days.find((day) => day._id.toString() === day_id);
      const activities = changedDay.activities;
      activities.push(newActivity);
      changedDay.activities = activities;
      return changedDay;
    })
    .then(() => {
      return trips.updateOne(
        {
          _id: new ObjectId(trip_id),
          attending: { $in: [activityDetails.username] },
          "days._id": new ObjectId(day_id),
        },
        {
          $pull: { days: { _id: new ObjectId(day_id) } },
        },
        { upsert: true, returnDocument: "after" }
      );
    })
    .then(() => {
      return trips.findOneAndUpdate(
        {
          _id: new ObjectId(trip_id),
          attending: { $in: [activityDetails.username] },
        },
        {
          $push: { days: changedDay },
        },
        { upsert: true, returnDocument: "after" }
      );
    })
    .then((trip) => {
      const getDay = trip.value.days.find(
        (day) => day._id.toString() === day_id
      );
      const activity = getDay.activities.find(
        (activity) => activity._id.toString() === newActivity._id.toString()
      );
      return activity;
    });
};
