// const mongoose = require("mongoose");
const User = require("../db/User.js");

exports.fetchUsers = () => {
  return User.find();
};

exports.fetchUser = (username) => {
  return User.findOne({ username }).then((user) => {
    if (!user) {
      return Promise.reject({
        status: 404,
        msg: "User not found",
      });
    }
    return user;
  });
};

exports.getUserId = (username) => {
  return User.findOne({ username }).then((user) => {
    if (user) {
      return user._id;
    } else {
      return Promise.reject({ status: 404, msg: "user does not exist" });
    }
  });
};
