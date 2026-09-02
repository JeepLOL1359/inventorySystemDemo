import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Boxes, DollarSign, AlertTriangle, ArrowRight, CheckCircle2, Plus } from 'lucide-react';
import StatCard from '../components/StatCard';
import { getStats, getAllItems } from '../services/inventoryService';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setError(null);
      const [statsData, itemsData] = await Promise.all([
        getStats(),
        getAllItems()
      ]);
      setStats(statsData);
      setItems(itemsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Unable to load dashboard data. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 12000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>Loading inventory metrics...</p>
      </div>
    );
  }

  const lowStockItems = items.filter(item => item.quantity < 10);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Real-time inventory metrics and stock health overview</p>
        </div>
        <Link to="/add" className="btn btn-emerald btn-sm">
          <Plus size={15} />
          <span>Add New Product</span>
        </Link>
      </div>

      {error && (
        <div className="alert-error">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats Strip */}
      {stats && (
        <div className="stats-grid">
          <StatCard 
            label="Total Products" 
            value={stats.total_products} 
            icon={Package} 
            iconBg="#eff6ff"
            iconColor="#2563eb"
            subtext="Active SKUs"
          />
          <StatCard 
            label="Total Units" 
            value={stats.total_items.toLocaleString()} 
            icon={Boxes} 
            iconBg="#ecfdf5"
            iconColor="#059669"
            subtext="In warehouse"
          />
          <StatCard 
            label="Inventory Value" 
            value={`$${stats.total_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
            icon={DollarSign} 
            iconBg="#fffbeb"
            iconColor="#d97706"
            subtext={`Avg $${(stats.total_value / (stats.total_products || 1)).toFixed(2)} / SKU`}
          />
          <StatCard 
            label="Low Stock Alerts" 
            value={stats.low_stock_count} 
            icon={AlertTriangle} 
            iconBg={stats.low_stock_count > 0 ? '#fef2f2' : '#f0fdf4'}
            iconColor={stats.low_stock_count > 0 ? '#dc2626' : '#16a34a'}
            subtext={stats.low_stock_count > 0 ? 'Restock recommended' : 'Stock levels optimal'}
            status={stats.low_stock_count > 0 ? 'danger' : 'success'}
          />
        </div>
      )}

      {/* Actionable Stock Alerts / Quick Overview Panel */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <AlertTriangle size={17} style={{ color: lowStockItems.length > 0 ? 'var(--warning-text)' : 'var(--success)' }} />
            <span>{lowStockItems.length > 0 ? 'Items Requiring Restock' : 'Stock Health Status'}</span>
          </div>
          <Link to="/items" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span>View All Items</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {lowStockItems.length > 0 ? (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Current Qty</th>
                  <th style={{ textAlign: 'right' }}>Unit Price</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td>
                      <span className="badge badge-category">{item.category}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: item.quantity === 0 ? 'var(--danger-text)' : 'var(--warning-text)' }}>
                      {item.quantity} units
                    </td>
                    <td style={{ textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${item.quantity === 0 ? 'badge-danger' : 'badge-warning'}`}>
                        {item.quantity === 0 ? 'Out of Stock' : 'Low Stock (<10)'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <CheckCircle2 size={36} style={{ color: 'var(--success)' }} />
            </div>
            <div className="empty-state-title">All stock levels are healthy</div>
            <div className="empty-state-desc">
              There are currently no items under 10 units. Every product has adequate inventory.
            </div>
            <Link to="/items" className="btn btn-secondary btn-sm">
              Manage Inventory
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}