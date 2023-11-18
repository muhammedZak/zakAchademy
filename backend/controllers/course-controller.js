const Course = require('../models/course-schema');
const { asyncHandler } = require('../utils/async-handler');
const AppError = require('../utils/app-error');
const User = require('../models/user-schema');

exports.createCourse = asyncHandler(async (req, res, next) => {
  const isTitleExist = await Course.findOne({ title: req.body.title });

  if (isTitleExist) {
    return next(new AppError('Title already exist', 400));
  }

  const newCourse = await Course.create({
    title: req.body.title,
    overview: req.body.overview,
    learnings: req.body.learnings,
    level: req.body.level,
    duration: req.body.duration,
    instructor: req.user._id,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    requirements: req.body.requirements,
    banner: req.body.banner,
  });

  const user = await User.findById(req.user._id);
  user.isInstructor = true;
  user.taughtCourses.push(newCourse._id);

  await user.save();

  res.status(201).json({
    status: 'success',
    course: newCourse,
  });
});

exports.fetchAllCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({})
    .populate(['instructor', 'category'])
    .select(['-__v']);

  res.status(200).json({
    status: 'success',
    result: courses.length,
    courses,
  });
});

exports.fetchSingleCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate(['instructor', 'category'])
    .select('-__v');

  if (!course) {
    return next(new AppError('No course found', 404));
  }

  res.status(200).json({
    status: 'success',
    course,
  });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCourse) {
    return next(new AppError('No course found', 404));
  }

  res.status(200).json({
    status: 'success',
    user: updatedCourse,
  });
});

exports.disableCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, {
    isActive: false,
  });

  if (!course) {
    return next(new AppError('No course found', 404));
  }

  res.status(204).json({
    status: 'success',
  });
});
