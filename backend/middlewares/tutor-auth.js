const User = require('../models/user-schema');
const Course = require('../models/course-schema');
const AppError = require('../utils/app-error');
const { asyncHandler } = require('../utils/async-handler');

exports.isAuthorized = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  console.log(course);

  if (req.user.isAdmin) {
    next();
  } else if (course) {
  }
});
