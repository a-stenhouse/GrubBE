const db = require("../connection");
const mongoose = require("mongoose");
const testUserData = require("../data/test/users");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("snack", userSchema);

function seed(userData) {
  db.dropCollection("snacks")
    .then(() => db.createCollection("snacks", {}))
    .then(() => User.insertMany(userData))
    .then(() => db.close());
}

seed(testUserData);

module.exports = seed;
