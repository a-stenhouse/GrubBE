const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  salt: String,
  location: { latitude: Number, longitude: Number },
  contact: String,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
