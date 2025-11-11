const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// All routes are admin protected
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

router.patch('/:id/toggle-status', protect, admin, toggleUserStatus);

module.exports = router;
