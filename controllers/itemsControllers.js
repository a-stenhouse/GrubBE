const {fetchItems} = require("../models/itemsModels")

exports.getItems = (request, response, next) => {
    fetchItems().then((items) => {
        response.status(200).send({items})
    }).catch((err) => next(err));
}