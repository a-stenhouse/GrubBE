const express = require("express");

const { postItem } = require("./controllers/itemsControllers");
const {
  handlePathNotFound,
  customErrors,
  mongooseErrors,
  handle500Errors,
} = require("./controllers/errorControllers.js");

const { getItems } = require("./controllers/itemsControllers")
const {
  getUsers,
  getUser,
  postUser,
} = require("./controllers/usersControllers.js");

const app = express();

app.use(express.json());

app.get("/api/users/:username", getUser);

app.get("/api/users", getUsers);

app.post("/api/users", postUser);

app.get("/api/items", getItems);

app.post("/api/items", postItem);


app.use(customErrors);
app.use(mongooseErrors);
app.use(handle500Errors);
app.use(handlePathNotFound);

module.exports = app;
