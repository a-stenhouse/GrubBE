const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  expiry_date: {
    type: Date,
    required: true,
  },
  quantity: { type: Number, required: true },
  item_url: String,
  is_available: { type: Boolean, required: true },
});

itemSchema.index({ location: "2dsphere" });

const Item = mongoose.model("item", itemSchema);

module.exports = Item;
