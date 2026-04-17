const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true,
    trim: true,
    maxlength: [100, 'User ID cannot exceed 100 characters']
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: {
      values: [
        'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'API_ACCESS',
        'CREATE_ORDER', 'UPDATE_ORDER', 'DELETE_ORDER', 'EXPORT_DATA',
        'BACKUP_DB', 'READ_SECRET', 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER',
        'PASSWORD_CHANGE', 'PERMISSION_CHANGE', 'SESSION_EXPIRED', 'FAILED_LOGIN'
      ],
      message: 'Invalid action type'
    },
    index: true
  },
  entity: {
    type: String,
    required: [true, 'Entity is required'],
    trim: true,
    maxlength: [100, 'Entity cannot exceed 100 characters']
  },
  entityId: {
    type: String,
    required: [true, 'Entity ID is required'],
    trim: true,
    maxlength: [100, 'Entity ID cannot exceed 100 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  ipAddress: {
    type: String,
    required: [true, 'IP address is required'],
    trim: true
  },
  userAgent: {
    type: String,
    trim: true,
    maxlength: [500, 'User agent cannot exceed 500 characters']
  },
  sessionId: {
    type: String,
    trim: true,
    maxlength: [100, 'Session ID cannot exceed 100 characters']
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    validate: {
      validator: function(v) {
        // Limit the size of details object (approx 16KB)
        return JSON.stringify(v).length <= 16384;
      },
      message: 'Details object is too large'
    }
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'WARNING', 'ERROR', 'INFO'],
    default: 'SUCCESS'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient querying
logSchema.index({ userId: 1, timestamp: -1 });
logSchema.index({ action: 1, timestamp: -1 });
logSchema.index({ entity: 1, timestamp: -1 });
logSchema.index({ ipAddress: 1 });
logSchema.index({ timestamp: -1 });
logSchema.index({ severity: 1 });
logSchema.index({ status: 1 });

// Virtual for formatted timestamp
logSchema.virtual('formattedTimestamp').get(function() {
  return this.timestamp.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
});

// Pre-save middleware to set severity based on action
logSchema.pre('save', function() {
  const highSeverityActions = ['DELETE_USER', 'DELETE_ORDER', 'READ_SECRET', 'PERMISSION_CHANGE'];
  const criticalActions = ['FAILED_LOGIN', 'PASSWORD_CHANGE'];

  if (criticalActions.includes(this.action)) {
    this.severity = 'CRITICAL';
  } else if (highSeverityActions.includes(this.action)) {
    this.severity = 'HIGH';
  } else if (this.action.includes('DELETE') || this.action.includes('FAILED')) {
    this.severity = 'MEDIUM';
  }

  // Set status based on action
  if (this.action.includes('FAILED')) {
    this.status = 'ERROR';
  } else if (this.action.includes('DELETE') || this.action.includes('UPDATE')) {
    this.status = 'WARNING';
  }
});

// Static method to get logs by date range
logSchema.statics.getLogsByDateRange = function(startDate, endDate, options = {}) {
  const query = {
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  };

  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(options.limit || 100);
};

// Static method to get user activity summary
logSchema.statics.getUserActivitySummary = function(userId, days = 30) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return this.aggregate([
    {
      $match: {
        userId,
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        lastActivity: { $max: '$timestamp' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.model('Log', logSchema);