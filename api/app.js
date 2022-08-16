const express = require("express");
const endpoints = require("./endpoints.json");
const cors = require("cors");

const {
  getTrips,
  addNewTrip,
  getSingleTrip,
  deleteTrip,
  changeTrip,
  addNewDay,
} = require("./controllers/trips.controllers");

const { getDayById } = require("./controllers/days.controllers");

const { addNewActivity } = require("./controllers/activities.controllers");

const {
  getUsers,
  getUserByUsername,
} = require("./controllers/users.controllers");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserByUsername);

app.get("/api/trips", getTrips);
app.get("/api/trips/:trip_id", getSingleTrip);

app.post("/api/trips", addNewTrip);
app.post("/api/trips/:trip_id", addNewDay);
app.post("/api/trips/:trip_id/:day_id", addNewActivity);

app.patch("/api/trips/:trip_id", changeTrip);

app.delete("/api/trips/:trip_id", deleteTrip);

app.get("/api/trips/:trip_id/:day_id", getDayById);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Path" });
});

app.use((error, req, res, next) => {
  if (error.status && error.msg) {
    res.status(error.status).send({ msg: error.msg });
  } else {
    next(error);
  }
});

app.use((error, req, res) => {
  console.log(error);
  res.status(500).send({ msg: "Server Error" });
});

module.exports = app;
