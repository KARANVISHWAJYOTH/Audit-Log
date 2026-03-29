const Log = require('../models/Log');

// Middleware to automatically log API requests
const logRequest = (req, res, next) => {
  const startTime = Date.now();

  // Log the request after response is sent
  res.on('finish', async () => {
    try {
      const duration = Date.now() - startTime;
      const userId = req.user ? req.user._id.toString() : 'system';

      // Skip logging health checks and static files
      if (req.path === '/health' || req.path.startsWith('/api/logs/stats')) {
        return;
      }

      // Determine action based on HTTP method and path
      let action = 'API_ACCESS';
      let entity = 'API';
      let entityId = `${req.method}_${req.path}`;

      // Map common API patterns to actions
      if (req.method === 'POST' && req.path === '/api/auth/register') {
        action = 'USER_REGISTRATION_ATTEMPT';
        entity = 'User';
      } else if (req.method === 'POST' && req.path === '/api/auth/login') {
        action = 'LOGIN_ATTEMPT';
        entity = 'Session';
      } else if (req.method === 'GET' && req.path.startsWith('/api/logs')) {
        action = 'VIEW_LOGS';
        entity = 'AuditLogs';
      } else if (req.method === 'POST' && req.path === '/api/logs') {
        action = 'CREATE_LOG';
        entity = 'AuditLog';
      } else if (req.method === 'DELETE' && req.path.startsWith('/api/logs/')) {
        action = 'DELETE_LOG';
        entity = 'AuditLog';
      }

      // Create log entry
      const logEntry = new Log({
        userId,
        action,
        entity,
        entityId,
        ipAddress: req.ip ||
                  req.connection.remoteAddress ||
                  req.socket.remoteAddress ||
                  (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                  'unknown',
        details: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          userAgent: req.get('User-Agent'),
          query: req.query,
          body: req.method !== 'GET' ? req.body : undefined
        },
        userAgent: req.get('User-Agent'),
        status: res.statusCode >= 400 ? 'ERROR' : 'SUCCESS'
      });

      // Set severity based on response
      if (res.statusCode >= 500) {
        logEntry.severity = 'CRITICAL';
      } else if (res.statusCode >= 400) {
        logEntry.severity = 'HIGH';
      } else if (res.statusCode >= 300) {
        logEntry.severity = 'MEDIUM';
      }

      await logEntry.save();
    } catch (error) {
      console.error('Failed to log request:', error);
      // Don't throw error to avoid breaking the response
    }
  });

  next();
};

module.exports = logRequest;