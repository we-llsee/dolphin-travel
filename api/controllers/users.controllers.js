const { selectUsers, selectUsername } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  const { username } = req.query;

  return selectUsers(username)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  return selectUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
