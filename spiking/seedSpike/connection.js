const mongoose = require("mongoose");

// Replace the uri string with your connection string.
require("dotenv").config({
  path: `${__dirname}/./.env.uriString`,
});
const uri = process.env.MONGO_URI;

if (!process.env.MONGO_URI) {
  throw new Error("No MONGO URI string found");
}

mongoose
  .connect(uri)
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.log(`Connection error - ${err}`));

module.exports = mongoose.connection;
