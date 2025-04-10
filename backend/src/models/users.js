const mongoose = require("mongoose");
const { Schema, model } = mongoose;
//create an object called users whose properties are username, email, password, and profileUrl

//create a schema based on the users

const UsersSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  imageName: { type: String, required: false },
  profileImgUrl: { type: String, required: false },
  rsvps: { type: Array, required: false },
  rsvpsId: { type: Array, required: false },
  isAdmin: { type: Boolean, required: false },
});

//save the schema model to the users variable

const users = model("User", UsersSchema);
module.exports = users;
