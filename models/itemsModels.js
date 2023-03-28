const Item = require("../db/Item");

exports.fetchItems = () => {
  return Item.find();
};

exports.fetchItemById = (_id) => {
  return Item.findOne({ _id }).then((item) => {
    if (!item) {
      return Promise.reject({
        status: 404,
        msg: "Item not found",
      });
    }
    return item;
  });
};
