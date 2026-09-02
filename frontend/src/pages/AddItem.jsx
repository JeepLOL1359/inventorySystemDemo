import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, AlertCircle } from 'lucide-react';
import { createItem, getCategories } from '../services/inventoryService';

export default function AddItem() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    category: '',
  });
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats || []);
      if (cats && cats.length > 0) {
        setFormData(prev => ({ ...prev, category: cats[0] }));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : 
              name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCategorySelectChange = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setIsCustomCategory(false);
      setFormData(prev => ({ ...prev, category: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const targetCategory = isCustomCategory ? customCategory.trim() : formData.category.trim();

    if (!formData.name.trim()) {
      setError('Product name is required.');
      return;
    }

    if (!targetCategory) {
      setError('Please select or specify a category.');
      return;
    }

    if (formData.quantity < 0) {
      setError('Quantity cannot be negative.');
      return;
    }

    if (formData.price < 0) {
      setError('Price cannot be negative.');
      return;
    }

    setLoading(true);
    try {
      await createItem({
        ...formData,
        name: formData.name.trim(),
        category: targetCategory,
      });

      navigate('/items');
    } catch (err) {
      console.error('Error creating item:', err);
      setError(err.message || 'Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <div>
          <Link 
            to="/items" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '13px', 
              color: 'var(--text-secondary)', 
              fontWeight: 500,
              marginBottom: '8px'
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Inventory</span>
          </Link>
          <h1 className="page-title">Add New Product</h1>
          <p className="page-subtitle">Enter item specifications to register it in inventory</p>
        </div>
      </div>

      {error && (
        <div className="alert-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit} className="card-body">
          {/* Item Name */}
          <div className="form-group">
            <label className="form-label">
              Product Name <span className="req">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Ergonomic Office Chair"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">
              Category <span className="req">*</span>
            </label>
            {!isCustomCategory ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategorySelectChange}
                  className="form-select"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="__custom__">+ Add Custom Category...</option>
                </select>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter new category name..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="form-input"
                  autoFocus
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setIsCustomCategory(false);
                    if (categories.length > 0) {
                      setFormData(prev => ({ ...prev, category: categories[0] }));
                    }
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Quantity and Price Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Initial Quantity</label>
              <input
                type="number"
                name="quantity"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit Price ($)</label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Description (Optional)</label>
            <textarea
              name="description"
              placeholder="Model number, specifications, or location notes..."
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="form-textarea"
            />
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <Link to="/items" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-emerald"
            >
              {loading ? (
                <span>Registering...</span>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>Register Item</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}