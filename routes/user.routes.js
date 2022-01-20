const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

//model
const Project = require("../models/project.model");
const User = require("../models/user.model");


router.route('/:id').get(asyncHandler(async (req,res)=>{
    const {id} = req.params;
    const user = await User.findById(id).populate('projects');

    res.send(user);
}))


module.exports = router;