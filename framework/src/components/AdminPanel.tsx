import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminGuard } from '../utils/AdminGuard';
import '../css/AdminPanel.css';

const AdminPanel: React.FC = () => {
  const { isAuthorized, isLoading } = useAdminGuard();

  if (isLoading) {
    return <div className="loading">Verificando permissões...</div>;
  }

  if (!isAuthorized) {
    return null; // Component will be redirected by the hook
  }

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Painel Administrativo</h1>
      
      <div className="admin-cards">
        <div className="admin-card">
          <i className="fa-solid fa-tags admin-icon"></i>
          <h2>Categorias</h2>
          <p>Gerencie categorias de feedback e suas cores</p>
          <Link to="/admin/categories" className="admin-button">
            Gerenciar Categorias
          </Link>
        </div>
        
        <div className="admin-card">
          <i className="fa-solid fa-spinner admin-icon"></i>
          <h2>Status</h2>
          <p>Gerencie tipos de status de feedback e suas cores</p>
          <Link to="/admin/statuses" className="admin-button">
            Gerenciar Status
          </Link>
        </div>
        
        <div className="admin-card">
          <i className="fa-solid fa-building admin-icon"></i>
          <h2>Empresas</h2>
          <p>Gerencie contas de empresas e informações</p>
          <Link to="/admin/companies" className="admin-button">
            Gerenciar Empresas
          </Link>
        </div>
        
        <div className="admin-card">
          <i className="fa-solid fa-users admin-icon"></i>
          <h2>Usuários</h2>
          <p>Gerencie contas de usuários e permissões</p>
          <Link to="/admin/users" className="admin-button">
            Gerenciar Usuários
          </Link>
        </div>
        
        <div className="admin-card">
          <i className="fa-solid fa-comment admin-icon"></i>
          <h2>Feedbacks</h2>
          <p>Visualize e gerencie todas as submissões de feedback</p>
          <Link to="/admin/feedbacks" className="admin-button">
            Gerenciar Feedbacks
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
