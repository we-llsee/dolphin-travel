const { db } = require("../../db/connection");
const trips = db.collection("trips");
const { ObjectId } = require("bson");
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
    selectDayById(trip_id, day_id, activityDetails.username),
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

exports.selectActivitiesByDayId = (trip_id, day_id, username) => {
  return selectDayById(trip_id, day_id, username).then((day) => {
    return day.activities;
  });
};
