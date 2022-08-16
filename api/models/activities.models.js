const { db } = require("../../db/connection");
const trips = db.collection("trips");
const { ObjectId } = require("bson");
const { checkTypes, checkId } = require("../utility");
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

exports.removeActivity = (trip_id, day_id, activity_id, username) => {
  let changedDay;
  return Promise.all([
    selectDayById(trip_id, day_id, username),
    checkId("activity_id", activity_id),
  ])
    .then(() => {
      const query = {
        _id: new ObjectId(trip_id),
        attending: { $in: [username] },
        "days._id": new ObjectId(day_id),
      };
      return trips.findOne(query);
    })
    .then((trip) => {
      changedDay = trip.days.find((day) => day._id.toString() === day_id);
      const newActivities = [...changedDay.activities];
      const activityIdToRemove = newActivities.find(
        (activity) => activity._id.toString() === activity_id
      );
      if (!activityIdToRemove) {
        return Promise.reject({
          status: 404,
          msg: `activity_id '${activity_id}' does not exist.`,
        });
      }
      const activityIndex = newActivities.indexOf(activityIdToRemove);
      newActivities.splice(activityIndex, 1);
      changedDay.activities = newActivities;
      return changedDay;
    })
    .then(() => {
      return trips.updateOne(
        {
          _id: new ObjectId(trip_id),
          attending: { $in: [username] },
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
          attending: { $in: [username] },
        },
        {
          $push: { days: changedDay },
        },
        { upsert: true, returnDocument: "after" }
      );
    })
    .then(() => {
      return;
    });
};
