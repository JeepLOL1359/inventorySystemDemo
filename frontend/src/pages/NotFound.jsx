import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '48px', margin: '0 0 10px 0' }}>404</h1>
      <p style={{ fontSize: '20px', color: '#666', marginBottom: '30px' }}>Page not found</p>
      <Link to="/" style={{ color: '#3498db', textDecoration: 'none', fontSize: '16px' }}>
        ← Back to Dashboard
      </Link>
    </div>
  );
}