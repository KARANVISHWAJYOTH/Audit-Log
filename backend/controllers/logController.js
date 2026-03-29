const Log = require('../models/Log');

// Get all logs with filtering and pagination
const getLogs = async (req, res) => {
  try {
    const { userId, action, page = 1, limit = 50, startDate, endDate } = req.query;
    const query = {};

    // Build query filters
    if (userId) query.userId = userId;
    if (action) query.action = action;

    // Date range filtering
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { timestamp: -1 }
    };

    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Log.countDocuments(query);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create a new log entry
const createLog = async (req, res) => {
  try {
    const { userId, action, entity, entityId, ipAddress, details, userAgent, sessionId } = req.body;

    // Validation
    if (!userId || !action || !entity || !entityId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, action, entity, entityId'
      });
    }

    // Get IP address from request
    const clientIP = req.ip ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                    ipAddress;

    const newLog = new Log({
      userId,
      action,
      entity,
      entityId,
      ipAddress: clientIP,
      details: details || {},
      userAgent: userAgent || req.get('User-Agent'),
      sessionId
    });

    const savedLog = await newLog.save();

    res.status(201).json({
      success: true,
      message: "Log created successfully",
      data: savedLog
    });
  } catch (error) {
    console.error('Error creating log:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create log',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get log statistics
const getLogStats = async (req, res) => {
  try {
    const totalLogs = await Log.countDocuments();

    // Today's logs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogs = await Log.countDocuments({ timestamp: { $gte: today } });

    // Action statistics
    const actionStats = await Log.aggregate([
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // User statistics
    const userStats = await Log.aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Recent activity (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivity = await Log.find({ timestamp: { $gte: yesterday } })
      .sort({ timestamp: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalLogs,
        todayLogs,
        actionStats,
        userStats,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get a specific log by ID
const getLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await Log.findById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Log not found'
      });
    }

    res.json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error('Error fetching log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch log',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete a log (admin only)
const deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLog = await Log.findByIdAndDelete(id);

    if (!deletedLog) {
      return res.status(404).json({
        success: false,
        message: 'Log not found'
      });
    }

    res.json({
      success: true,
      message: 'Log deleted successfully',
      data: deletedLog
    });
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete log',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getLogs,
  createLog,
  getLogStats,
  getLogById,
  deleteLog
};