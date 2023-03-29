const { postNewItem, fetchItems, fetchItemById } = require("../models/itemsModels");
const { fetchUser } = require("../models/usersModels");
const { fetchCategory } = require("../models/categoryModels");

exports.getItems = (request, response, next) => {
  fetchItems()
    .then((items) => {
      response.status(200).send({ items });
    })
    .catch((err) => next(err));
};

exports.getItemById = (request, response, next) => {
  const { _id } = request.params;

 fetchItemById(_id)
    .then((item) => {
  
      response.status(200).send({ item });
    })
    .catch((err) => next(err));
};

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

