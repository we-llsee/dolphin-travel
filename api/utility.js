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
  } else {
    return Promise.resolve();
  }
};

exports.checkDates = (startDate, endDate) => {
  if (new Date(startDate).toString() === "Invalid Date") {
    return Promise.reject({
      status: 400,
      msg: `startDate is not type 'date'.`,
    });
  } else if (new Date(endDate).toString() === "Invalid Date") {
    return Promise.reject({ status: 400, msg: `endDate is not type 'date'.` });
  } else {
    return Promise.resolve();
  }
};
