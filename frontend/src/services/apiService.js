// API service for backend communication
// This uses VITE_API_URL from environment variables
// In production, VITE_API_URL must be explicitly set to the deployed backend URL

const getApiBaseUrl = () => {
  // Priority 1: Explicit VITE_API_URL from environment
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Priority 2: For development, use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }

  // Priority 3: Production without VITE_API_URL - throw error
  throw new Error(
    'VITE_API_URL is not configured. In production, you must set VITE_API_URL environment variable to your backend URL (e.g., https://your-backend.onrender.com/api)'
  );
};

let API_BASE_URL;
try {
  API_BASE_URL = getApiBaseUrl();
  console.log('✅ API Base URL configured:', API_BASE_URL);
} catch (error) {
  console.error('❌', error.message);
  API_BASE_URL = 'http://localhost:5000/api'; // Fallback for development
}

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.authToken = null;
  }

  // Set authentication token
  setAuthToken(token) {
    this.authToken = token;
  }

  // Generic request method with improved error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.authToken) {
      config.headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, config);

      // Handle different response statuses
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Response is not JSON, use status message
          errorMessage = response.statusText || errorMessage;
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Success'
      };
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);

      // Return error in consistent format
      return {
        success: false,
        message: error.message || 'Failed to fetch from API',
        error: error.message,
        status: error.status
      };
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Logs API methods
  async getLogs(params = {}) {
    return this.get('/logs', params);
  }

  async getLogStats() {
    return this.get('/logs/stats');
  }

  async createLog(logData) {
    return this.post('/logs', logData);
  }

  async getLogById(id) {
    return this.get(`/logs/${id}`);
  }

  async deleteLog(id) {
    return this.delete(`/logs/${id}`);
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;