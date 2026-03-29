import { useState, useEffect, useContext, createContext } from 'react';
import firebaseService from '../services/firebaseService';
import apiService from '../services/apiService';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [backendToken, setBackendToken] = useState(localStorage.getItem('backend_token'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Authenticate with backend using Firebase user info
  const authenticateWithBackend = async (firebaseUser) => {
    try {
      // Check if we already have a backend token
      const existingToken = localStorage.getItem('backend_token');
      if (existingToken) {
        // Verify token is still valid
        apiService.setAuthToken(existingToken);
        setBackendToken(existingToken);
        return;
      }

      // For demo purposes, we'll create a backend user or login
      // In production, you'd have a proper mapping between Firebase and backend users
      const loginResult = await apiService.post('/auth/login', {
        email: firebaseUser.email,
        password: 'demo123' // This should be handled properly in production
      });

      if (loginResult.success) {
        const token = loginResult.data.token;
        localStorage.setItem('backend_token', token);
        apiService.setAuthToken(token);
        setBackendToken(token);
      }
    } catch (error) {
      console.error('Backend authentication failed:', error);
      // For demo, create a user if login fails
      try {
        const registerResult = await apiService.post('/auth/register', {
          username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          password: 'demo123',
          role: 'admin' // For demo purposes
        });

        if (registerResult.success) {
          const token = registerResult.data.token;
          localStorage.setItem('backend_token', token);
          apiService.setAuthToken(token);
          setBackendToken(token);
        }
      } catch (registerError) {
        console.error('Backend registration failed:', registerError);
      }
    }
  };

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = firebaseService.onAuthStateChange((user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        // Try to authenticate with backend using Firebase user
        authenticateWithBackend(user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setBackendToken(null);
        localStorage.removeItem('backend_token');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const result = await firebaseService.signIn(email, password);
    return result;
  };

  const signUp = async (email, password, displayName = '') => {
    const result = await firebaseService.signUp(email, password, displayName);
    return result;
  };

  const signOut = async () => {
    const result = await firebaseService.signOutUser();
    localStorage.removeItem('backend_token');
    setBackendToken(null);
    apiService.setAuthToken(null);
    return result;
  };

  const updateProfile = async (updates) => {
    const result = await firebaseService.updateUserProfile(updates);
    return result;
  };

  const updatePassword = async (newPassword) => {
    const result = await firebaseService.updateUserPassword(newPassword);
    return result;
  };

  const value = {
    user,
    backendToken,
    isAuthenticated,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};