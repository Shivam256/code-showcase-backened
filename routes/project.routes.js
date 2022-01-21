const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
// const UIDGenerator = require('uid-generator');
// const uidgen = new UIDGenerator();

//model
const Project = require("../models/project.model");
const User = require("../models/user.model");
const Rating = require("../models/rating.model");

router
  .route("/")
  .get(
    asyncHandler(async (req, res) => {
      console.log(req.user, "this is current user");
      const projects = await Project.find({}).populate("author").populate({
        path:'ratings',
        populate:{
          path:'author'
        }
      });
      res.send(projects);
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      const { title, description, links, stack, images } = req.body;
      const projectBody = {
        title,
        description,
        links,
        images,
      };

      projectBody.stack = stack.map((stk) => ({ name: stk }));

      const project = await Project.create({ ...projectBody });
      project.author = req.user._id;
      project.save();

      const user = await User.findById(req.user._id);
      user.projects.push(project);
      user.save();

      res.send(project._id);
    })
  );

router.route("/:id").get(
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await Project.findById(id).populate("author").populate({
      path:'ratings',
      populate:{
        path:'author'
      }
    });
    console.log("found project :", project);
  

    res.send(project);
  })
)
.delete(asyncHandler(async(req,res)=>{
  const {id} = req.params;

  const project = await Project.findByIdAndDelete(id);
  res.send(project);
}))

router.route("/:id/rating").post(
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await Project.findById(id);
    const { comment, rating } = req.body;

    const ratingModal = new Rating({
      comment,
      rating,
      author: req.user._id,
    });

    await ratingModal.save();

    project.ratings.push(ratingModal);
    await project.save();

    res.send(ratingModal);
  })
);

module.exports = router;
