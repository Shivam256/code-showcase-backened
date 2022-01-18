const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

router.route("/").get(
  asyncHandler((req, res) => {
    console.log(req.user, "this is current user");
    res.send("successfully authorized");
  })
)
.post(asyncHandler(async(req,res)=>{
    console.log(req.body);
    res.send("route hitted!");
}));

module.exports = router;
