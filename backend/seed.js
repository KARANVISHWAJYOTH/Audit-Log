require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Log = require('./models/Log');
const connectDB = require('./config/database');

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@auditlog.com',
      password: 'admin123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created:');
    console.log('Email: admin@auditlog.com');
    console.log('Password: admin123');
    console.log('Role: admin');

    // Create test user
    const testUser = new User({
      username: 'testuser',
      email: 'user@auditlog.com',
      password: 'user123',
      role: 'user'
    });

    await testUser.save();
    console.log('\nTest user created:');
    console.log('Email: user@auditlog.com');
    console.log('Password: user123');
    console.log('Role: user');

    // Create some sample logs
    const sampleLogs = [
      {
        userId: adminUser._id.toString(),
        action: 'LOGIN',
        entity: 'Session',
        entityId: `session_${Date.now()}`,
        ipAddress: '127.0.0.1',
        details: { browser: 'Chrome', os: 'Windows' },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        userId: testUser._id.toString(),
        action: 'CREATE_ORDER',
        entity: 'Order',
        entityId: 'ORD001',
        ipAddress: '192.168.1.1',
        details: { orderId: 'ORD001', amount: 150.00 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      {
        userId: adminUser._id.toString(),
        action: 'DELETE_USER',
        entity: 'User',
        entityId: 'user123',
        ipAddress: '127.0.0.1',
        details: { deletedUserId: 'user123', reason: 'account_deactivation' },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      {
        userId: 'unknown_user',
        action: 'FAILED_LOGIN',
        entity: 'Session',
        entityId: `failed_${Date.now()}`,
        ipAddress: '203.0.113.1',
        details: { attempts: 3, reason: 'invalid_credentials' },
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
      },
      {
        userId: testUser._id.toString(),
        action: 'UPDATE_ORDER',
        entity: 'Order',
        entityId: 'ORD001',
        ipAddress: '192.168.1.1',
        details: { orderId: 'ORD001', changes: ['status: pending -> completed'] },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    ];

    for (const logData of sampleLogs) {
      const log = new Log(logData);
      await log.save();
    }

    console.log(`\nCreated ${sampleLogs.length} sample audit logs`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nYou can now:');
    console.log('1. Login as admin: admin@auditlog.com / admin123');
    console.log('2. Login as user: user@auditlog.com / user123');
    console.log('3. View logs at: GET /api/logs (admin only)');
    console.log('4. Create logs at: POST /api/logs');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

// Run seeder
seedDatabase();