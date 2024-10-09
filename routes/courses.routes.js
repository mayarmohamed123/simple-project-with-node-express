const express = require("express");
const router = express.Router();
const courseController = require("../controller/courses.controller");
const { validationSchema } = require("../middleware/validationSchema");
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const userRole = require("../utils/userRoles");

router
  .route("/")
  .get(courseController.getAllCourses)
  .post(verifyToken, validationSchema(), courseController.addCourse);

router
  .route("/:courseId")
  .get(courseController.getCourse)
  .patch(courseController.updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRole.ADMIN, userRole.MANAGER),
    courseController.deleteCourse
  );

module.exports = router;
