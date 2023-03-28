const express = require("express");
// const { postUser, getUsers, getUser, getItems, getItem, postItem } = require("./controller.js")
const { getItems } = require("./controllers/itemsControllers")
const { getUsers, getUser } = require("./controllers/usersControllers.js")
const { handlePathNotFound, customErrors } = require("./controllers/errorControllers.js")



const app = express();

app.use(express.json());



// Fetches all users in user database
app.get("/api/users", getUsers);



// Fetches a user according to the specified username
app.get("/api/users/:username", getUser);

// // Fetches all items in the items database
app.get("/api/items", getItems);


// // Fetches an item according to the specified _id
// app.get("/items/:_id", getItem)

// // Create a new user
// app.post("/users", postUser);

// //Create a new item
// app.post("/items", postItem)

app.use(customErrors);
app.use(handlePathNotFound);

module.exports = app