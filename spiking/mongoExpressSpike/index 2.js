const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Replace the uri string with your connection string.
require("dotenv").config({
  path: `${__dirname}/./.env.uriString`,
});
const uri = process.env.MONGO_URI;

const app = express();

app.use(express.json());

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      crypto.pbkdf2(password, salt, 310000, 32, "sha256", function (err, hashedPassword) {
        if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
          return done(null, false);
        }
      })

      return done(null, user);
    });
  }
));

const port = 9000;

mongoose
  .connect(uri)
  .then(() => console.log("connected to Mongo"))
  .catch((err) => console.log(err));

const snackSchema = new mongoose.Schema({ name: String, quantity: Number });

// first argument = collection name (mongoose automatically lower cases and pluralises)
const Snack = mongoose.model("snack", snackSchema);
// a model represents a document that can be stored in a collection (in this case snacks)

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  salt: String,
});

const User = mongoose.model("user", userSchema);

app.get("/users", (request, response) => {
  User.find().then((users) => {
    response.status(200).send({ users });
  });
});

app.get("/users/:userid", (request, response) => {
  const { userid } = request.params;
  User.find({ _id: userid }).then((user) => {
    response.status(200).send(user);
  });
});

// Upon creation of new user, encrypts password and stores randomly generated salt value
app.post("/users", (request, response) => {
  const { username, password } = request.body;
  const salt = crypto.randomBytes(16)
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 310000, 32, "sha256").toString("hex")
  const newUser = new User({ username, password: hashedPassword, salt });
  newUser.save().then((result) => {
    response.status(201).send({ newUser: result });
  });
});

app.post("/users/validate", (request, response) => {
  passport.authenticate("local",)
  const { username, password } = request.body;
  User.find({ username }).then((user) => validateCredentials(user))
});

app.get("/snacks", (request, response) => {
  Snack.find()
    .then((snacks) => {
      response.status(200).send({ snacks });
    })
    .catch((err) => console.log(err, "mongo err"));
});

app.post("/snacks", (request, response) => {
  const { name, quantity } = request.body;
  const newSnack = new Snack({
    name,
    quantity,
  });
  newSnack.save().then((result) => {
    response.status(201).send({ newSnack: result });
  });
});

app.delete("/snacks/:snackid", (request, response) => {
  const { snackid } = request.params;
  Snack.deleteOne({ _id: snackid }).then((result) => {
    const { deletedCount } = result;
    if (deletedCount) {
      response.status(204).send();
    } else {
      response.status(404).send();
    }
  });
});

app.patch("/snacks/:snackid", (request, response) => {
  const { snackid } = request.params;
  const { quantity } = request.body;
  Snack.findOneAndUpdate(
    { _id: snackid },
    { quantity },
    {
      new: true,
    }
  ).then((updatedSnack) => {
    response.status(201).send({ updatedSnack });
  });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
