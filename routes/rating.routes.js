const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

//model
const Project = require("../models/project.model");
const User = require("../models/user.model");

// router.route("/:id").post(
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;

//     const project = await Project.findById(id);
//   })
// );
