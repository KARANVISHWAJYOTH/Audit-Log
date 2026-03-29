import React, { useState } from 'react';
import { seedLogs, clearLogs } from '../utils/seedLogs';
import { Database, Trash2 } from 'lucide-react';

const SeedData = () => {
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setSeeding(true);
    setMessage('');
    try {
      const result = await seedLogs();
      if (result.success) {
        setMessage(`Successfully seeded ${result.count} logs!`);
      } else {
        setMessage(`Error seeding logs: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      return;
    }

    setClearing(true);
    setMessage('');
    try {
      const result = await clearLogs();
      if (result.success) {
        setMessage(`Successfully cleared ${result.count} logs!`);
      } else {
        setMessage(`Error clearing logs: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      minWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Database Tools</h4>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          onClick={handleSeed}
          disabled={seeding}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: seeding ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Database size={14} />
          {seeding ? 'Seeding...' : 'Seed Data'}
        </button>

        <button
          onClick={handleClear}
          disabled={clearing}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: clearing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Trash2 size={14} />
          {clearing ? 'Clearing...' : 'Clear All'}
        </button>
      </div>

      {message && (
        <div style={{
          padding: '8px',
          background: message.includes('Error') ? '#f8d7da' : '#d4edda',
          color: message.includes('Error') ? '#721c24' : '#155724',
          borderRadius: '4px',
          fontSize: '14px',
          wordWrap: 'break-word'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default SeedData;