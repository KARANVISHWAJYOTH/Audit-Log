# 🚀 Audit Log System - Complete Solution

A comprehensive, production-ready audit logging system built with modern web technologies. Track, monitor, and analyze all system activities with JWT authentication, role-based access control, and real-time capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Frontend Guide](#-frontend-guide)
- [Database Schema](#-database-schema)
- [Security Features](#-security-features)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Project Structure](#-project-structure)

## ✨ Features

### Backend Features
- **JWT Authentication** with secure token management
- **Role-Based Access Control** (User, Admin, Moderator)
- **Comprehensive Audit Logging** with automatic request tracking
- **Advanced Filtering & Pagination** for large datasets
- **Real-time Statistics** and analytics
- **MongoDB Integration** with optimized indexing
- **Input Validation** with Joi schemas
- **Error Handling** with detailed logging
- **CORS Support** for cross-origin requests
- **Password Security** with bcrypt hashing
- **Account Lockout** after failed login attempts

### Frontend Features
- **React 18** with modern hooks and context
- **Firebase Integration** for real-time data
- **Responsive Design** with custom CSS
- **Authentication Flow** with protected routes
- **Real-time Dashboard** with live log streaming
- **Advanced Filtering** and search capabilities
- **CSV Export** functionality
- **Modern UI/UX** with Lucide React icons

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi
- **Security**: bcryptjs, CORS
- **Process Management**: PM2 (production)

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: React Context + Custom Hooks
- **Styling**: Custom CSS with responsive design
- **Icons**: Lucide React
- **Real-time**: Firebase Firestore
- **Routing**: React Router v6

### DevOps
- **Environment**: Docker support
- **API Testing**: Postman collection included
- **Linting**: ESLint configuration
- **Version Control**: Git with proper .gitignore

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone and Setup
```bash
git clone <repository-url>
cd audit-log-system
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed database with test data
npm run seed

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Configure Firebase (if using)
# Update src/firebase/config.js with your Firebase credentials

# Start development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Audit Log Endpoints

#### Get Logs (Admin Only)
```http
GET /api/logs?page=1&limit=50&userId=user123&action=LOGIN&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <admin-token>
```

#### Create Log Entry
```http
POST /api/logs
Content-Type: application/json

{
  "userId": "user123",
  "action": "LOGIN",
  "entity": "Session",
  "entityId": "session_123",
  "ipAddress": "192.168.1.1",
  "details": { "browser": "Chrome" }
}
```

#### Get Statistics (Admin Only)
```http
GET /api/logs/stats
Authorization: Bearer <admin-token>
```

## 🎨 Frontend Guide

### Authentication Flow
1. **Registration**: Create account with email/password
2. **Login**: Authenticate and receive JWT token
3. **Protected Routes**: Automatic token validation
4. **Profile Management**: Update user information

### Dashboard Features
- **Real-time Logs**: Live streaming from Firebase
- **Advanced Filtering**: By user, action, date range
- **Pagination**: Efficient handling of large datasets
- **CSV Export**: Download filtered results
- **Statistics**: Visual analytics and insights

### Component Structure
```
frontend/src/
├── components/     # Reusable UI components
├── pages/         # Route-based page components
├── services/      # API and Firebase services
├── hooks/         # Custom React hooks
├── context/       # React context providers
└── utils/         # Helper functions
```

## 🗄 Database Schema

### User Collection
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (user|admin|moderator),
  isActive: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date
}
```

### Log Collection
```javascript
{
  userId: String,
  action: String,
  entity: String,
  entityId: String,
  timestamp: Date,
  ipAddress: String,
  userAgent: String,
  sessionId: String,
  details: Object,
  severity: String (LOW|MEDIUM|HIGH|CRITICAL),
  status: String (SUCCESS|WARNING|ERROR|INFO)
}
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication with expiration
- **Account Lockout**: After 5 failed login attempts
- **Input Validation**: Comprehensive schema validation
- **CORS Protection**: Configured allowed origins
- **Request Logging**: All API calls automatically logged
- **Role-Based Access**: Admin-only log viewing
- **SQL Injection Protection**: MongoDB/Mongoose built-in

## 🚀 Deployment

### Environment Variables
```env
# Backend
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_production_secret
JWT_EXPIRES_IN=7d
PORT=5000
FRONTEND_URL=https://yourdomain.com

# Frontend
VITE_API_URL=https://your-api-domain.com
VITE_FIREBASE_API_KEY=...
# ... other Firebase config
```

### Production Deployment Options

#### Railway/Render (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

#### Docker Deployment
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

#### Manual Deployment
```bash
# Backend
npm run build
npm start

# Frontend
npm run build
# Serve dist/ folder with nginx/apache
```

## 🧪 Testing

### Automated API Tests
```bash
cd backend
npm run test:api
```

### Manual Testing with Postman
1. Import `AuditLogAPI.postman_collection.json`
2. Set base URL to your server
3. Run authentication flow
4. Test all endpoints

### Default Test Accounts
- **Admin**: `admin@auditlog.com` / `admin123`
- **User**: `user@auditlog.com` / `user123`

## 📁 Project Structure

```
audit-log-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── logController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── requestLogger.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   └── Log.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── logRoutes.js
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── seed.js
│   └── README.md
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── firebase/
│   │   └── assets/
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
└── README.md
```

## 📈 Performance & Scalability

- **Database Indexing**: Optimized queries with compound indexes
- **Pagination**: Efficient handling of large result sets
- **Caching**: Ready for Redis integration
- **Rate Limiting**: Prepared for implementation
- **Load Balancing**: Stateless design supports horizontal scaling
- **Monitoring**: Comprehensive logging for performance tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: GitHub Issues
- **Documentation**: Comprehensive README files
- **API Reference**: Auto-generated from code comments
- **Postman Collection**: Pre-configured API tests

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Log retention policies
- [ ] Multi-tenant support
- [ ] API rate limiting
- ] Log archiving to cloud storage
- [ ] Integration with SIEM systems

---

**Built with ❤️ for security, reliability, and transparency in system monitoring.**