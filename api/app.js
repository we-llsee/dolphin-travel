const express = require("express");

const { getTrips } = require("./controllers/trips.controllers");

const app = express();

app.use(express.json());

app.get("/api/trips", getTrips);

module.exports = app;
