const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logRequest = require('./middleware/requestLogger');

// Import routes
const logRoutes = require('./routes/logRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5175',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(logRequest);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Audit Log API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Audit Log API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      // Auth endpoints
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      profile: 'GET /api/auth/profile (protected)',
      updateProfile: 'PUT /api/auth/profile (protected)',
      changePassword: 'PUT /api/auth/password (protected)',
      // Log endpoints (admin only)
      logs: 'GET /api/logs (admin)',
      logStats: 'GET /api/logs/stats (admin)',
      createLog: 'POST /api/logs',
      getLog: 'GET /api/logs/:id (admin)',
      deleteLog: 'DELETE /api/logs/:id (admin)'
    },
    authentication: {
      type: 'JWT Bearer Token',
      header: 'Authorization: Bearer <token>',
      adminRequired: 'Log viewing requires admin role'
    }
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Audit Log API server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5175'}`);
});
