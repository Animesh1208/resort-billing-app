import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, FileText, Users, LogOut, TrendingUp } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

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

          {isAdmin() && (
            <Link to="/admin" className="nav-link">
              <Users size={18} />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <div className="user-name">{user?.fullName}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
