const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { generateToken } = require('../middleware/authMiddleware');
const { sendApprovalEmail, sendRejectionEmail } = require('../utils/emailService');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Private/Admin
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, agency, state } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Validate role-specific requirements
  if (role === 'Agency-User' && !agency) {
    res.status(400);
    throw new Error('Agency-User must be assigned to an agency');
  }

  if (role === 'State-Admin' && !state) {
    res.status(400);
    throw new Error('State-Admin must be assigned to a state');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    agency: role === 'Agency-User' ? agency : undefined,
    state: role === 'State-Admin' ? state : undefined,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      agency: user.agency,
      state: user.state,
      isActive: user.isActive,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Public user registration (pending approval)
// @route   POST /api/users/register-public
// @access  Public
const registerUserPublic = asyncHandler(async (req, res) => {
  const { name, email, password, role, agency, state } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Validate role-specific requirements
  if (role === 'Agency-User' && !agency) {
    res.status(400);
    throw new Error('Agency-User must select an agency');
  }

  if (role === 'State-Admin' && !state) {
    res.status(400);
    throw new Error('State-Admin must select a state');
  }

  // Create user with inactive status (pending admin approval)
  const user = await User.create({
    name,
    email,
    password,
    role,
    agency: role === 'Agency-User' ? agency : undefined,
    state: role === 'State-Admin' ? state : undefined,
    isActive: false, // Require admin approval
  });

  if (user) {
    res.status(201).json({
      message: 'Registration successful! Your account is pending admin approval.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password').populate('agency');

  if (user && (await user.matchPassword(password))) {
    if (!user.isActive) {
      res.status(401);
      throw new Error('User account is inactive');
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      agency: user.agency,
      state: user.state,
      isActive: user.isActive,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    agency: req.user.agency,
    state: req.user.state,
    isActive: req.user.isActive,
  });
});

// @desc    Update current user profile
// @route   PUT /api/users/me
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, currentPassword, password } = req.body;

  // If user wants to change password, verify current password
  if (password) {
    if (!currentPassword) {
      res.status(400);
      throw new Error('Current password is required to set a new password');
    }

    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      res.status(401);
      throw new Error('Current password is incorrect');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('New password must be at least 6 characters');
    }

    user.password = password;
  }

  // Update name and email
  if (name) user.name = name;
  if (email) {
    // Check if email is already taken by another user
    const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
    if (emailExists) {
      res.status(400);
      throw new Error('Email is already in use');
    }
    user.email = email;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    agency: updatedUser.agency,
    state: updatedUser.state,
    isActive: updatedUser.isActive,
    token: generateToken(updatedUser._id),
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { role, state, agency, isActive } = req.query;
  
  let query = {};
  
  if (role) query.role = role;
  if (state) query.state = state;
  if (agency) query.agency = agency;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const users = await User.find(query)
    .select('-password')
    .populate('agency')
    .sort({ createdAt: -1 });

  res.json(users);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('agency');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, role, agency, state, isActive } = req.body;

  // Check if isActive status is changing from false to true (approval)
  const wasInactive = !user.isActive;
  const isBeingActivated = isActive === true && wasInactive;

  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  user.agency = agency !== undefined ? agency : user.agency;
  user.state = state || user.state;
  user.isActive = isActive !== undefined ? isActive : user.isActive;

  const updatedUser = await user.save();
  await updatedUser.populate('agency');

  // Send approval email if user is being activated
  if (isBeingActivated) {
    try {
      await sendApprovalEmail(updatedUser);
      console.log(`✅ Approval email sent to ${updatedUser.email}`);
    } catch (emailError) {
      console.error('⚠️  User activated but email failed:', emailError.message);
      // Don't fail the request if email fails
    }
  }

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    agency: updatedUser.agency,
    state: updatedUser.state,
    isActive: updatedUser.isActive,
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();

  res.json({ message: 'User removed' });
});

// @desc    Approve user (activate account and send email)
// @route   PUT /api/users/:id/approve
// @access  Private/Admin
const approveUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('agency');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isActive) {
    res.status(400);
    throw new Error('User is already active');
  }

  // Activate user
  user.isActive = true;
  const updatedUser = await user.save();

  // Send approval email
  try {
    await sendApprovalEmail(updatedUser);
    console.log(`✅ Approval email sent to ${updatedUser.email}`);
  } catch (emailError) {
    console.error('⚠️  User approved but email failed:', emailError.message);
  }

  res.json({
    message: 'User approved successfully',
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      agency: updatedUser.agency,
      state: updatedUser.state,
      isActive: updatedUser.isActive,
    },
  });
});

// @desc    Reject user (delete account and send email)
// @route   DELETE /api/users/:id/reject
// @access  Private/Admin
const rejectUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('agency');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { reason } = req.body;

  // Send rejection email before deleting
  try {
    await sendRejectionEmail(user, reason);
    console.log(`✅ Rejection email sent to ${user.email}`);
  } catch (emailError) {
    console.error('⚠️  Email failed:', emailError.message);
  }

  // Delete user
  await user.deleteOne();

  res.json({ 
    message: 'User registration rejected',
    email: user.email
  });
});

module.exports = {
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
};
