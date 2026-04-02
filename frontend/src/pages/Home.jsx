import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, Database, Search, FastForward, Lock, Users, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="container">
          <div className="hero-badge">v2.0 is now live</div>
          <h1 className="hero-title">
            Track Every Action.<br/>
            <span className="text-gradient">Ensure Complete Transparency.</span>
          </h1>
          <p className="hero-subtitle">
            A powerful backend audit log system to monitor, store, and analyze system activities securely. Built for modern developer teams.
          </p>
          <div className="hero-actions">
            <NavLink to="/dashboard" className="btn btn-primary btn-lg">
              Get Started <ArrowRight size={18} />
            </NavLink>
            <NavLink to="/api-docs" className="btn btn-outline btn-lg">
              View Documentation
            </NavLink>
          </div>

        </div>
      </section>

      {/* Features Grid Section */}
      <section className="features-section bg-secondary">
        <div className="container">
          <h2 className="section-title text-center">Core Features</h2>
          <p className="section-subtitle text-center">Everything you need for compliance and tracking.</p>
          
          <div className="grid grid-3 mt-6">
            <div className="feature-card">
              <div className="icon-wrapper"><ShieldCheck size={28} /></div>
              <h3>Audit Log Creation</h3>
              <p>Track all actions seamlessly with our robust middleware and API layer.</p>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper"><Database size={28} /></div>
              <h3>Secure Storage</h3>
              <p>Built-in MongoDB integration ensures your logs are stored safely and persistently.</p>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper"><Search size={28} /></div>
              <h3>Advanced Filtering</h3>
              <p>Query by user, specific actions, entity types, or date ranges with ease.</p>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper"><FastForward size={28} /></div>
              <h3>Pagination & Speed</h3>
              <p>Optimized indexing means fast queries even with millions of log entries.</p>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper"><Lock size={28} /></div>
              <h3>JWT Authentication</h3>
              <p>Secure endpoints ensuring only authorized personnel read your audit trails.</p>
            </div>
            <div className="feature-card">
              <div className="icon-wrapper"><Users size={28} /></div>
              <h3>Role-Based Access</h3>
              <p>Fine-grained control over who can create, view, or export the audit data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2>Why use AuditLog?</h2>
              <ul className="benefits-list">
                <li>
                  <div className="bullet-icon"></div>
                  <div>
                    <h4>Easy Debugging</h4>
                    <p>Quickly identify who changed what and when, accelerating resolution for support tickets.</p>
                  </div>
                </li>
                <li>
                  <div className="bullet-icon"></div>
                  <div>
                    <h4>Security Monitoring</h4>
                    <p>Detect abnormal patterns or rapid mutations that could indicate a breach or misuse.</p>
                  </div>
                </li>
                <li>
                  <div className="bullet-icon"></div>
                  <div>
                    <h4>Compliance Readiness</h4>
                    <p>Meet SOC2, HIPAA, and GDPR requirements with unalterable historical records.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="benefits-visual">
              <div className="dashboard-mock">
                 <div className="mock-header"></div>
                 <div className="mock-row"></div>
                 <div className="mock-row"></div>
                 <div className="mock-row"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works-section bg-secondary text-center">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container mt-6">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Trigger</h4>
              <p>User action triggers an API request</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Validate</h4>
              <p>Middleware authenticates via JWT</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Store</h4>
              <p>Log is securely saved in MongoDB</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>Retrieve</h4>
              <p>Admin retrieves logs with filters</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section text-center">
         <div className="container">
            <h2>Ready to secure your application?</h2>
            <p>Implement the AuditLog platform in minutes.</p>
            <NavLink to="/api-docs" className="btn btn-primary btn-lg mt-4">Read Docs</NavLink>
         </div>
      </section>
      {/* Test Actions Section */}
      <section className="test-actions-section bg-secondary text-center" style={{ padding: '60px 0', borderTop: '1px solid var(--border-color)' }}>
         <div className="container">
            <h2>Simulate User Actions</h2>
            <p>Click these buttons to generate test audit logs! (These will immediately appear in the Admin Dashboard)</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
              <button 
                className="btn btn-outline" 
                onClick={async () => {
                  try {
                    const apiService = (await import('../services/apiService')).default;
                    const { auth } = await import('../firebase/config');
                    const user = auth.currentUser;
                    await apiService.post('/logs', {
                      userId: user ? user.uid : 'anonymous',
                      action: 'CREATE_ORDER',
                      entity: 'Order',
                      entityId: `ORD-${Math.floor(Math.random() * 10000)}`,
                      details: { amount: Math.floor(Math.random() * 100) + 50 }
                    });
                    alert('Order Action Logged successfully! Check the Admin Dashboard.');
                  } catch (e) {
                    alert('Error logging action. Please ensure you are logged in.');
                  }
                }}
              >
                Simulate: Create Order
              </button>
              <button 
                className="btn btn-primary" 
                onClick={async () => {
                  try {
                    const apiService = (await import('../services/apiService')).default;
                    const { auth } = await import('../firebase/config');
                    const user = auth.currentUser;
                    await apiService.post('/logs', {
                      userId: user ? user.uid : 'anonymous',
                      action: 'DELETE_USER',
                      entity: 'User',
                      entityId: `usr_${Math.floor(Math.random() * 1000)}`,
                      details: { reason: 'User requested deletion' }
                    });
                    alert('Delete Action Logged successfully! Check the Admin Dashboard.');
                  } catch (e) {
                    alert('Error logging action. Please ensure you are logged in.');
                  }
                }}
              >
                Simulate: Delete User
              </button>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;
