const express = require("express");
const endpoints = require("./endpoints.json");
const cors = require("cors");

const {
  getTrips,
  addNewTrip,
  getSingleTrip,
  deleteTrip,
} = require("./controllers/trips.controllers");

const { getUsers } = require("./controllers/users.controllers");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/users", getUsers);

app.get("/api/trips", getTrips);
app.get("/api/trips/:trip_id", getSingleTrip);

app.post("/api/trips", addNewTrip);

app.delete("/api/trips/:trip_id", deleteTrip);

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
