import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { Sun, Moon, Menu, X, ShieldAlert, LogOut, User } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ user }) => {
  const { theme, toggleTheme } = useTheme();
  const { backendUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <NavLink to="/" className="navbar-logo">
          <ShieldAlert className="logo-icon" size={28} />
          <span>AuditLog</span>
        </NavLink>

        <div className="navbar-links desktop-only">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          <NavLink to="/features" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Features</NavLink>
          <NavLink to="/architecture" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Architecture</NavLink>
          <NavLink to="/api-docs" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>API Docs</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
        </div>

        <div className="navbar-actions desktop-only">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* User Info and Sign Out */}
          <div className="user-menu">
            <div className="user-info">
              <User size={16} />
              <span className="user-email">{user?.email}</span>
            </div>
            <button className="btn btn-outline btn-sm" onClick={handleSignOut}>
              <LogOut size={16} style={{marginRight: '4px'}} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="mobile-toggle mobile-only">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="menu-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-user-info">
            <User size={16} />
            <span>{user?.email}</span>
          </div>
          <NavLink to="/" onClick={toggleMobileMenu} className="nav-link">Home</NavLink>
          <NavLink to="/features" onClick={toggleMobileMenu} className="nav-link">Features</NavLink>
          <NavLink to="/architecture" onClick={toggleMobileMenu} className="nav-link">Architecture</NavLink>
          <NavLink to="/api-docs" onClick={toggleMobileMenu} className="nav-link">API Docs</NavLink>
          <NavLink to="/dashboard" onClick={toggleMobileMenu} className="nav-link">Dashboard</NavLink>
          <NavLink to="/security" onClick={toggleMobileMenu} className="nav-link">Security</NavLink>
          <button className="nav-link sign-out-btn" onClick={handleSignOut}>
            <LogOut size={16} style={{marginRight: '8px'}} />
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
