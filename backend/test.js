const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  try {
    console.log('🧪 Testing Audit Log API...\n');

    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);

    // Test 2: Register admin user
    console.log('\n2. Registering admin user...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      username: 'admin',
      email: 'admin@auditlog.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Admin user registered:', registerResponse.data.data.user.email);

    // Test 3: Login
    console.log('\n3. Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@auditlog.com',
      password: 'admin123'
    });
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful, token received');

    // Test 4: Create a log entry
    console.log('\n4. Creating a test log entry...');
    const logResponse = await axios.post(`${BASE_URL}/api/logs`, {
      userId: registerResponse.data.data.user._id,
      action: 'LOGIN',
      entity: 'Session',
      entityId: 'test_session_123',
      ipAddress: '127.0.0.1',
      details: { test: true, source: 'api_test' }
    });
    console.log('✅ Log entry created:', logResponse.data.data._id);

    // Test 5: Get logs (admin only)
    console.log('\n5. Fetching logs as admin...');
    const logsResponse = await axios.get(`${BASE_URL}/api/logs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Retrieved ${logsResponse.data.data.logs.length} logs`);

    // Test 6: Get statistics
    console.log('\n6. Fetching log statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/api/logs/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Statistics retrieved:', {
      totalLogs: statsResponse.data.data.totalLogs,
      todayLogs: statsResponse.data.data.todayLogs
    });

    // Test 7: Register regular user
    console.log('\n7. Registering regular user...');
    const userRegisterResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      username: 'testuser',
      email: 'user@auditlog.com',
      password: 'user123',
      role: 'user'
    });
    console.log('✅ Regular user registered:', userRegisterResponse.data.data.user.email);

    // Test 8: Try to access admin-only endpoint as regular user
    console.log('\n8. Testing role-based access control...');
    const userLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'user@auditlog.com',
      password: 'user123'
    });
    const userToken = userLoginResponse.data.data.token;

    try {
      await axios.get(`${BASE_URL}/api/logs`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log('❌ ERROR: Regular user should not access logs!');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Role-based access control working: Regular user blocked from viewing logs');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('- ✅ Health check');
    console.log('- ✅ User registration');
    console.log('- ✅ Authentication');
    console.log('- ✅ Log creation');
    console.log('- ✅ Admin log access');
    console.log('- ✅ Statistics endpoint');
    console.log('- ✅ Role-based access control');

  } catch (error) {
    console.error('\n❌ API Test Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

// Run tests
testAPI();