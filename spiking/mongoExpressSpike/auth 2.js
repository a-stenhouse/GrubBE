const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto-promise");
const { promisify } = require("util");







const validateCredentials = ({ username, password, salt }) => {
    return passport.use(new LocalStrategy(function verify(username, password) {
        crypto.pbkdf2(password, salt, 310000, 32, "sha256")
            ((hashedPassword) => {
                if (!crypto.timingSafeEqual(password, hashedPassword)) {
                    return cb(null, false, { msg: "Incorrect username or Password" })
                }
            })
    }))

}

module.exports = validateCredentials;