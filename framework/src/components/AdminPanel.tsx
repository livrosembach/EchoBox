import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminGuard } from '../utils/AdminGuard';
import '../css/AdminPanel.css';

const AdminPanel: React.FC = () => {
  const { isAuthorized, isLoading } = useAdminGuard();

  if (isLoading) {
    return <div className="loading">Checking permissions...</div>;
  }

  if (!isAuthorized) {
    return null; // Component will be redirected by the hook
  }

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Admin Dashboard</h1>
      
      <div className="admin-cards">
        <div className="admin-card">
          <i className="fa-solid fa-tags admin-icon"></i>
          <h2>Categories</h2>
          <p>Manage feedback categories and their colors</p>
          <Link to="/admin/categories" className="admin-button">
            Manage Categories
          </Link>
        </div>
        
        <div className="admin-card">
          <i className="fa-solid fa-spinner admin-icon"></i>
          <h2>Statuses</h2>
          <p>Manage feedback status types and their colors</p>
          <Link to="/admin/statuses" className="admin-button">
            Manage Statuses
          </Link>
        </div>
        
        <div className="admin-card">
          <i className="fa-solid fa-building admin-icon"></i>
          <h2>Companies</h2>
          <p>Manage company accounts and information</p>
          <Link to="/admin/companies" className="admin-button">
            Manage Companies
          </Link>
        </div>
        
        <div className="admin-card">
          <i className="fa-solid fa-users admin-icon"></i>
          <h2>Users</h2>
          <p>Manage user accounts and permissions</p>
          <Link to="/admin/users" className="admin-button">
            Manage Users
          </Link>
        </div>
        
        <div className="admin-card">
          <i className="fa-solid fa-comment admin-icon"></i>
          <h2>Feedbacks</h2>
          <p>View and manage all feedback submissions</p>
          <Link to="/admin/feedbacks" className="admin-button">
            Manage Feedbacks
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
