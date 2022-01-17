const express = require('express');
const router = express.Router();

const passport = require('passport');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

//models
const User = require('../models/user.model');

router.post('/auth/signup',passport.authenticate('signup',{session:false}),asyncHandler(async (req,res)=>{
    res.send({
        message:'signup successfull',
        user:req.user
    })
}))

router.post(
    '/auth/login',
    async (req, res, next) => {
      passport.authenticate(
        'login',
        async (err, user, info) => {
            console.log(user,"i am here");
          try {
            if (err || !user) {
              const error = new Error('An error occurred.');
              return next(error);
            }
  
            req.login(
              user,
              { session: false },
              async (error) => {
                if (error) return next(error);
  
                const body = { _id: user._id, email: user.username };
                const token = jwt.sign({ user: body }, 'TOP_SECRET');
  
                return res.send({token})
              }
            );
          } catch (error) {
            return next(error);
          }
        }
      )(req, res, next);
    }
  );

// router.post('/auth/signup',(req,res)=>{
//     console.log("you finally hit me!");
//     console.log(req.body);
//     res.send("yes!")
// })




module.exports = router;