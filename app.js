const express = require("express");
// const { postUser, getUsers, getUser, getItems, getItem, postItem } = require("./controller.js")
const { getItems } = require("./controllers/itemsControllers")
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


app.get("/api/items", getItems);


// // Fetches an item according to the specified _id
// app.get("/items/:_id", getItem)

// // Create a new user
// app.post("/users", postUser);

// //Create a new item
// app.post("/items", postItem)


app.use(customErrors);
app.use(hanlde500Errors);
app.use(handlePathNotFound);

module.exports = app;
