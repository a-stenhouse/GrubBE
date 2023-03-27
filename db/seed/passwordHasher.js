const crypto = require("crypto");
const users = require("../data/development/userData.js");

function passwordHasher(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 310000, 32, "sha256")
    .toString("hex");
  return { salt, hashedPassword };
}

users.forEach((user) => {
  const { salt, hashedPassword } = passwordHasher(user.password);
  console.log(`${user.username} salt: ${salt} pass: ${hashedPassword}`);
});
