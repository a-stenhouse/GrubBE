const passport = require("passport");
const passportJWT = require("passport-jwt");
const crypto = require("crypto");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./db/User");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

passport.use(
  new LocalStrategy((username, password, done) => {
    return User.findOne({ username }).then((user) => {
      const hashedPassword = crypto
        .pbkdf2Sync(password, user.salt, 310000, 32, "sha256")
        .toString("hex");
      if (user && user.password === hashedPassword) {
        done(null, { username }, { message: "Login successful" });
      } else {
        done(null, false, { message: "Incorrect username or password" });
      }
    });
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    (jwtPayload, cb) => {
      return cb(null, jwtPayload);
    }
  )
);
