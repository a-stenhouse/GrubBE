const express = require("express");
const mongoose = require("mongoose");
const { User } = require("./db/connection");

const app = express();

app.get("/users", (req, res) => {
  User.find().then((users) => {
    res.status(200).send({ users });
  });
});

module.exports = app;
