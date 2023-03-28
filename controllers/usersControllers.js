const { fetchUsers, fetchUser, addUser } = require("../models/usersModels.js");

exports.getUsers = (request, response, next) => {
  fetchUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch((err) => next(err));
};

exports.getUser = (request, response, next) => {
  const { username } = request.params;
  fetchUser(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((err) => next(err));
};

exports.postUser = (request, response, next) => {
  const newUser = request.body;
  addUser(newUser)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
