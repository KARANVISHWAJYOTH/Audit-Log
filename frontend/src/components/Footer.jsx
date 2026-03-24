import React from 'react';
import { NavLink } from 'react-router-dom';
import { Code, Globe, Mail, ShieldAlert } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <ShieldAlert className="logo-icon" size={24} />
            <span>AuditLog Platform</span>
          </div>
          <p className="footer-desc">
            Track every action. Ensure complete transparency and secure logging across your enterprise.
          </p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noreferrer"><Code size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><Globe size={20} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><Mail size={20} /></a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Product</h4>
          <NavLink to="/features">Features</NavLink>
          <NavLink to="/architecture">Architecture</NavLink>
          <NavLink to="/security">Security</NavLink>
        </div>

        <div className="footer-links-group">
          <h4>Resources</h4>
          <NavLink to="/api-docs">API Documentation</NavLink>
          <NavLink to="/guides">Guides</NavLink>
          <a href="#">Support</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} AuditLog Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
