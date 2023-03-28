const express = require("express");
const {
  getUsers,
  getUser,
  postUser,
} = require("./controllers/usersControllers.js");
const {
  handlePathNotFound,
  customErrors,
  hanlde500Errors,
} = require("./controllers/errorControllers.js");

const app = express();

app.use(express.json());

app.get("/api/users", getUsers);

app.get("/api/users/:username", getUser);

app.post("/api/users", postUser);

app.use(customErrors);
app.use(hanlde500Errors);
app.use(handlePathNotFound);

module.exports = app;
