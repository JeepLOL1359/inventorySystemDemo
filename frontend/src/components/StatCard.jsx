import React from 'react';

export default function StatCard({ label, value, icon, color, trend }) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '30px', 
      borderRadius: '8px', 
      textAlign: 'center',
      borderLeft: `5px solid ${color}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.15)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }}
    >
      <div style={{ fontSize: '40px', marginBottom: '15px' }}>
        {icon}
      </div>
      
      <p style={{ 
        margin: '0 0 10px 0', 
        color: '#666', 
        fontSize: '12px', 
        textTransform: 'uppercase',
        fontWeight: 'bold',
        letterSpacing: '1px'
      }}>
        {label}
      </p>
      
      <p style={{ 
        margin: 0, 
        fontSize: '32px', 
        fontWeight: 'bold', 
        color
      }}>
        {value}
      </p>

      {trend && (
        <p style={{ 
          margin: '10px 0 0 0', 
          fontSize: '12px', 
          color: trend.startsWith('+') ? '#27ae60' : '#e74c3c'
        }}>
          {trend}
        </p>
      )}
    </div>
  );
}