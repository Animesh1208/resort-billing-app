import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { billsAPI } from '../services/api';
import { DollarSign, FileText, TrendingUp, Calendar, Plus, Receipt } from 'lucide-react';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    monthRevenue: 0,
    lastMonthRevenue: 0,
    totalBills: 0,
    todayBills: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await billsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const calculateGrowth = () => {
    if (stats.lastMonthRevenue === 0) return 0;
    return (((stats.monthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your resort billing overview.</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/bills/new')}>
            <Plus size={18} />
            New Bill
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card gradient-blue">
            <div className="stat-icon">
              <DollarSign size={32} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Today's Revenue</p>
              <h2 className="stat-value">{formatCurrency(stats.todayRevenue)}</h2>
              <p className="stat-detail">{stats.todayBills} bills generated today</p>
            </div>
          </div>

          <div className="stat-card gradient-purple">
            <div className="stat-icon">
              <TrendingUp size={32} />
            </div>
            <div className="stat-content">
              <p className="stat-label">This Month</p>
              <h2 className="stat-value">{formatCurrency(stats.monthRevenue)}</h2>
              <p className="stat-detail">
                {calculateGrowth() > 0 ? '↑' : '↓'} {Math.abs(calculateGrowth())}% from last month
              </p>
            </div>
          </div>

          <div className="stat-card gradient-green">
            <div className="stat-icon">
              <FileText size={32} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Bills</p>
              <h2 className="stat-value">{stats.totalBills}</h2>
              <p className="stat-detail">All time records</p>
            </div>
          </div>

          <div className="stat-card gradient-orange">
            <div className="stat-icon">
              <Calendar size={32} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Last Month</p>
              <h2 className="stat-value">{formatCurrency(stats.lastMonthRevenue)}</h2>
              <p className="stat-detail">Previous period revenue</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-card" onClick={() => navigate('/bills/new')}>
              <Plus size={40} />
              <h3>Create New Bill</h3>
              <p>Generate a new customer bill</p>
            </button>

            <button className="action-card" onClick={() => navigate('/bills')}>
              <Receipt size={40} />
              <h3>View All Bills</h3>
              <p>Browse and search invoices</p>
            </button>

            <button className="action-card" onClick={() => navigate('/bills?status=pending')}>
              <FileText size={40} />
              <h3>Pending Bills</h3>
              <p>View unpaid invoices</p>
            </button>

            <button className="action-card" onClick={() => loadStats()}>
              <TrendingUp size={40} />
              <h3>Refresh Stats</h3>
              <p>Update dashboard data</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
