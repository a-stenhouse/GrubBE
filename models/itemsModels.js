const Item = require("../db/Item");

exports.fetchItems = () => {
    return Item.find()
}

exports.removeItem = (_id) => {
    return Item.findByIdAndDelete({ _id })
        .then((deletedItem) => {
            if (!deletedItem) {
                return Promise.reject({
                    status: 404,
                    msg: "Item not found"
                });
            } else {
                return deletedItem;
            }
        })
}

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

exports.postNewItem = (newItem) => {
  const itemToInsert = new Item(newItem);
  return itemToInsert.save();
};