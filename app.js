const express = require("express");

const {
  getItems,
  getItemById,
  postItem,
} = require("./controllers/itemsControllers");
const { getCategories } = require("./controllers/categoriesControllers");
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

app.get("/api/categories", getCategories);

app.get("/api/items/:_id", getItemById);

app.post("/api/items", postItem);

app.use(customErrors);
app.use(mongooseErrors);
app.use(handle500Errors);
app.use(handlePathNotFound);

module.exports = app;
