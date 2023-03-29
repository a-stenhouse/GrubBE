const express = require("express");
// const { postUser, getUsers, getUser, getItems, getItem, postItem } = require("./controller.js")
const { getItems, getItemById } = require("./controllers/itemsControllers")

const { postItem } = require("./controllers/itemsControllers");
const {
  handlePathNotFound,
  customErrors,
  mongooseErrors,
  handle500Errors,
} = require("./controllers/errorControllers.js");

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

app.get("/api/items/:_id", getItemById)

app.post("/api/items", postItem);


app.use(customErrors);
app.use(mongooseErrors);
app.use(handle500Errors);
app.use(handlePathNotFound);

module.exports = app;
