const { validationResult } = require("express-validator");
const Course = require("../Models/course.model");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utils/appError");

// Get All Courses
const getAllCourses = asyncWrapper(async (req, res, next) => {
  const query = req.query;
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { courses },
  });
});

// Get Course by ID
const getCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    const error = appError.create("Course Not Found", 404, httpStatusText.FAIL);
    return next(error);
  }
  return res.json({
    status: httpStatusText.SUCCESS,
    data: { course },
  });
});

// Add New Course
const addCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const newCourse = new Course(req.body);
  await newCourse.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
});

// Update Course by ID
const updateCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { $set: { ...req.body } },
    { new: true } // Ensures the updated document is returned
  );
  if (!updatedCourse) {
    const error = appError.create("Course Not Found", 404, httpStatusText.FAIL);
    return next(error);
  }

  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { course: updatedCourse },
  });
});

// Delete Course by ID
const deleteCourse = asyncWrapper(async (req, res, next) => {
  const courseId = req.params.courseId;
  const result = await Course.deleteOne({ _id: courseId });

  if (result.deletedCount === 0) {
    const error = appError.create("Course Not Found", 404, httpStatusText.FAIL);
    return next(error);
  }

  res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
