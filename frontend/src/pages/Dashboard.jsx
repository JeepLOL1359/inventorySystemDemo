import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';

const API_URL = 'http://127.0.0.1:8000';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Refresh stats every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#666' }}>
        <p style={{ fontSize: '18px' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>Dashboard</h2>
        <p style={{ margin: 0, color: '#666' }}>Real-time inventory overview</p>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <StatCard 
            label="Total Products" 
            value={stats.total_products} 
            icon="📊" 
            color="#3498db"
          />
          <StatCard 
            label="Total Items" 
            value={stats.total_items.toLocaleString()} 
            icon="📦" 
            color="#27ae60"
          />
          <StatCard 
            label="Inventory Value" 
            value={`$${stats.total_value.toLocaleString()}`} 
            icon="💰" 
            color="#f39c12"
          />
          <StatCard 
            label="Low Stock Items" 
            value={stats.low_stock_count} 
            icon="⚠️" 
            color="#e74c3c"
          />
        </div>
      )}

      {/* Quick Stats Section */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '8px', 
        marginTop: '40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0' }}>📈 Quick Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Average Item Price</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              ${(stats.total_value / stats.total_products || 0).toFixed(2)}
            </p>
          </div>
          <div>
            <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Avg Items per Product</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              {(stats.total_items / stats.total_products || 0).toFixed(1)}
            </p>
          </div>
          <div>
            <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Stock Status</p>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: stats.low_stock_count > 0 ? '#e74c3c' : '#27ae60' }}>
              {stats.low_stock_count > 0 ? '⚠️ Review needed' : '✅ Healthy'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}