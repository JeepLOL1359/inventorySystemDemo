import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="empty-state" style={{ padding: '80px 20px' }}>
      <div className="empty-state-icon">
        <Compass size={48} style={{ color: 'var(--text-muted)' }} />
      </div>
      <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
        404
      </h1>
      <div className="empty-state-title" style={{ fontSize: '18px', marginBottom: '8px' }}>
        Page Not Found
      </div>
      <p className="empty-state-desc">
        The requested page does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary btn-sm">
        <ArrowLeft size={15} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}