const Category = require('../models/category-schema');
const { asyncHandler } = require('../utils/async-handler');
const AppError = require('../utils/app-error');

exports.addCategory = asyncHandler(async (req, res, next) => {
  const { categoryName } = req.body;

  const isExist = await Category.findOne({ categoryName });

  if (isExist) {
    return next(new AppError('Category already exist', 400));
  }

  const category = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    category,
  });
});

exports.fetchCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({});

  res.status(200).json({
    status: 'success',
    result: categories.length,
    categories,
  });
});

exports.fetchSingleCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById({ _id: id });

  if (!category) {
    return next(new AppError('Not found', 404));
  }

  res.status(200).json({
    status: 'success',
    category,
  });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!category) {
    return next(new AppError('Not found', 404));
  }

  res.status(200).json({
    status: 'success',
    category,
  });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete({ _id: id });

  if (!category) {
    return next(new AppError('Cannot find', 404));
  }

  res.status(204).json({
    status: 'success',
  });
});
