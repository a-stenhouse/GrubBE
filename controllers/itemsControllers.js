const {
  postNewItem,
  removeItem,
  fetchItems,
  fetchItemById,
} = require("../models/itemsModels");
const { fetchUser } = require("../models/usersModels");
const { fetchCategory } = require("../models/categoryModels");

exports.getItems = (request, response, next) => {
    fetchItems().then((items) => {
        response.status(200).send({ items })
    }).catch((err) => next(err));
}

exports.getItems = (request, response, next) => {
  fetchItems()
    .then((items) => {
      response.status(200).send({ items });
    })
    .catch(next);
};

exports.getItemById = (request, response, next) => {
  const { _id } = request.params;

  fetchItemById(_id)
    .then((item) => {
      response.status(200).send({ item });
    })
    .catch(next);
};

exports.deleteItem = (request, response, next) => {
    const { _id } = request.params;
    removeItem(_id).then(() => {
        response.sendStatus(204)
    }).catch(next);
}

exports.postItem = (request, response, next) => {
  const newItem = request.body;
  return fetchUser(newItem.username)
    .then((user) => {
      return Promise.all([user, fetchCategory(newItem.category)]);
    })
    .then((userCategory) => {
      newItem.username = userCategory[0]._id;
      newItem.category = userCategory[1]._id;
      newItem.is_available = true;
      if (!newItem.location) {
        newItem.location = userCategory[0].location;
      }
      return postNewItem(newItem);
    })
    .then((item) => {
      return response.status(201).send({ item });
    })
    .catch(next);
};
