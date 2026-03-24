const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory mock database for logs
let logs = [
  {
    id: "1",
    userId: "123",
    action: "LOGIN",
    entity: "User",
    entityId: "123",
    timestamp: new Date().toISOString(),
    ipAddress: "192.168.1.1"
  },
  {
    id: "2",
    userId: "456",
    action: "DELETE_ORDER",
    entity: "Order",
    entityId: "ORD1001",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    ipAddress: "192.168.1.5"
  }
];

// GET /logs - Retrieve logs with optional filters
app.get('/logs', (req, res) => {
  const { userId, action } = req.query;
  let filteredLogs = [...logs];

  if (userId) {
    filteredLogs = filteredLogs.filter(log => log.userId === userId);
  }
  if (action) {
    filteredLogs = filteredLogs.filter(log => log.action === action);
  }

  // Sort by newest first
  filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json({ logs: filteredLogs });
});

// POST /logs - Create a new log

app.post('/logs', (req, res) => {
  const newLog = {
    id: Math.random().toString(36).substring(2, 9),
    ...req.body,
    timestamp: req.body.timestamp || new Date().toISOString()
  };
  
  logs.push(newLog);
  res.status(201).json({ message: "Log created successfully", log: newLog });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
