const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/user-model');
const AppError = require('../utils/app-error');
const { asyncHandler } = require('../utils/async-handler');
const { generateToken } = require('../utils/jwt-generator');
const sendEmail = require('../utils/email');

exports.userSignUp = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    next(new AppError('User already exist', 400));
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = generateToken(newUser._id, res);

  newUser.password = undefined;

  res.status(201).json({
    result: 'Success',
    token,
    user: newUser,
  });
});

exports.userSignin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isPasswordMatch(password, user.password))) {
    return next(new AppError('Invalid Password or Email', 401));
  }

  const token = generateToken(user._id, res);

  res.status(200).json({
    result: 'Success',
    token,
    user: user,
  });
});

exports.userSignout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.currentUser = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not authrized, please signin again!', 401)
    );
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('User does not exist', 401));
  } else if (currentUser.isBlocked) {
    return next(new AppError('You are not authorized', 400));
  }

  if (await currentUser.passwordChanged(decoded.iat)) {
    return next(
      new AppError('Password changed recently. Please signin again', 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.isAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user.isAdmin === false) {
    return next(new AppError('Not authorized', 400));
  }

  next();
});

exports.isBlocked = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('User not found', 400));
  }

  if (user.isBlocked) {
    return next(new AppError('You cannot login', 400));
  }

  next();
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  if (!req.body.confirmPassword) {
    return next(new AppError('Please confirm your password', 400));
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.isPasswordMatch(req.body.currentPassword, user.password))) {
    return next(new AppError('Incorrect current password', 401));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;

  const updateUser = await user.save();

  user.password = undefined;

  const token = generateToken(user._id, res);

  res.status(200).json({
    status: 'success',
    token,
    user: updateUser,
  });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = generateToken(user._id, res);

  res.status(200).json({
    status: 'success',
    token,
    user,
  });
});
