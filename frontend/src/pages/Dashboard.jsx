import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, RefreshCw, Database } from 'lucide-react';
import { useLogs } from '../hooks/useLogs';
import SeedData from '../components/SeedData';
import './Dashboard.css';

const ITEMS_PER_PAGE = 5;

const Dashboard = () => {
  const { logs, loading, fetchLogs: refreshLogs } = useLogs(false); // Use backend API instead of Firebase
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter logs based on search and action dropdown
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.entity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [logs, searchTerm, actionFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const handleFilterChange = (e) => {
    setActionFilter(e.target.value);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshLogs();
    setTimeout(() => {
      setIsRefreshing(false);
      setCurrentPage(1);
    }, 600); // Simulate network delay
  };

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;

    const headers = ['Log ID', 'Timestamp', 'User / Actor', 'Action', 'Entity', 'Status', 'IP Address'];
    const csvRows = [headers.join(',')];

    filteredLogs.forEach(log => {
      const row = [
        log.id,
        log.date,
        log.user || '',
        log.action || '',
        log.entity || '',
        log.status || '',
        log.ipAddress || ''
      ];
      csvRows.push(row.map(field => `"${field}"`).join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'audit_logs_export.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="dashboard-page animate-fade-in pb-12">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '18px'
        }}>
          <Database size={24} style={{marginRight: '12px'}} />
          Loading audit logs...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page animate-fade-in pb-12">
      <header className="dashboard-header bg-secondary">
        <div className="container header-container">
          <div>
            <h1 className="page-title text-left" style={{marginBottom: '0.25rem'}}>Dashboard</h1>
            <p className="page-subtitle text-left m-0">Live stream of system activities from Firebase</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw size={18} className={isRefreshing ? "spin-animation" : ""} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button className="btn btn-primary" onClick={handleExportCSV}>
              <Download size={18} /> Export CSV
            </button>
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
              onChange={handleSearchChange}
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <Filter size={18} className="filter-icon" />
              <select value={actionFilter} onChange={handleFilterChange}>
                <option value="ALL">All Actions</option>
                <option value="LOGIN">LOGIN</option>
                <option value="FAILED_LOGIN">FAILED_LOGIN</option>
                <option value="UPDATE_ORDER">UPDATE_ORDER</option>
                <option value="DELETE_USER">DELETE_USER</option>
                <option value="BACKUP_DB">BACKUP_DB</option>
                <option value="EXPORT_DATA">EXPORT_DATA</option>
                <option value="READ_SECRET">READ_SECRET</option>
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
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody style={{ opacity: isRefreshing ? 0.5 : 1, transition: 'opacity 0.2s' }}>
              {currentLogs.length > 0 ? (
                currentLogs.map(log => (
                  <tr key={log.id}>
                    <td className="font-mono">{log.id}</td>
                    <td className="text-tertiary">{log.date}</td>
                    <td className="font-medium">{log.user}</td>
                    <td><span className="badge badge-action">{log.action}</span></td>
                    <td>{log.entity}</td>
                    <td>
                      <span className={`status-dot status-${log.status?.toLowerCase()}`}></span>
                      {log.status}
                    </td>
                    <td className="font-mono text-tertiary">
                      {log.ipAddress === '::1' ? '127.0.0.1' : (log.ipAddress || 'N/A')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-tertiary">
                    {logs.length === 0 ? 'No audit logs found. Run the seed function to populate data.' : 'No logs found matching your filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 0 && (
          <div className="pagination mt-6">
            <div className="pagination-info">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredLogs.length)} of {filteredLogs.length} entries
            </div>
            <div className="pagination-controls">
              <button
                className="btn btn-outline btn-icon"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={20} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`btn btn-icon ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="btn btn-outline btn-icon"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Database seeding tool - remove in production */}
      <SeedData />
    </div>
  );
};

export default Dashboard;
