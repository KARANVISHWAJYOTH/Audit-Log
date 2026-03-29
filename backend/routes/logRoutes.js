const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { validateLogCreation, validateLogQuery } = require('../middleware/validation');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/logs - Get all logs with filtering and pagination (Admin only)
router.get('/',
  authenticateToken,
  requireAdmin,
  validateLogQuery,
  asyncHandler(logController.getLogs)
);

// GET /api/logs/stats - Get log statistics (Admin only)
router.get('/stats',
  authenticateToken,
  requireAdmin,
  asyncHandler(logController.getLogStats)
);

// GET /api/logs/:id - Get a specific log (Admin only)
router.get('/:id',
  authenticateToken,
  requireAdmin,
  asyncHandler(logController.getLogById)
);

// POST /api/logs - Create a new log (Optional auth - can be called by system or authenticated users)
router.post('/',
  optionalAuth,
  validateLogCreation,
  asyncHandler(logController.createLog)
);

// DELETE /api/logs/:id - Delete a log (Admin only)
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  asyncHandler(logController.deleteLog)
);

module.exports = router;