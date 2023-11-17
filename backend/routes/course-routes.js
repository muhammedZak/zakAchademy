const express = require('express');

const {
  createCourse,
  fetchAllCourses,
  updateCourse,
  fetchSingleCourse,
  disableCourse,
} = require('../controllers/course-controller');

const { currentUser, isAdmin } = require('../controllers/auth-controller');

const { isAuthorized } = require('../middlewares/tutor-auth');

const router = express.Router();

router.route('/').post(currentUser, createCourse).get(fetchAllCourses);
router
  .route('/:id')
  .get(fetchSingleCourse)
  .put(currentUser, isAuthorized, updateCourse)
  .delete(currentUser, isAuthorized, disableCourse);

module.exports = router;
