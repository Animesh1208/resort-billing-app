import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, Users, TrendingUp } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="Gulmohar Resort" className="navbar-logo" />
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            <Home size={18} />
            <span>Dashboard</span>
          </Link>

          <Link to="/bills" className="nav-link">
            <FileText size={18} />
            <span>Bills</span>
          </Link>

          <Link to="/monthly-summary" className="nav-link">
            <TrendingUp size={18} />
            <span>Monthly Summary</span>
          </Link>

          <Link to="/admin" className="nav-link">
            <Users size={18} />
            <span>Admin Panel</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
