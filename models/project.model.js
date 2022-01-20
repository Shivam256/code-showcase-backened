const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Rating = require("./rating.model");

const LinkSchema = new Schema({
    gihub:String,
    gitlab:String,
    web:String,
    codesandbox:String,
    codepen:String
})

const projectSchema = new Schema({
  title: {
    type: String,
  },
  images: [{
      type:String
  }],
  description: {
    type: String,
  },
  links:LinkSchema,
  stack: [
    {
      name: String,
    },
  ],
  ratings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
});



projectSchema.virtual("overallRating").get(function () {
  let total = 0;
  this.ratings.map((elem) => {
    total += elem.rating;
  });
  return Math.round(total / this.ratings.length);
});


projectSchema.set('toObject',{virtuals:true})
projectSchema.set('toJSON',{virtuals:true})


projectSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Rating.deleteMany({
      _id: { $in: doc.ratings },
    });
  }
});

module.exports = mongoose.model("Project", projectSchema);