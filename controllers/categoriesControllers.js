const { fetchCategories } = require("../models/categoryModels");

exports.getCategories = (request, response, next) => {
  return fetchCategories()
    .then((categories) => {
      response.status(200).send({ categories });
    })
    .catch(next);
};
