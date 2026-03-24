import React from 'react';
import { ShieldAlert, Key, UserCheck, Lock } from 'lucide-react';
import './Security.css';

const Security = () => {
  return (
    <div className="security-page animate-fade-in pb-12">
      <header className="page-header text-center bg-secondary">
        <div className="container">
          <h1 className="page-title">Enterprise Security First</h1>
          <p className="page-subtitle">Your audit logs are sensitive. We treat them that way.</p>
        </div>
      </header>

      <div className="container mt-8">
        
        <div className="security-intro text-center">
          <ShieldAlert size={64} className="intro-icon" />
          <h2>Uncompromising Data Protection</h2>
          <p className="max-w-3xl mx-auto">
            The AuditLog platform employs defense-in-depth strategies. From the moment an event is ingested 
            to when it is queried on the dashboard, data is encrypted, authenticated, and access-controlled.
          </p>
        </div>

        <div className="security-grid mt-8">
          
          <div className="security-card">
            <Key size={32} className="card-icon" />
            <h3>JWT Authentication</h3>
            <p>
              Every API request requires a signed JSON Web Token. The JWT payload is verified against your 
              public keys, ensuring that the identity of the caller cannot be spoofed. Tokens expire rapidly 
              and can be revoked instantly.
            </p>
          </div>

          <div className="security-card">
            <UserCheck size={32} className="card-icon" />
            <h3>Role-Based Access Control</h3>
            <p>
              Not all developers need access to security logs. RBAC is built-in. By default, only users with 
              the <code>ADMIN</code> or <code>AUDITOR</code> roles can view the dashboard or query the GET endpoints. 
              Service accounts are restricted to write-only permissions.
            </p>
          </div>

          <div className="security-card">
            <Lock size={32} className="card-icon" />
            <h3>Immutable Records</h3>
            <p>
              Log tampering is impossible through the API. The system exposes no update or delete endpoints 
              for log entries. At the database layer, append-only policies are enforced, making your audit trail 
              impervious to ex-post-facto modification.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Security;
