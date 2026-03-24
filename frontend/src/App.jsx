import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Login from './pages/Login';
import Home from './pages/Home';
import Features from './pages/Features';
import Architecture from './pages/Architecture';
import ApiDocs from './pages/ApiDocs';
import Dashboard from './pages/Dashboard';
import Security from './pages/Security';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {isAuthenticated && <Navbar />}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
            
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/features" element={<ProtectedRoute><Features /></ProtectedRoute>} />
            <Route path="/architecture" element={<ProtectedRoute><Architecture /></ProtectedRoute>} />
            <Route path="/api-docs" element={<ProtectedRoute><ApiDocs /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
          </Routes>
        </main>
        {isAuthenticated && <Footer />}
      </div>
    </Router>
  );
}

export default App;
