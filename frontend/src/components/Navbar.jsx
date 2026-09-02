import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Package, Plus, LogOut } from 'lucide-react';

export default function Navbar({ userName = 'Admin' }) {
  return (
    <nav style={{ backgroundColor: '#2c3e50', color: 'white', padding: '15px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h1 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Package size={28} /> Inventory System
          </h1>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link 
            to="/" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.parentElement.style.backgroundColor = '#34495e'}
            onMouseOut={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}
          >
            <Home size={18} /> Dashboard
          </Link>

          <Link 
            to="/items" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.parentElement.style.backgroundColor = '#34495e'}
            onMouseOut={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}
          >
            <Package size={18} /> Items
          </Link>

          <Link 
            to="/add" 
            style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '4px',
              backgroundColor: '#27ae60',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#229954'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
          >
            <Plus size={18} /> Add Item
          </Link>

          {/* User Info */}
          <div style={{ 
            borderLeft: '1px solid #34495e', 
            paddingLeft: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: '#bdc3c7'
          }}>
            <span style={{ fontSize: '14px' }}>👤</span>
            <span style={{ fontSize: '15px', fontWeight: '500' }}>{userName}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}