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
  } else if (type === "object" && Array.isArray(value) === true) {
    return Promise.reject({
      status: 400,
      msg: `${keyName} is not type '${type}'.`,
    });
  } else if (typeof value !== type) {
    return Promise.reject({
      status: 400,
      msg: `${keyName} is not type '${type}'.`,
    });
  }
  return Promise.resolve();
};

exports.checkDate = (dateName, date) => {
  if (date === undefined) {
    return Promise.reject({
      status: 400,
      msg: `${dateName} has not been provided.`,
    });
  }
  if (
    new Date(date).toString() === "Invalid Date" ||
    typeof date === "number"
  ) {
    return Promise.reject({
      status: 400,
      msg: `${dateName} is not type 'date'.`,
    });
  }

  if (dateName === "startDate" && new Date(date) < Date.now()) {
    return Promise.reject({
      status: 400,
      msg: `${dateName} cannot be in the past.`,
    });
  }
  return Promise.resolve();
};

exports.checkDateRelationship = (startDate, endDate) => {
  if (new Date(endDate) < new Date(startDate)) {
    return Promise.reject({
      status: 400,
      msg: `endDate cannot be before startDate.`,
    });
  }
  return Promise.resolve();
};

exports.checkUsersExist = (fieldName, userArr) => {
  if (userArr.length === 0) {
    return Promise.reject({
      status: 400,
      msg: `${fieldName} requires one or more usernames.`,
    });
  }
  return this.checkTypes(fieldName, userArr, "array").then(() => {
    const userPromises = [];
    userArr.forEach((user) => {
      userPromises.push(selectUsername(user));
    });
    return Promise.all(userPromises);
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

exports.checkFields = (newTripDetails) => {
  const allowedFields = [
    "tripName",
    "startDate",
    "endDate",
    "budgetGBP",
    "accommodation",
    "addPeople",
    "removePeople",
    "newCreator",
  ];
  const validationPromises = [];
  if (Object.keys(newTripDetails).length === 0) {
    return Promise.reject({
      status: 400,
      msg: "Please provide details of the updates to be made.",
    });
  } else {
    for (const field in newTripDetails) {
      if (allowedFields.indexOf(field) === -1) {
        return Promise.reject({
          status: 400,
          msg: `Cannot update field '${field}'.`,
        });
      } else {
        if (field === "tripName") {
          validationPromises.push(
            this.checkTypes(field, newTripDetails[field], "string")
          );
        }
        if (field === "budgetGBP") {
          validationPromises.push(this.checkBudget(newTripDetails[field]));
        }
        if (field === "accommodation") {
          validationPromises.push(
            this.checkTypes(field, newTripDetails[field], "object"),
            this.checkTypes(
              "accommodationName",
              newTripDetails[field].accommodationName,
              "string"
            ),
            this.checkTypes(
              "longitude",
              newTripDetails[field].longitude,
              "number"
            ),
            this.checkTypes(
              "latitude",
              newTripDetails[field].latitude,
              "number"
            ),
            this.checkTypes("address", newTripDetails[field].address, "object")
          );
        }
        if (field === "addPeople" || field === "removePeople") {
          validationPromises.push(
            this.checkUsersExist(field, newTripDetails[field])
          );
        }

        if (field === "startDate" || field === "endDate") {
          validationPromises.push(this.checkDate(field, newTripDetails[field]));
        }

        if (field === "newCreator") {
          validationPromises.push(selectUsername(newTripDetails[field]));
        }
      }
    }
    return Promise.all(validationPromises);
  }
};

exports.buildSetQuery = (
  trip_id,
  newTripDetails,
  currentlyAttending,
  originalDuration,
  newDuration,
  days
) => {
  const set = {};
  const push = {};
  const pull = {};

  if (newDuration < originalDuration) {
    const newDays = [...days];
    for (let i = 0; i < newDays.length; i++) {
      if (newDays[i].dayNumber > newDuration) {
        newDays[i].dayNumber = 0;
      }
    }
    set.days = newDays;
  }

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
    if (newTripDetails.removePeople) {
      for (let i = 0; i < newTripDetails.removePeople.length; i++) {
        creatorRemoved.splice(
          creatorRemoved.indexOf(`${newTripDetails.removePeople[i]}`),
          1
        );
      }
    }
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

  if (newTripDetails.removePeople && !newTripDetails.newCreator) {
    pull.attending = { $in: newTripDetails.removePeople };
  }

  return {
    $set: set,
    $push: push,
    $pull: pull,
  };
};
