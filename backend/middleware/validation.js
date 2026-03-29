const Joi = require('joi');

// Log creation validation schema
const logSchema = Joi.object({
  userId: Joi.string().required().min(1).max(100),
  action: Joi.string().required().valid(
    'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW',
    'CREATE_ORDER', 'UPDATE_ORDER', 'DELETE_ORDER', 'EXPORT_DATA',
    'BACKUP_DB', 'READ_SECRET', 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER'
  ),
  entity: Joi.string().required().min(1).max(100),
  entityId: Joi.string().required().min(1).max(100),
  ipAddress: Joi.string().optional(),
  details: Joi.object().optional(),
  userAgent: Joi.string().optional(),
  sessionId: Joi.string().optional()
});

// Query parameters validation for logs
const logQuerySchema = Joi.object({
  userId: Joi.string().optional(),
  action: Joi.string().optional(),
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(50),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional()
});

// Validation middleware
const validateLogCreation = (req, res, next) => {
  const { error } = logSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateLogQuery = (req, res, next) => {
  const { error } = logQuerySchema.validate(req.query, { abortEarly: false });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Query validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateLogCreation,
  validateLogQuery
};