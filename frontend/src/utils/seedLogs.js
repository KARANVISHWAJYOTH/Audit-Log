import apiService from '../services/apiService';

const mockLogs = [
  {
    id: 'log_9x2bA',
    user: 'admin@acme.inc',
    action: 'LOGIN',
    entity: 'Session',
    date: '2026-03-24 10:14:22',
    status: 'Success',
    ipAddress: '192.168.1.1',
    details: { browser: 'Chrome', os: 'Windows' }
  },
  {
    id: 'log_8y4cF',
    user: 'jdoe@acme.inc',
    action: 'UPDATE_ORDER',
    entity: 'Order #3491',
    date: '2026-03-24 10:12:05',
    status: 'Success',
    ipAddress: '192.168.1.2',
    details: { orderId: '3491', changes: ['status: pending -> completed'] }
  },
  {
    id: 'log_7z1dS',
    user: 'system_bot',
    action: 'BACKUP_DB',
    entity: 'Database',
    date: '2026-03-24 09:00:00',
    status: 'Success',
    ipAddress: '127.0.0.1',
    details: { backupSize: '2.3GB', duration: '45min' }
  },
  {
    id: 'log_6a9bQ',
    user: 'unknown_ip',
    action: 'FAILED_LOGIN',
    entity: 'Session',
    date: '2026-03-24 08:45:11',
    status: 'Warning',
    ipAddress: '203.0.113.1',
    details: { attempts: 3, reason: 'invalid_credentials' }
  },
  {
    id: 'log_5c3rW',
    user: 'm.scott@acme.inc',
    action: 'DELETE_USER',
    entity: 'User id:992',
    date: '2026-03-24 08:30:45',
    status: 'Danger',
    ipAddress: '192.168.1.3',
    details: { userId: '992', reason: 'account_deactivation' }
  },
  {
    id: 'log_4v8pL',
    user: 'admin@acme.inc',
    action: 'EXPORT_DATA',
    entity: 'AuditLogs',
    date: '2026-03-23 18:22:10',
    status: 'Success',
    ipAddress: '192.168.1.1',
    details: { format: 'CSV', recordCount: 1250 }
  },
  {
    id: 'log_3k2jM',
    user: 'api_key_v2',
    action: 'READ_SECRET',
    entity: 'Vault',
    date: '2026-03-23 15:10:00',
    status: 'Success',
    ipAddress: '10.0.0.5',
    details: { secretId: 'vault_001', accessLevel: 'read' }
  },
  {
    id: 'log_2x9vB',
    user: 'jdoe@acme.inc',
    action: 'LOGIN',
    entity: 'Session',
    date: '2026-03-23 09:05:12',
    status: 'Success',
    ipAddress: '192.168.1.2',
    details: { browser: 'Firefox', os: 'macOS' }
  },
  {
    id: 'log_1n5mC',
    user: 'unknown_ip',
    action: 'FAILED_LOGIN',
    entity: 'Session',
    date: '2026-03-22 23:45:11',
    status: 'Warning',
    ipAddress: '198.51.100.1',
    details: { attempts: 5, reason: 'brute_force_attempt' }
  },
  {
    id: 'log_0p4lK',
    user: 'm.scott@acme.inc',
    action: 'UPDATE_ORDER',
    entity: 'Order #3100',
    date: '2026-03-22 14:20:00',
    status: 'Success',
    ipAddress: '192.168.1.3',
    details: { orderId: '3100', changes: ['total: $150 -> $175'] }
  },
];

export const seedLogs = async () => {
  try {
    console.log('Starting to seed logs...');

    for (const log of mockLogs) {
      // Convert date string to ISO format for backend
      const dateParts = log.date.split(' ');
      const dateStr = dateParts[0];
      const timeStr = dateParts[1];
      const dateTime = new Date(`${dateStr}T${timeStr}`);

      const logData = {
        ...log,
        userId: log.user,
        entityId: log.details?.orderId || log.details?.userId || log.details?.secretId || 'session_01',
        timestamp: dateTime.toISOString(),
        createdAt: new Date().toISOString()
      };

      // Remove the date and user fields since we're using timestamp and userId
      delete logData.date;
      delete logData.user;

      await apiService.createLog(logData);
      console.log(`Added log: ${log.id}`);
    }

    console.log('Successfully seeded all logs!');
    return { success: true, count: mockLogs.length };
  } catch (error) {
    console.error('Error seeding logs:', error);
    return { success: false, error: error.message };
  }
};

// Function to clear all logs (useful for testing)
export const clearLogs = async () => {
  try {
    console.log('Clearing all logs...');

    // Get all logs first
    const logsResult = await apiService.getLogs({ limit: 1000 }); // Get a large number to clear most logs

    if (logsResult.success && logsResult.data.logs) {
      let clearedCount = 0;
      for (const log of logsResult.data.logs) {
        try {
          await apiService.deleteLog(log._id);
          clearedCount++;
          console.log(`Deleted log: ${log._id}`);
        } catch (deleteError) {
          console.error(`Error deleting log ${log._id}:`, deleteError);
        }
      }

      console.log(`Cleared ${clearedCount} logs`);
      return { success: true, count: clearedCount };
    } else {
      return { success: false, error: 'Failed to retrieve logs for clearing' };
    }
  } catch (error) {
    console.error('Error clearing logs:', error);
    return { success: false, error: error.message };
  }
};