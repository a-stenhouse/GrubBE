const { fetchItems, fetchItemById } = require("../models/itemsModels");

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
        console.log(item)
      response.status(200).send({ item });
    })
    .catch((err) => next(err));
};
