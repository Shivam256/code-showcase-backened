const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email:{
    type:String,
    unique:true,
  },
  password: String,
  provider: {
    name: String,
    id: String,
  },
  profilePic: String,
});



UserSchema.pre('save',async function(next){
    const user = this;
    const hash = await bcrypt.hash(user.password, 10);

    this.password = hash;
    next();
})

UserSchema.methods.validatePassword = async function(password){
    const user = this;
    const isValid = await bcrypt.compare(password,user.password);

    return isValid;
}

module.exports = mongoose.model("User", UserSchema);
