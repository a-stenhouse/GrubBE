const express = require("express");

const app = express();

app.get("/first/endpoint", (req, res) => {});

module.exports = app;
