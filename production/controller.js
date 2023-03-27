const { createUser, fetchUsers, fetchUser, fetchItems, fetchItem } = require("./models.js")

exports.getUsers = (request, response) => {
    return fetchUsers().then((result) => {
        response.status(200).send({ users: result });
    });
};

exports.getUser = (request, response) => {
    const { username } = request.params;
    return fetchUser(username).then((result) => {
        response.status(200).send({ user: result });
    });
};

exports.getItems = (request, response) => {
    return fetchItems().then((result) => {
        response.status(200).send({ items: result });
    })
}

exports.getItem = (request, response) => {
    const { _id } = request.params
    return fetchItem(_id).then((result) => {
        response.status(200).send({});
    })
}

exports.postUser = (request, response) => {
    return createUser(request.body).then((result) => {
        response.status(201).send({ newUser: result });
    });
};