const express = require("express");
const router = express.Router();
const usersController = require("../controller/users.controller");
const verifyToken = require("../middleware/verifyToken");
const multer = require("multer");
const AppError = require("../utils/appError");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("file: ", file);
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const filename = `user-${Date.now()}`;
    cb(null, filename + "." + file.mimetype.split("/")[1]);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    cb(null, true);
  } else {
    cb(new AppError("Upload the images Only", 400), false);
  }
};
const upload = multer({
  storage: diskStorage,
  fileFilter,
});
//get all users
router.route("/").get(verifyToken, usersController.getAllUsers);

// login
router.route("/login").post(usersController.login);

// register user
router
  .route("/register")
  .post(upload.single("avatar"), usersController.register);

module.exports = router;
