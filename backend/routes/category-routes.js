const express = require('express');

const {
  addCategory,
  fetchCategories,
  fetchSingleCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category-controller');

const { currentUser, isAdmin } = require('../controllers/auth-controller');

const router = express.Router();

router.use(currentUser, isAdmin);

router.route('/').post(addCategory).get(fetchCategories);
router
  .route('/:id')
  .get(fetchSingleCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
