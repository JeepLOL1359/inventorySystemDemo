import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Package, LayoutDashboard, Boxes, Plus } from 'lucide-react';

export default function Navbar({ userName = 'Admin' }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Package size={18} />
          </div>
          <span>InventoryHub</span>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-menu">
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink 
            to="/items" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Boxes size={16} />
            <span>Items</span>
          </NavLink>
        </nav>

        {/* Action & User Info */}
        <div className="nav-actions">
          <Link to="/add" className="btn btn-emerald btn-sm">
            <Plus size={15} />
            <span>Add Item</span>
          </Link>

          <div className="user-badge">
            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span>{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}