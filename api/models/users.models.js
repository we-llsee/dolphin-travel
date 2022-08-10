const { db } = require("../../db/connection");
exports.selectUsername = (username) => {
  if (username === undefined) {
    return Promise.reject({ status: 400, msg: "Username Not Specified" });
  } else if (Number.isInteger(+username)) {
    return Promise.reject({ status: 400, msg: "Invalid Username" });
  } else {
    const users = db.collection("users");

    const query = { _id: username };

    return users.findOne(query).then((user) => {
      if (user === null) {
        return Promise.reject({ status: 404, msg: "Username does not exist" });
      } else {
        return user;
      }
    });
  }
};
