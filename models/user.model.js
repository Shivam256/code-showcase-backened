const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
  },
  password: String,
  provider: {
    name: String,
    id: String,
  },
  profilePic: String,
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  followers:[
    {
      type:Schema.Types.ObjectId,
      ref:'User',
    }
  ],
  following:[
    {
      type:Schema.Types.ObjectId,
      ref:'User'
    }
  ],
  description:String
});

UserSchema.pre("save", async function (next) {
  const user = this;
  // const hash = await bcrypt.hash(user.password, 10);

  // this.password = hash;
  next();
});

UserSchema.methods.validatePassword = async function (password) {
  const user = this;
  console.log(password,"in the bcrypt");
  // const isValid = await bcrypt.compare(password, user.password);
  // console.log(isValid, "in the bcrypt!");
  const isValid = password === user.password;
  return isValid;
};

module.exports = mongoose.model("User", UserSchema);
