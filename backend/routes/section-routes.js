const express = require('express');

const {
  addSection,
  deletSection,
  editSection,
  getAllSection,
  getSection,
} = require('../controllers/section-controller');

const { currentUser, isAdmin } = require('../controllers/auth-controller');
const { isAuthorized } = require('../middlewares/tutor-auth');

const router = express.Router();

router
  .route('/:course-id/sectios')
  .post(currentUser, isAuthorized, addSection)
  .get(getAllSection);

router
  .route('/:course-id/sections/:id')
  .get(currentUser, isAuthorized, getSection)
  .put(currentUser, isAuthorized, editSection)
  .delete(currentUser, isAuthorized, deletSection);

module.exports = router;
