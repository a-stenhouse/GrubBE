const mongoose = require("mongoose");

require("dotenv").config({
  path: `${__dirname}/../.env.uriString`,
});
const uri = process.env.MONGO_URI;

if (!process.env.MONGO_URI) {
  throw new Error("No MONGO URI string found");
}

mongoose.connect(uri).catch((err) => console.log(`Connection error - ${err}`));

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("snack", userSchema);

module.exports = { db: mongoose.connection, userSchema, User };
