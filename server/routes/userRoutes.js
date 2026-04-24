const express = require('express');
const router = express.Router();
const {
  registerUser,
  registerUserPublic,
  loginUser,
  getMe,
  getUsers,
  updateUser,
  deleteUser,
  approveUser,
  rejectUser,
  updateMe,
} = require('../controllers/userController');
const { protect, adminOnly, stateAdminOnly } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', loginUser);
router.post('/register-public', registerUserPublic);

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

// Admin only routes
router.post('/register', protect, adminOnly, registerUser);
router.get('/', protect, stateAdminOnly, getUsers);  // Changed to allow State-Admin
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);
router.put('/:id/approve', protect, adminOnly, approveUser);
router.delete('/:id/reject', protect, adminOnly, rejectUser);

module.exports = router;
