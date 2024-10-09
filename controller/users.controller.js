const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utils/appError");
const User = require("../Models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  const query = req.query;
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { users },
  });
});

const register = async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  const passwordStr = String(password);
  const userFound = await User.findOne({ email: email }).select("+password");
  if (userFound) {
    return next(new appError("Email already exists", 400, httpStatusText.FAIL));
  }

  const hashedPassword = await bcrypt.hash(passwordStr, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

  const token = await generateJWT({ email: newUser.email, id: newUser._id });
  newUser.token = token;

  await newUser.save();
  res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "User registered successfully",
    data: { user: newUser },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists
  const userFound = await User.findOne({ email }).select("+password");
  if (!userFound) {
    return next(new appError("User not found", 404, httpStatusText.FAIL));
  }

  const passwordStr = String(password);
  // Compare password with the hashed password in the database
  const isMatch = await bcrypt.compare(passwordStr, userFound.password);
  if (!isMatch) {
    return next(new appError("Incorrect password", 401, httpStatusText.FAIL));
  }

  const token = await generateJWT({
    email: userFound.email,
    id: userFound._id,
  });
  // If login is successful
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "User logged in successfully",
    data: {
      token,
    },
  });
};

module.exports = {
  getAllUsers,
  login,
  register,
};
