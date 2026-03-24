import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, ShieldAlert } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard Mock</NavLink>
        </div>

        <div className="navbar-actions desktop-only">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <NavLink to="/dashboard" className="btn btn-primary btn-sm">Get Started</NavLink>
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
          <NavLink to="/" onClick={toggleMobileMenu} className="nav-link">Home</NavLink>
          <NavLink to="/features" onClick={toggleMobileMenu} className="nav-link">Features</NavLink>
          <NavLink to="/architecture" onClick={toggleMobileMenu} className="nav-link">Architecture</NavLink>
          <NavLink to="/api-docs" onClick={toggleMobileMenu} className="nav-link">API Docs</NavLink>
          <NavLink to="/dashboard" onClick={toggleMobileMenu} className="nav-link">Dashboard</NavLink>
          <NavLink to="/security" onClick={toggleMobileMenu} className="nav-link">Security</NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
