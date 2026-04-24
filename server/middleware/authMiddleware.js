const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Protect routes - verify JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password').populate('agency');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }

      if (!req.user.isActive) {
        res.status(401);
        throw new Error('User account is inactive');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'MoSJE-Admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
};

// State Admin or higher middleware
const stateAdminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'State-Admin' || req.user.role === 'MoSJE-Admin')) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as state admin or higher');
  }
};

// Check if user can access state data
const canAccessState = (stateParam) => {
  return (req, res, next) => {
    const state = req.params[stateParam] || req.body[stateParam] || req.query[stateParam];
    
    if (req.user.role === 'MoSJE-Admin') {
      // MoSJE Admin can access all states
      next();
    } else if (req.user.role === 'State-Admin') {
      // State Admin can only access their own state
      if (req.user.state === state) {
        next();
      } else {
        res.status(403);
        throw new Error('Not authorized to access this state data');
      }
    } else {
      res.status(403);
      throw new Error('Not authorized to access state data');
    }
  };
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

module.exports = { 
  protect, 
  adminOnly, 
  stateAdminOnly, 
  canAccessState,
  generateToken 
};
