const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

//model
const Project = require("../models/project.model");
const User = require("../models/user.model");


router.route("/").get(asyncHandler(async(req,res)=>{
  const users = await User.find({});
  res.send(users);
}))

router.route("/feed").get(
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
      path: "following",
      populate: {
        path: "projects",
        populate: {
          path: "author",
        },
      },
    });

    const following = user.following;
    let feedProjects = [];

    following.forEach((u) => {
      feedProjects = [...feedProjects, ...u.projects];
    });

    console.log(feedProjects);
    res.send(feedProjects);
  })
);

router
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const user = await User.findById(id).populate("projects");

      res.send(user);
    })
  )
  .put(asyncHandler(async (req, res) => {
      const {description,profilePic} = req.body;
      const { id } = req.params;
      const user = await User.findById(id);

      user.description = description;
      user.profilePic = profilePic;

      user.save();

      res.send(user);
  }));

router.route("/follow/:id").get(
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user1 = await User.findById(req.user._id);
    const user2 = await User.findById(id);

    //add user2 to user1 following
    user1.following.push(user2);
    user2.followers.push(user1);

    await user1.save();
    await user2.save();

    res.send("FOLLOW REQUEST SUCCESSFULL!");

    //add user1 to user2 followers
  })
);

module.exports = router;
