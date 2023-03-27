const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
});

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
