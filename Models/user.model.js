const mongoose = require("mongoose");
const validator = require("validator");
const userRole = require("../utils/userRoles");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    // select: false,
  },
  token: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [userRole.ADMIN, userRole.USER, userRole.MANAGER],
    default: userRole.USER,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
