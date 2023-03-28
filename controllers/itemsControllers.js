const { fetchItems, removeItem } = require("../models/itemsModels")

exports.getItems = (request, response, next) => {
    fetchItems().then((items) => {
        response.status(200).send({ items })
    }).catch((err) => next(err));
}

exports.deleteItem = (request, response, next) => {
    const { _id } = request.params;
    removeItem(_id).then(() => {
        response.sendStatus(204)
    }).catch(next);
}