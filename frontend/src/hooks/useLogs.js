import { useState, useEffect, useCallback } from 'react';
import firebaseService from '../services/firebaseService';
import apiService from '../services/apiService';

export const useLogs = (useFirebase = true) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });

  // Fetch logs from API or Firebase
  const fetchLogs = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      let result;
      if (useFirebase) {
        result = await firebaseService.getLogs(params);
        if (result.success) {
          setLogs(result.data);
        } else {
          throw new Error(result.error);
        }
      } else {
        result = await apiService.getLogs(params);
        if (result.success) {
          const formattedLogs = result.data.logs
            .filter(log => log.action !== 'API_ACCESS')
            .map(log => ({
              ...log,
              user: log.details?.email || log.userId, // Show email if available, otherwise User ID
              date: log.formattedTimestamp || new Date(log.timestamp).toLocaleString(),
              id: log.id || log._id
            }));
          setLogs(formattedLogs);
          setPagination(result.data.pagination);
        } else {
          throw new Error(result.message);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  }, [useFirebase]);

  // Subscribe to real-time updates (Firebase only)
  const subscribeToLogs = useCallback((callback) => {
    if (!useFirebase) return null;

    return firebaseService.subscribeToLogs((logsData, error) => {
      if (error) {
        setError(error.message);
        return;
      }
      setLogs(logsData);
      if (callback) callback(logsData);
    });
  }, [useFirebase]);

  // Create a new log
  const createLog = useCallback(async (logData) => {
    try {
      let result;
      if (useFirebase) {
        result = await firebaseService.addLog(logData);
      } else {
        result = await apiService.createLog(logData);
      }

      if (result.success) {
        // Refresh logs after creation
        await fetchLogs();
        return { success: true, data: result.data };
      } else {
        throw new Error(result.error || result.message);
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [useFirebase, fetchLogs]);

  // Delete a log
  const deleteLog = useCallback(async (logId) => {
    try {
      let result;
      if (useFirebase) {
        result = await firebaseService.deleteLog(logId);
      } else {
        result = await apiService.deleteLog(logId);
      }

      if (result.success) {
        // Refresh logs after deletion
        await fetchLogs();
        return { success: true };
      } else {
        throw new Error(result.error || result.message);
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [useFirebase, fetchLogs]);

  // Update pagination
  const updatePagination = useCallback((newPage, newLimit) => {
    setPagination(prev => ({
      ...prev,
      page: newPage,
      limit: newLimit
    }));
    fetchLogs({ page: newPage, limit: newLimit });
  }, [fetchLogs]);

  // Filter logs
  const filterLogs = useCallback((filters) => {
    fetchLogs({ ...filters, page: 1 }); // Reset to page 1 when filtering
  }, [fetchLogs]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize - fetch logs on mount
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    pagination,
    fetchLogs,
    subscribeToLogs,
    createLog,
    deleteLog,
    updatePagination,
    filterLogs,
    clearError
  };
};

// Hook for log statistics
export const useLogStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.getLogStats();
      if (result.success) {
        setStats(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};