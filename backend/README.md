# Audit Log System Backend

A comprehensive backend system for tracking and monitoring user activities with JWT authentication and role-based access control.

## Features

- **JWT Authentication**: Secure user authentication with token-based sessions
- **Role-Based Access Control**: Admin-only access to audit logs
- **Comprehensive Logging**: Track all system activities with detailed metadata
- **Filtering & Pagination**: Efficient querying of large datasets
- **Real-time Statistics**: Dashboard-ready analytics
- **Automatic Request Logging**: All API calls are automatically logged
- **Security Features**: Password hashing, account lockout, input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Joi
- **Security**: bcryptjs for password hashing
- **CORS**: Cross-origin resource sharing

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd audit-log-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/auditlog
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

4. **Seed the database** (creates admin user and sample data)
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

The server will start on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
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

#### Update Profile (Protected)
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

#### Change Password (Protected)
```http
PUT /api/auth/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Audit Log Endpoints

#### Get Logs (Admin Only)
```http
GET /api/logs?page=1&limit=50&userId=user123&action=LOGIN
Authorization: Bearer <admin-token>
```

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)
- `userId`: Filter by user ID
- `action`: Filter by action type
- `startDate`: Filter from date (ISO format)
- `endDate`: Filter to date (ISO format)

#### Get Log Statistics (Admin Only)
```http
GET /api/logs/stats
Authorization: Bearer <admin-token>
```

#### Get Specific Log (Admin Only)
```http
GET /api/logs/:id
Authorization: Bearer <admin-token>
```

#### Create Log Entry
```http
POST /api/logs
Content-Type: application/json
Authorization: Bearer <token> (optional)

{
  "userId": "user123",
  "action": "LOGIN",
  "entity": "Session",
  "entityId": "session_123",
  "ipAddress": "192.168.1.1",
  "details": {
    "browser": "Chrome",
    "os": "Windows"
  },
  "userAgent": "Mozilla/5.0...",
  "sessionId": "session_abc"
}
```

#### Delete Log (Admin Only)
```http
DELETE /api/logs/:id
Authorization: Bearer <admin-token>
```

## User Roles

- **user**: Can create logs, view own profile
- **admin**: All permissions including viewing all logs
- **moderator**: Extended user permissions (future use)

## Log Actions

Supported action types:
- `LOGIN`, `LOGOUT`
- `CREATE`, `UPDATE`, `DELETE`, `VIEW`
- `CREATE_ORDER`, `UPDATE_ORDER`, `DELETE_ORDER`
- `EXPORT_DATA`, `BACKUP_DB`, `READ_SECRET`
- `CREATE_USER`, `UPDATE_USER`, `DELETE_USER`
- `PASSWORD_CHANGE`, `PERMISSION_CHANGE`
- `SESSION_EXPIRED`, `FAILED_LOGIN`

## Database Schema

### User Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String (user|admin|moderator),
  isActive: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date,
  createdAt: Date,
  updatedAt: Date
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
  status: String (SUCCESS|WARNING|ERROR|INFO),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication with expiration
- **Account Lockout**: After 5 failed login attempts
- **Input Validation**: Joi schema validation
- **CORS Protection**: Configured origins
- **Request Logging**: All API calls are logged
- **Role-Based Access**: Admin-only log viewing

## Testing

### Default Test Accounts

After running `npm run seed`, you can use:

**Admin Account:**
- Email: `admin@auditlog.com`
- Password: `admin123`
- Role: admin

**User Account:**
- Email: `user@auditlog.com`
- Password: `user123`
- Role: user

### API Testing with cURL

```bash
# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@auditlog.com","password":"admin123"}'

# Get logs (use token from login response)
curl -X GET http://localhost:5000/api/logs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create a log entry
curl -X POST http://localhost:5000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user",
    "action": "LOGIN",
    "entity": "Session",
    "entityId": "session_123",
    "ipAddress": "127.0.0.1"
  }'
```

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auditlog
JWT_SECRET=your_production_jwt_secret_key
JWT_EXPIRES_IN=7d
PORT=5000
FRONTEND_URL=https://yourfrontend.com
```

### Deploy to Railway/Render

1. Connect your GitHub repository
2. Set environment variables
3. Deploy

The app will automatically run `npm start` and connect to your production database.

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── logController.js     # Log CRUD operations
├── middleware/
│   ├── auth.js             # JWT authentication & authorization
│   ├── errorHandler.js     # Global error handling
│   ├── requestLogger.js    # Automatic request logging
│   └── validation.js       # Input validation
├── models/
│   ├── User.js             # User schema
│   └── Log.js              # Log schema
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   └── logRoutes.js        # Log routes
├── .env                    # Environment variables
├── package.json
├── seed.js                 # Database seeding script
└── server.js               # Main application file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.