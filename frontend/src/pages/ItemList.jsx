import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Trash2, Minus, AlertCircle, PackageX } from 'lucide-react';
import { getAllItems, getCategories, deleteItem, adjustQuantity } from '../services/inventoryService';

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [adjustingId, setAdjustingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError('');
      const [itemsData, categoriesData] = await Promise.all([
        getAllItems(),
        getCategories()
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory. Please ensure backend server is active.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustQuantity = async (itemId, change, currentQty) => {
    if (currentQty + change < 0) return;
    setAdjustingId(itemId);
    try {
      const updatedItem = await adjustQuantity(itemId, change);
      setItems(prev => prev.map(item => item.id === itemId ? updatedItem : item));
    } catch (err) {
      console.error('Error adjusting quantity:', err);
      alert('Could not update quantity: ' + err.message);
    } finally {
      setAdjustingId(null);
    }
  };

  const handleDeleteItem = async (itemId, itemName) => {
    if (!window.confirm(`Are you sure you want to delete "${itemName}"?`)) return;
    try {
      await deleteItem(itemId);
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item: ' + err.message);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>Loading inventory items...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Items</h1>
          <p className="page-subtitle">Manage products, adjust stock levels, and organize categories</p>
        </div>
        <Link to="/add" className="btn btn-emerald btn-sm">
          <Plus size={15} />
          <span>Add New Product</span>
        </Link>
      </div>

      {error && (
        <div className="alert-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Unified Table Card */}
      <div className="card">
        {/* Integrated Toolbar */}
        <div className="table-toolbar">
          <div className="toolbar-search">
            <Search size={15} className="toolbar-search-icon" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="toolbar-input"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="toolbar-select"
            >
              <option value="">All Categories ({categories.length})</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Showing {filteredItems.length} of {items.length} items
            </span>
          </div>
        </div>

        {/* Data Table */}
        {filteredItems.length > 0 ? (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'center' }}>Stock Level</th>
                  <th style={{ textAlign: 'right' }}>Unit Price</th>
                  <th style={{ textAlign: 'right' }}>Total Value</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center', width: '70px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => {
                  const isLow = item.quantity < 10;
                  const isOut = item.quantity === 0;

                  return (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                        {item.description && (
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-category">{item.category}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="qty-stepper">
                          <button
                            className="stepper-btn"
                            title="Decrease quantity"
                            disabled={item.quantity <= 0 || adjustingId === item.id}
                            onClick={() => handleAdjustQuantity(item.id, -1, item.quantity)}
                          >
                            <Minus size={13} />
                          </button>
                          <span className="stepper-val">{item.quantity}</span>
                          <button
                            className="stepper-btn"
                            title="Increase quantity"
                            disabled={adjustingId === item.id}
                            onClick={() => handleAdjustQuantity(item.id, 1, item.quantity)}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 500 }}>
                        ${item.price.toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${isOut ? 'badge-danger' : isLow ? 'badge-warning' : 'badge-success'}`}>
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn-icon-danger"
                          title={`Delete ${item.name}`}
                          onClick={() => handleDeleteItem(item.id, item.name)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <PackageX size={36} />
            </div>
            <div className="empty-state-title">No items found</div>
            <div className="empty-state-desc">
              {searchQuery || selectedCategory
                ? 'Try adjusting your search query or category filter.'
                : 'Your inventory is currently empty. Get started by adding a product.'}
            </div>
            {(searchQuery || selectedCategory) && (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}