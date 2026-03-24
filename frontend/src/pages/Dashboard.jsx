import React, { useState } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import './Dashboard.css';

const mockLogs = [
  { id: 'log_9x2bA', user: 'admin@acme.inc', defaultAction: 'LOGIN', entity: 'Session', date: '2026-03-24 10:14:22', status: 'Success' },
  { id: 'log_8y4cF', user: 'jdoe@acme.inc', defaultAction: 'UPDATE_ORDER', entity: 'Order #3491', date: '2026-03-24 10:12:05', status: 'Success' },
  { id: 'log_7z1dS', user: 'system_bot', defaultAction: 'BACKUP_DB', entity: 'Database', date: '2026-03-24 09:00:00', status: 'Success' },
  { id: 'log_6a9bQ', user: 'unknown_ip', defaultAction: 'FAILED_LOGIN', entity: 'Session', date: '2026-03-24 08:45:11', status: 'Warning' },
  { id: 'log_5c3rW', user: 'm.scott@acme.inc', defaultAction: 'DELETE_USER', entity: 'User id:992', date: '2026-03-24 08:30:45', status: 'Danger' },
  { id: 'log_4v8pL', user: 'admin@acme.inc', defaultAction: 'EXPORT_DATA', entity: 'AuditLogs', date: '2026-03-23 18:22:10', status: 'Success' },
  { id: 'log_3k2jM', user: 'api_key_v2', defaultAction: 'READ_SECRET', entity: 'Vault', date: '2026-03-23 15:10:00', status: 'Success' },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.user.includes(searchTerm) || log.entity.includes(searchTerm) || log.id.includes(searchTerm);
    const matchesAction = actionFilter === 'ALL' || log.defaultAction.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  return (
    <div className="dashboard-page animate-fade-in pb-12">
      <header className="dashboard-header bg-secondary">
        <div className="container header-container">
          <div>
            <h1 className="page-title text-left" style={{marginBottom: '0.25rem'}}>Dashboard</h1>
            <p className="page-subtitle text-left m-0">Live stream of system activities</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline"><RefreshCw size={18} /> Refresh</button>
            <button className="btn btn-primary"><Download size={18} /> Export CSV</button>
          </div>
        </div>
      </header>

      <div className="container mt-8">
        <div className="dashboard-controls">
          <div className="search-box">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search by User, Entity, or Log ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filters">
            <div className="filter-group">
              <Filter size={18} className="filter-icon" />
              <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
                <option value="ALL">All Actions</option>
                <option value="LOGIN">Logins</option>
                <option value="UPDATE">Updates</option>
                <option value="DELETE">Deletions</option>
              </select>
            </div>
            <div className="filter-group">
              <input type="date" className="date-picker" defaultValue="2026-03-24" />
            </div>
          </div>
        </div>

        <div className="table-container mt-6">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Timestamp</th>
                <th>User / Actor</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td className="font-mono">{log.id}</td>
                    <td className="text-tertiary">{log.date}</td>
                    <td className="font-medium">{log.user}</td>
                    <td><span className="badge badge-action">{log.defaultAction}</span></td>
                    <td>{log.entity}</td>
                    <td>
                      <span className={`status-dot status-${log.status.toLowerCase()}`}></span>
                      {log.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-tertiary">No logs found matching your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination mt-6">
          <div className="pagination-info">Showing 1 to {filteredLogs.length} of {mockLogs.length} entries</div>
          <div className="pagination-controls">
            <button className="btn btn-outline btn-icon" disabled><ChevronLeft size={20} /></button>
            <button className="btn btn-primary btn-icon">1</button>
            <button className="btn btn-outline btn-icon">2</button>
            <button className="btn btn-outline btn-icon">3</button>
            <button className="btn btn-outline btn-icon"><ChevronRight size={20} /></button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
