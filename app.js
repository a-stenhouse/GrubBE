const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("./passport");

const {
  getItems,
  getItemById,
  deleteItem,
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

app.post("/api/auth", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).send({ msg: info.message });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign(user, "your_jwt_secret", { expiresIn: "7d" });
      return res.status(200).send({ user, token });
    });
  })(req, res);
});

app.get("/api/users/:username", getUser);

app.get("/api/users", getUsers);

app.post("/api/users", postUser);

app.get(
  "/api/items",
  passport.authenticate("jwt", { session: false }),
  getItems
);

app.delete("/api/items/:_id", deleteItem);

app.get("/api/categories", getCategories);

app.get("/api/items/:_id", getItemById);

app.post("/api/items", postItem);

app.use(customErrors);
app.use(mongooseErrors);
app.use(handle500Errors);
app.use(handlePathNotFound);

module.exports = app;
