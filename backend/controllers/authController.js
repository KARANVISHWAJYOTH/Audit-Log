const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Log = require('../models/Log');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Log the registration
    const logEntry = new Log({
      userId: user._id.toString(),
      action: 'CREATE_USER',
      entity: 'User',
      entityId: user._id.toString(),
      ipAddress: req.ip || req.connection.remoteAddress,
      details: { email: user.email, role: user.role },
      userAgent: req.get('User-Agent')
    });
    await logEntry.save();

    // Return user data (without password)
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate user
    const user = await User.authenticate(email, password);

    // Generate token
    const token = generateToken(user._id);

    // Log the login
    const logEntry = new Log({
      userId: user._id.toString(),
      action: 'LOGIN',
      entity: 'Session',
      entityId: `session_${Date.now()}`,
      ipAddress: req.ip || req.connection.remoteAddress,
      details: { email: user.email },
      userAgent: req.get('User-Agent')
    });
    await logEntry.save();

    // Return user data (without password)
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);

    // Log failed login attempt
    try {
      const logEntry = new Log({
        userId: email || 'unknown',
        action: 'FAILED_LOGIN',
        entity: 'Session',
        entityId: `failed_${Date.now()}`,
        ipAddress: req.ip || req.connection.remoteAddress,
        details: { reason: error.message, email: email },
        userAgent: req.get('User-Agent')
      });
      await logEntry.save();
    } catch (logError) {
      console.error('Failed to log failed login:', logError);
    }

    res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user._id;

    // Check if new email/username is already taken by another user
    if (email || username) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: userId } },
          {
            $or: [
              ...(email ? [{ email }] : []),
              ...(username ? [{ username }] : [])
            ]
          }
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: existingUser.email === email ? 'Email already taken' : 'Username already taken'
        });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log the profile update
    const logEntry = new Log({
      userId: user._id.toString(),
      action: 'UPDATE_USER',
      entity: 'User',
      entityId: user._id.toString(),
      ipAddress: req.ip || req.connection.remoteAddress,
      details: { changes: Object.keys(updateData) },
      userAgent: req.get('User-Agent')
    });
    await logEntry.save();

    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Log the password change
    const logEntry = new Log({
      userId: user._id.toString(),
      action: 'PASSWORD_CHANGE',
      entity: 'User',
      entityId: user._id.toString(),
      ipAddress: req.ip || req.connection.remoteAddress,
      details: { email: user.email },
      userAgent: req.get('User-Agent')
    });
    await logEntry.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};