import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { UserPlus, Trash2, Power, UserCheck, UserX } from 'lucide-react';
import Navbar from '../components/Navbar';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 'staff',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password || !formData.fullName || !formData.email) {
      setError('All fields are required');
      return;
    }

    try {
      await usersAPI.create(formData);
      alert('User added successfully!');
      setShowAddModal(false);
      setFormData({
        username: '',
        password: '',
        fullName: '',
        email: '',
        role: 'staff',
      });
      loadUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add user');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await usersAPI.toggleStatus(userId);
      loadUsers();
    } catch (error) {
      alert('Error toggling user status: ' + error.response?.data?.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await usersAPI.delete(userId);
      alert('User deleted successfully');
      loadUsers();
    } catch (error) {
      alert('Error deleting user: ' + error.response?.data?.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Admin Panel</h1>
            <p>Manage staff accounts and system users</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <UserPlus size={18} />
            Add New User
          </button>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="users-grid">
            {users.map((user) => (
              <div key={user._id} className={`user-card ${!user.isActive ? 'user-inactive' : ''}`}>
                <div className="user-card-header">
                  <div className="user-avatar">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h3>{user.fullName}</h3>
                    <p className="username">@{user.username}</p>
                  </div>
                  <div className={`role-badge role-${user.role}`}>
                    {user.role}
                  </div>
                </div>

                <div className="user-card-body">
                  <div className="user-detail">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{user.email}</span>
                  </div>
                  <div className="user-detail">
                    <span className="detail-label">Status:</span>
                    <span className={`status-indicator ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? <UserCheck size={16} /> : <UserX size={16} />}
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="user-detail">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="user-card-actions">
                  <button
                    className={`btn-icon ${user.isActive ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => handleToggleStatus(user._id)}
                    title={user.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <Power size={16} />
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleDeleteUser(user._id)}
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add New User</h2>
                <button className="close-btn" onClick={() => setShowAddModal(false)}>
                  ×
                </button>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleAddUser}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength="6"
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    className="form-control"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <UserPlus size={18} />
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanel;
