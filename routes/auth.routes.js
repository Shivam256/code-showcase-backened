const express = require("express");
const router = express.Router();

const passport = require("passport");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

//models
const User = require("../models/user.model");

router.post(
  "/auth/signup",
  passport.authenticate("signup", { session: false }),
  asyncHandler(async (req, res) => {
    res.send({
      message: "signup successfull",
      user: req.user,
    });
  })
);

router.post("/auth/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        // const error = new Error('An error occurred.');
        res.status(500).send(info.message);
        // return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, username: user.username };
        const token = jwt.sign({ user: body }, "TOP_SECRET");

        return res.send({ token, user });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.get(
  "/auth/jwtVerify",
  asyncHandler(async (req, res) => {
    console.log(req.headers.authorization);
    const token = req.headers.authorization;
    const decodeToken = jwt.verify(token, "TOP_SECRET");

    if (decodeToken) {
      const user = await User.findById(decodeToken.user._id);

      return res.send({ user });
    }

    res.send(null);
  })
);

router.route("/auth/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.route("/auth/github").get(passport.authenticate("github"));

router
  .route("/auth/google/callback")
  .get(
    passport.authenticate("google", { failureRedirect: "/fail" }),
    (req, res) => {
      const token = req.user._id;
      // const redirectUrl = `http://localhost:3000/feed?token=${token}`;
      const redirectUrl = `http://localhost:3000`;
      // console.log(redirectUrl);
      console.log(token);
      res.redirect(redirectUrl);
    }
  );

router
  .route("/auth/github/callback")
  .get(
    passport.authenticate("github", { failureRedirect: "/fail" }),
    (req, res) => {
      //  console.log(req.user);
      const token = req.user._id;

      const redirectUrl = `http://localhost:3000?token=${token}`;
      // console.log(redirectUrl);
      // console.log(token);
      res.redirect(redirectUrl);
    }
  );

// router.post('/auth/signup',(req,res)=>{
//     console.log("you finally hit me!");
//     console.log(req.body);
//     res.send("yes!")
// })

module.exports = router;
