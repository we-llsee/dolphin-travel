const { selectUsername } = require("./models/users.models");
const countries = require("./countries-data");

exports.checkTypes = (keyName, value, type) => {
  if (value === undefined) {
    return Promise.reject({
      status: 400,
      msg: `${keyName} has not been provided.`,
    });
  }
  if (type === "array" && Array.isArray(value) === true) {
    return Promise.resolve();
  } else if (typeof value !== type) {
    return Promise.reject({
      status: 400,
      msg: `${keyName} is not type '${type}'.`,
    });
  }
  return Promise.resolve();
};

exports.checkDates = (startDate, endDate) => {
  if (startDate === undefined) {
    return Promise.reject({
      status: 400,
      msg: `startDate has not been provided.`,
    });
  } else if (endDate === undefined) {
    return Promise.reject({
      status: 400,
      msg: `endDate has not been provided.`,
    });
  }
  if (new Date(startDate).toString() === "Invalid Date") {
    return Promise.reject({
      status: 400,
      msg: `startDate is not type 'date'.`,
    });
  } else if (new Date(startDate) < Date.now()) {
    return Promise.reject({
      status: 400,
      msg: `startDate cannot be in the past.`,
    });
  } else if (new Date(endDate).toString() === "Invalid Date") {
    return Promise.reject({ status: 400, msg: `endDate is not type 'date'.` });
  } else if (new Date(endDate) < new Date(startDate)) {
    return Promise.reject({
      status: 400,
      msg: `endDate cannot be before startDate.`,
    });
  }
  return Promise.resolve();
};

exports.checkUsersExist = (userArr) => {
  return this.checkTypes("attending", userArr, "array")
    .then(() => {
      const userPromises = [];
      userArr.forEach((user) => {
        userPromises.push(selectUsername(user));
      });
      return Promise.all(userPromises);
    })
    .catch((err) => {
      return Promise.reject({ ...err, status: 400 });
    });
};

exports.checkBudget = (budgetGBP) => {
  return this.checkTypes("budgetGBP", budgetGBP, "number").then(() => {
    if (budgetGBP < 1) {
      return Promise.reject({
        status: 400,
        msg: "Budget cannot be £0 or less.",
      });
    }
    return Promise.resolve();
  });
};

exports.checkCountry = (country) => {
  return this.checkTypes("country", country, "string").then(() => {
    if (countries.find((data) => data.name === country)) {
      return Promise.resolve();
    }
    return Promise.reject({
      status: 400,
      msg: `Country '${country}' does not exist.`,
    });
  });
};

exports.buildSetQuery = (trip_id, newTripDetails, currentlyAttending) => {
  const set = {};
  const push = {};
  const pull = {};
  if (newTripDetails.tripName) {
    set.tripName = newTripDetails.tripName;
  }
  if (newTripDetails.startDate) {
    set.startDate = new Date(newTripDetails.startDate);
  }
  if (newTripDetails.endDate) {
    set.endDate = new Date(newTripDetails.endDate);
  }
  if (newTripDetails.budgetGBP) {
    set.budgetGBP = newTripDetails.budgetGBP;
  }
  if (newTripDetails.accommodation) {
    set.accommodation = newTripDetails.accommodation;
  }

  if (newTripDetails.addPeople && newTripDetails.newCreator) {
    const creatorRemoved = [...currentlyAttending, ...newTripDetails.addPeople];
    creatorRemoved.splice(
      creatorRemoved.indexOf(`${newTripDetails.newCreator}`),
      1
    );
    set.attending = [newTripDetails.newCreator, ...creatorRemoved];
  }

  if (newTripDetails.addPeople && !newTripDetails.newCreator) {
    push.attending = { $each: newTripDetails.addPeople };
  }

  if (newTripDetails.newCreator && !newTripDetails.addPeople) {
    const creatorRemoved = [...currentlyAttending];
    creatorRemoved.splice(
      creatorRemoved.indexOf(`${newTripDetails.newCreator}`),
      1
    );
    set.attending = [newTripDetails.newCreator, ...creatorRemoved];
  }

  if (newTripDetails.removePeople) {
    pull.attending = { $in: newTripDetails.removePeople };
  }

  return {
    $set: set,
    $push: push,
    $pull: pull,
  };
};
