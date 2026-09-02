import React from 'react';

export default function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  iconBg = '#eff6ff', 
  iconColor = '#2563eb',
  subtext,
  status
}) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {subtext && (
          <span 
            className="stat-subtext" 
            style={{ 
              color: status === 'warning' ? 'var(--warning-text)' : 
                     status === 'danger' ? 'var(--danger-text)' : 
                     status === 'success' ? 'var(--success-text)' : 'var(--text-muted)' 
            }}
          >
            {subtext}
          </span>
        )}
      </div>

      {Icon && (
        <div 
          className="stat-icon-wrapper" 
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon size={22} strokeWidth={2.2} />
        </div>
      )}
    </div>
  );
}