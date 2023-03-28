const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: String,
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  expiry_date: { type: String, required: true },
  quantity: { type: Number, required: true },
  item_url: String,
  is_available: { type: Boolean, required: true },
});

const Item = mongoose.model("item", itemSchema);

module.exports = Item;
