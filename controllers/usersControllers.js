const { fetchUsers, fetchUser } = require("../models/usersModels.js");

exports.getUsers = (request, response, next) => {
    fetchUsers().then((users) => {
        response.status(200).send({ users });
    }).catch((err) => next(err));
};

exports.getUser = (request, response, next) => {
    const { username } = request.params;
    fetchUser(username).then((user) => {
        response.status(200).send({ user });
    }).catch((err) => next(err));
};