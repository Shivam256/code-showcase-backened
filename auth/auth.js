const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/user.model");

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        console.log("password is", password);
        const user = await User.create({ username, password });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await user.validatePassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      const provider = {
        name: "github",
        id: profile.id,
      };
      User.findOne({ provider }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          user = new User({
            username: profile.username,
            email: profile.emails[0].value,
            provider: provider,
            profilePic: profile.photos[0].value,
          });

          user.save((err) => {
            if (err) return done(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID:process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      const provider = {
        name: "google",
        id: profile.id,
      };
      User.findOne({ provider }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            provider: provider,
            profilePic: profile.photos[0].value,
          });

          user.save((err) => {
            if (err) return done(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  )
);








passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
