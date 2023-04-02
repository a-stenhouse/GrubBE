const { db, User } = require("../db/connection");
const mongoose = require("mongoose");

function seed(userData) {
  return db
    .dropCollection("snacks")
    .then(() => db.createCollection("snacks", {}))
    .then(() => User.insertMany(userData));
}

module.exports = seed;
