const express = require('express');

const {
  userSignUp,
  userSignin,
  userSignout,
  currentUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  isAdmin,
  isBlocked,
} = require('../controllers/auth-controller');

const {
  getMyProfile,
  updateProfile,
  getUsers,
  getUserById,
  updateUser,
} = require('../controllers/user-controller');

const router = express.Router();

router.post('/signup', userSignUp);
router.post('/signin', isBlocked, userSignin);
router.post('/signout', userSignout);

router.post('/forgotPassword', isBlocked, forgotPassword);
router.put('/resetPassword/:token', resetPassword);

router.use(currentUser);

router.put('/update-password', updatePassword);

router.get('/my-profile', getMyProfile);
router.put('/update-profile', updateProfile);

router.use(isAdmin);

router.get('/', getUsers);
router.route('/:id').get(getUserById).put(updateUser);

module.exports = router;
