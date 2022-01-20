if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const cors = require("cors");
const session = require("express-session");

const passport = require("passport");

const {isAuthenticated} = require('./middlewares');



mongoose
  .connect("mongodb://localhost:27017/code-showcase-2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("SUCCESSFULLY CONNECTED TO DATABASE!");
  })
  .catch((err) => {
    console.log("FAILED TO CONNECT TO DATABASE!", err);
  });

  //auth
require('./auth/auth');


//routes
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const userRoutes = require('./routes/user.routes');

// const secret = "thisIsATEmpSecret";
// const sessionConfig = {
//   name: "session",
//   secret,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     httpOnlu: true,
//     expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//     maxAge: 1000 * 60 * 60 * 24 * 7,
//   },
// };
// app.use(session(sessionConfig));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
// app.use(passport.session());



app.use('/',authRoutes);
app.use('/project',isAuthenticated,projectRoutes);
app.use('/user',isAuthenticated,userRoutes)


app.get("/test", (req, res) => {
  res.status(200).send("SUCCESSFULLY CONNECTED TO BACKEND");
});

app.listen(process.env.PORT, () => {
  console.log(`SUCCESSFULLY STARTED SERVER ON PORT ${process.env.PORT}`);
});
