import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load pages for code splitting
const Login = React.lazy(() => import('./pages/Login'));
const Home = React.lazy(() => import('./pages/Home'));
const Features = React.lazy(() => import('./pages/Features'));
const Architecture = React.lazy(() => import('./pages/Architecture'));
const ApiDocs = React.lazy(() => import('./pages/ApiDocs'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Security = React.lazy(() => import('./pages/Security'));

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.email !== 'admin@auditlog.com') {
    return (
      <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>This page requires Admin access.</p>
        <button className="btn btn-primary mt-4" onClick={() => window.location.href = '/'}>Go Home</button>
      </div>
    );
  }

  return children;
};

// App Content Component (needs to be inside AuthProvider)
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Initializing...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navbar />}
        <main className="main-content">
          <Suspense fallback={
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading page...</p>
            </div>
          }>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/features" element={<ProtectedRoute><Features /></ProtectedRoute>} />
              <Route path="/architecture" element={<ProtectedRoute><Architecture /></ProtectedRoute>} />
              <Route path="/api-docs" element={<ProtectedRoute><ApiDocs /></ProtectedRoute>} />
              <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
            </Routes>
          </Suspense>
        </main>
        {isAuthenticated && <Footer />}
      </div>
    </Router>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
