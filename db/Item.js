const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  description: String,
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  expiry_date: {
    type: Date
  },
  quantity: Number,
  item_url: String,
  is_available: Boolean,
});

const Item = mongoose.model("item", itemSchema);


module.exports = Item;
