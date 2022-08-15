const { db } = require("../../db/connection");
const trips = db.collection("trips");
const { checkId } = require("../utility");
const { doesTripExist } = require("./trips.models");
const { ObjectId } = require("bson");

exports.selectDayById = (trip_id, day_id) => {
  return checkId("trip_id", trip_id)
    .then(() => {
      return doesTripExist(trip_id);
    })
    .then(() => {
      return checkId("day_id", day_id);
    })
    .then(() => {
      return trips.findOne({ "days._id": ObjectId(day_id) });
    })
    .then((trip) => {
      if (trip === null) {
        return Promise.reject({
          status: 404,
          msg: `day_id '${day_id}' does not exist.`,
        });
      }
      return trip.days.find((day) => day._id.toString() === day_id.toString());
    });
};
