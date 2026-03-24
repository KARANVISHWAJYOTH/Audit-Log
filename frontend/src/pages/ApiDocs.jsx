import React from 'react';
import './ApiDocs.css';

const ApiDocs = () => {
  return (
    <div className="api-docs-page animate-fade-in pb-12">
      <header className="page-header text-center bg-secondary">
        <div className="container">
          <h1 className="page-title">API Documentation</h1>
          <p className="page-subtitle">Integrate the AuditLog tracker into your services effortlessly.</p>
        </div>
      </header>

      <div className="container mt-8">
        <div className="doc-content">

          {/* Intro */}
          <section className="endpoint-group">
            <h2>Authentication</h2>
            <p>
              All API requests require a valid JWT token via the <code>Authorization: Bearer &lt;token&gt;</code> header.
              Ensure you obtain the Admin or System token before dispatching logs.
            </p>
          </section>

          {/* POST /logs */}
          <section className="endpoint-group">
            <div className="endpoint-header">
              <span className="method method-post">POST</span>
              <span className="path">/api/v1/logs</span>
            </div>
            <h3>Create a new audit log</h3>
            <p>Dispatches a non-blocking request to store a new interaction event.</p>
            
            <div className="code-block">
              <div className="code-header">Example Request Body</div>
              <pre><code>
&#123;<br/>
&nbsp;&nbsp;<span className="code-string">"userId"</span>: <span className="code-string">"usr_9abc123"</span>,<br/>
&nbsp;&nbsp;<span className="code-string">"action"</span>: <span className="code-string">"DELETE_ORDER"</span>,<br/>
&nbsp;&nbsp;<span className="code-string">"entity"</span>: <span className="code-string">"Order"</span>,<br/>
&nbsp;&nbsp;<span className="code-string">"entityId"</span>: <span className="code-string">"ORD1001"</span>,<br/>
&nbsp;&nbsp;<span className="code-string">"timestamp"</span>: <span className="code-string">"2026-02-13T10:30:00Z"</span>,<br/>
&nbsp;&nbsp;<span className="code-string">"ipAddress"</span>: <span className="code-string">"192.168.1.1"</span>,<br/>
&nbsp;&nbsp;<span className="code-string">"metadata"</span>: &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-string">"reason"</span>: <span className="code-string">"Customer Request"</span><br/>
&nbsp;&nbsp;&#125;<br/>
&#125;
              </code></pre>
            </div>

            <div className="code-block mt-4">
              <div className="code-header">Example Response (201 Created)</div>
              <pre><code>
&#123;<br/>
&nbsp;&nbsp;<span className="code-string">"success"</span>: <span className="code-keyword">true</span>,<br/>
&nbsp;&nbsp;<span className="code-string">"logId"</span>: <span className="code-string">"log_445f1b"</span><br/>
&#125;
              </code></pre>
            </div>
          </section>

          {/* GET /logs */}
          <section className="endpoint-group">
            <div className="endpoint-header mt-8">
              <span className="method method-get">GET</span>
              <span className="path">/api/v1/logs</span>
            </div>
            <h3>Retrieve audit logs</h3>
            <p>Fetches a paginated list of audit logs. Administrator role is required.</p>
            
            <h4>Query Parameters:</h4>
            <ul className="query-params">
              <li><code>userId</code> - Filter by user ID.</li>
              <li><code>action</code> - Filter by action string.</li>
              <li><code>limit</code> - Number of results to return (default 20).</li>
              <li><code>page</code> - Pagination cursor/page number.</li>
            </ul>

            <div className="code-block mt-4">
              <div className="code-header">Example Request</div>
              <pre><code><span className="code-function">GET</span> /api/v1/logs?action=DELETE_ORDER&amp;limit=10</code></pre>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
