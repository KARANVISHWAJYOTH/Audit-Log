import React from 'react';
import { Database, Filter, Layers, Lock, Activity, ServerCog } from 'lucide-react';
import './Features.css';

const Features = () => {
  return (
    <div className="features-page animate-fade-in pb-12">
      <header className="page-header text-center bg-secondary">
        <div className="container">
          <h1 className="page-title">Platform Features</h1>
          <p className="page-subtitle">Deep dive into the architecture and capabilities of AuditLog.</p>
        </div>
      </header>

      <div className="container mt-8">
        <div className="feature-detail-grid">
          
          <div className="feature-detail-card">
            <div className="feature-header">
              <Activity className="icon" size={32} />
              <h2>Log Creation API</h2>
            </div>
            <p>
              A high-throughput, non-blocking ingestion API to accept log events from all microservices. 
              Designed to handle thousands of requests per second without impacting your main application's performance.
            </p>
          </div>

          <div className="feature-detail-card">
            <div className="feature-header">
              <Filter className="icon" size={32} />
              <h2>Advanced Filtering System</h2>
            </div>
            <p>
              Instantly find the logs you need. Filter by exact matches on <code>userId</code>, <code>action</code>, or <code>entityId</code>. 
              Support for date range queries means you can isolate incidents within specific timeframes.
            </p>
          </div>

          <div className="feature-detail-card">
            <div className="feature-header">
              <Layers className="icon" size={32} />
              <h2>Pagination & Indexing</h2>
            </div>
            <p>
              Our database schema is optimized with compound indices. Even as your audit log grows into the millions, 
              cursor-based and offset pagination ensure that dashboard load times remain under 100ms.
            </p>
          </div>

          <div className="feature-detail-card">
            <div className="feature-header">
              <Lock className="icon" size={32} />
              <h2>Authentication & RBAC</h2>
            </div>
            <p>
              Security is paramount. All access to the AuditLog platform is protected via JWT. 
              Role-Based Access Control guarantees that only authorized administrators and compliance officers can view sensitive data.
            </p>
          </div>

          <div className="feature-detail-card">
            <div className="feature-header">
              <ServerCog className="icon" size={32} />
              <h2>Middleware Tracking</h2>
            </div>
            <p>
              We provide drop-in Express.js middleware. It automatically intercepts requests, extracts the user identity, 
              IP address, and action intent, formatting it into a normalized log structure before asynchronous dispatch.
            </p>
          </div>

          <div className="feature-detail-card">
            <div className="feature-header">
              <Database className="icon" size={32} />
              <h2>Immutable Storage</h2>
            </div>
            <p>
              Storage layers are configured for append-only operations. Modification or deletion of past logs is strictly prohibited 
              at the database level, ensuring true compliance with regulatory standards.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Features;
