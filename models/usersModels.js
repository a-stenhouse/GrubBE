const User = require("../db/User.js");
const crypto = require("crypto");

const fetchUser = (username) => {
  return User.findOne({ username })
    .lean()
    .then((user) => {
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: "User not found",
        });
      }
      delete user.password;
      delete user.salt;
      return user;
    });
};

const addUser = (newUserObj) => {
  const { username, password, location, contact } = newUserObj;
  return User.findOne({ username: newUserObj.username }).then((response) => {
    if (response) {
      return Promise.reject({
        status: 400,
        msg: "Bad request username already exists",
      });
    }
    const encryptedPassword = passwordHasher(password);
    const { salt, hashedPassword } = encryptedPassword;
    return User.create({
      username,
      password: hashedPassword,
      salt,
      location,
      contact,
    });
  });
};

const passwordHasher = (
  password,
  salt = crypto.randomBytes(16).toString("hex")
) => {
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 310000, 32, "sha256")
    .toString("hex");
  return { salt, hashedPassword };
};

module.exports = { passwordHasher, addUser, fetchUser };
