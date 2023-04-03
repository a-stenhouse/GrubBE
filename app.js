const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("./passport");

const {
  getItems,
  getItemById,
  getItemsByLocation,
  getItemsByArea,
  deleteItem,
  postItem,
  toggleItem,
} = require("./controllers/itemsControllers");
const { getCategories } = require("./controllers/categoriesControllers");

const {
  handlePathNotFound,
  customErrors,
  mongooseErrors,
  handle500Errors,
} = require("./controllers/errorControllers.js");

const { getUser, postUser } = require("./controllers/usersControllers.js");

const app = express();

const latLongRegex = "(-?\\d{1,3}.?\\d+)";

app.use(express.json());

app.post("/api/auth", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).send({ msg: info.message });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(user, "your_jwt_secret", {
        expiresIn: "7d",
      });
      const userResponse = {
        username: user.user.username,
        location: user.user.location,
        contact: user.user.contact,
      };
      return res.status(200).send({ user: userResponse, token });
    });
  })(req, res);
});

app.get(
  "/api/users/:username",
  passport.authenticate("jwt", { session: false }),
  getUser
);

app.post("/api/users", postUser);

app.get(
  "/api/items",
  passport.authenticate("jwt", { session: false }),
  getItems
);

app.get(
  `/api/items/:lat1${latLongRegex}/:long1${latLongRegex}/:lat2${latLongRegex}/:long2${latLongRegex}`,
  passport.authenticate("jwt", { session: false }),
  getItemsByArea
);

app.get(
  `/api/items/:lat${latLongRegex}/:long${latLongRegex}`,
  passport.authenticate("jwt", { session: false }),
  getItemsByLocation
);

app.delete(
  "/api/items/:_id",
  passport.authenticate("jwt", { session: false }),
  deleteItem
);

app.get(
  "/api/categories",
  passport.authenticate("jwt", { session: false }),
  getCategories
);

app.get(
  "/api/items/:_id",
  passport.authenticate("jwt", { session: false }),
  getItemById
);

app.patch(
  "/api/items/:_id",
  passport.authenticate("jwt", { session: false }),
  toggleItem
);

app.post(
  "/api/items",
  passport.authenticate("jwt", { session: false }),
  postItem
);

app.use(customErrors);
app.use(mongooseErrors);
app.use(handle500Errors);
app.use(handlePathNotFound);

module.exports = app;
