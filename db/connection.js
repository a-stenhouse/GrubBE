const mongoose = require("mongoose");

const ENV = process.env.NODE_ENV || "test";
require("dotenv").config({
  path: `${__dirname}/../${
    ENV === "test" ? ".env.mongoURI.test" : ".env.mongoURI.dev"
  }`,
});

const uri = process.env.MONGO_URI;

if (!process.env.MONGO_URI) {
  throw new Error("No MONGO URI string found");
}

mongoose.connect(uri).catch((err) => console.log(`Connection error - ${err}`));

module.exports = { db: mongoose.connection };
