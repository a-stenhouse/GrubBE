const db = require("../connection");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("snack", userSchema);

function seed(userData) {
  return db
    .dropCollection("snacks")
    .then(() => db.createCollection("snacks", {}))
    .then(() => User.insertMany(userData));
}

module.exports = seed;
