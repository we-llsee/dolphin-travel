const { selectUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  const { username } = req.query;

  return selectUsers(username)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      if(err.status && err.msg){
         next({
        status: 401,
        msg: "You are unauthorised to access this resource",
      });
      } else {
        next(err);
      }
     
    });
};
