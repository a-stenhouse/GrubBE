// const express = require("express");
// const mongoose = require("mongoose");
// const { postUser, getUsers, getUser, getItems } = require("./controller.js")



// const app = express();

// app.use(express.json());

// const userSchema = new mongoose.Schema({
//     username: String,
//     password: String,
//     salt: String,
//     location: String,
//     contact_details: String
// });

// const User = mongoose.model("user", userSchema);

// // Fetches all users in user database
// app.get("/users", getUsers);

// // Fetches a user according to the specified username
// app.get("/user/:username", getUser);

// // Fetches all items in the items database
// app.get("/items", getItems);

// // Fetches an item according to the specified _id
// app.get("/items/:_id", getItem)

// // Create a new user
// app.post("/users", postUser);