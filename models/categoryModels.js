const Category = require("../db/Category");

exports.fetchCategory = (name) => {
  return Category.findOne({ name }).then((category) => {
    if (category) {
      return category;
    } else {
      return Promise.reject({ status: 404, msg: "Category not found" });
    }
  });
};
