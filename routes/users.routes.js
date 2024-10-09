const express = require("express");
const router = express.Router();
const usersController = require("../controller/users.controller");
const verifyToken = require("../middleware/verifyToken");

//get all users
router.route("/").get(verifyToken, usersController.getAllUsers);

// login
router.route("/login").post(usersController.login);

// register user
router.route("/register").post(usersController.register);

module.exports = router;
