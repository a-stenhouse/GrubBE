const mongoose = require("mongoose");

require("dotenv").config({
  path: `${__dirname}/../.env.mongoURI.test`,
});
const uri = process.env.MONGO_URI;

if (!process.env.MONGO_URI) {
  throw new Error("No MONGO URI string found");
}

mongoose.connect(uri).catch((err) => console.log(`Connection error - ${err}`));

module.exports = { db: mongoose.connection };
