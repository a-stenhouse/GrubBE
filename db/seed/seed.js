const { db } = require("../connection");
const mongoose = require("mongoose");
const User = require("../User");
const Item = require("../Item");
const Category = require("../Category");

function seed(userData, categoryData, itemData) {
  return db
    .dropCollection("items")
    .then(() => db.dropCollection("users"))
    .then(() => db.dropCollection("categories"))
    .then(() => User.insertMany(userData))
    .then(() => Category.insertMany(categoryData))
    .then(() => {
      const newItems = itemData.map((item) => {
        const promises = [];
        promises.push(
          User.find({ username: item.username }).then((users) => users[0]._id)
        );
        promises.push(
          Category.find({ name: item.category }).then(
            (categories) => categories[0]._id
          )
        );
        return Promise.all(promises).then((result) => {
          item.username = result[0];
          item.category = result[1];
          return new Item(item);
        });
      });
      return Promise.all(newItems).then((results) => Item.insertMany(results));
    });
}

module.exports = seed;
