import React from 'react';
import { Database, Server, User, Key, ArrowRight, Shield } from 'lucide-react';
import './Architecture.css';

const Architecture = () => {
  return (
    <div className="architecture-page animate-fade-in pb-12">
      <header className="page-header text-center bg-secondary">
        <div className="container">
          <h1 className="page-title">System Architecture</h1>
          <p className="page-subtitle">Understand the secure, scalable flow of data in the AuditLog Platform.</p>
        </div>
      </header>

      <div className="container mt-8">
        
        {/* Visual Architecture Diagram (CSS-based) */}
        <div className="architecture-diagram text-center mb-12">
          <h2>Data Flow Overview</h2>
          <div className="flow-container">
            <div className="flow-node">
              <User size={40} className="node-icon" />
              <span>User Application</span>
            </div>
            <ArrowRight size={32} className="flow-arrow" />
            
            <div className="flow-group">
              <div className="flow-node">
                <Server size={40} className="node-icon" />
                <span>API Gateway</span>
              </div>
              <ArrowRight size={32} className="flow-arrow" />
              <div className="flow-node highlight">
                <Shield size={40} className="node-icon" />
                <span>Audit Middleware</span>
              </div>
              <ArrowRight size={32} className="flow-arrow" />
              <div className="flow-node">
                <Key size={40} className="node-icon" />
                <span>JWT Validation</span>
              </div>
            </div>

            <ArrowRight size={32} className="flow-arrow" />
            <div className="flow-node database">
              <Database size={40} className="node-icon" />
              <span>MongoDB</span>
            </div>
          </div>
        </div>

        <hr className="divider" />

        <div className="stack-details mt-8">
          <h2>Our Technology Stack</h2>
          <div className="stack-grid">
            <div className="stack-item">
              <h3>Node.js & Express.js</h3>
              <p>
                The core backend is built on the lightning-fast V8 JavaScript engine. Express.js provides a robust set of features 
                for web and mobile applications, ensuring our logging API is highly responsive.
              </p>
            </div>
            <div className="stack-item">
              <h3>MongoDB & Mongoose</h3>
              <p>
                A NoSQL document structure is perfectly suited for semi-structured log data. Mongoose provides a rigorous 
                modeling environment to ensure data consistency and enforce required fields.
              </p>
            </div>
            <div className="stack-item">
              <h3>JSON Web Tokens (JWT)</h3>
              <p>
                Stateless, secure authentication. JWTs are used to verify the identity of the incoming service or user, 
                extracting the <code>actorId</code> securely without hitting a database on every request.
              </p>
            </div>
            <div className="stack-item">
              <h3>React.js</h3>
              <p>
                A component-based frontend framework providing this very dashboard. It offers reactive data binding, 
                fast updates via the virtual DOM, and an exceptional developer experience.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Architecture;
