const crypto = require("crypto")
const users = require("../data/test/userData.js");

function passwordHasher(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 310000, 32, "sha256").toString("hex");
    console.log(salt, hashedPassword);
}

// users.forEach((user) => {
//     passwordHasher(user.password)
// })

passwordHasher("Mango1998");