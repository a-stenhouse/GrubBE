const Item = require("../db/Item");

exports.postNewItem = (newItem) => {
  const itemToInsert = new Item(newItem);
  return itemToInsert.save();
};

exports.fetchItems = () => {
    return Item.find()
};