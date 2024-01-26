// User schema and model definition
const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: String,
  age: Number,
});

module.exports = model("User", UserSchema);
