const User = require('../models/user-schema');
const Course = require('../models/course-schema');
const AppError = require('../utils/app-error');
const { asyncHandler } = require('../utils/async-handler');

exports.isAuthorized = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  const instructorId = course.instructor.toString();
  const currentUser = req.user._id.toString();

  if (req.user.isAdmin) {
    next();
  } else if (currentUser !== instructorId) {
    return next(new AppError('You do not have permission', 400));
  }

  next();
});
