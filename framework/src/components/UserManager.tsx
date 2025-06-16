import React, { useState, useEffect } from 'react';
import CrudTable from './CrudTable';
import { UserData } from '../interface/user/UserData';
import { CompanyData } from '../interface/user/CompanyData';
import { getUsers, createUser, updateUser, deleteUser } from '../controller/user/User';
import { getCompanies } from '../controller/feedback/Company';
import { useAdminGuard } from '../utils/AdminGuard';
import UserAvatar from './UserAvatar';
import '../css/CategoryManager.css'; // Reusing the same styling
import Swal from 'sweetalert2';

interface UserWithCompany extends UserData {
  companyname?: string;
}

const UserManager: React.FC = () => {
  const { isAuthorized, isLoading } = useAdminGuard();
  const [users, setUsers] = useState<UserWithCompany[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserWithCompany | null>(null);
  const [formData, setFormData] = useState({
    emailUser: '',
    passwordUser: '',
    fk_user_idCompany: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (isAuthorized) {
      fetchUsers();
      fetchCompanies();
    }
  }, [isAuthorized]);

  if (isLoading) {
    return <div className="loading">Verificando permissões...</div>;
  }

  if (!isAuthorized) {
    return null; // Component will be redirected by the hook
  }

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      // The data now comes properly formatted from the controller
      const transformedData = data.map((user: any) => ({
        idUser: user.idUser,
        emailUser: user.emailUser,
        passwordUser: user.passwordUser || '', // Already handled in controller
        companyname: user.nameCompany,
        fk_user_idCompany: user.fk_user_idCompany
      }));
      setUsers(transformedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Falha ao carregar usuários. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      // We don't set the error state here because it would override any user fetching errors
    }
  };

  const handleAdd = () => {
    setCurrentUser(null);
    setFormData({
      emailUser: '',
      passwordUser: '',
      fk_user_idCompany: '',
      confirmPassword: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user: UserWithCompany) => {
    setCurrentUser(user);
    setFormData({
      emailUser: user.emailUser || '',
      passwordUser: '', // Don't populate password for security reasons
      fk_user_idCompany: user.fk_user_idCompany?.toString() || '',
      confirmPassword: ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteUser(id);
      if (success) {
        // Refresh the user list from server
        await fetchUsers();
        setError(null);
        Swal.fire({
          title: 'Sucesso!',
          text: 'Usuário excluído com sucesso!',
          icon: 'success',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Erro',
          text: 'Falha ao deletar usuário. Tente novamente.',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#1575C5'
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Falha ao deletar usuário. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match for new users or when changing password
    if (formData.passwordUser && formData.passwordUser !== formData.confirmPassword) {
      Swal.fire({
        title: 'Erro de Validação',
        text: 'As senhas não coincidem',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
      return;
    }
    
    try {
      // Prepare data for API
      const userData = {
        emailUser: formData.emailUser,
        passwordUser: formData.passwordUser,
        fk_user_idCompany: formData.fk_user_idCompany ? parseInt(formData.fk_user_idCompany) : undefined
      };
      
      if (currentUser) {
        // Update existing user
        // Only include password if it was provided (not empty)
        const updateData = formData.passwordUser ? 
          userData : 
          { emailUser: userData.emailUser, fk_user_idCompany: userData.fk_user_idCompany };
        
        const updatedUser = await updateUser(currentUser.idUser!, updateData);
        
        if (updatedUser) {
          // Refresh the user list from server to get updated data
          await fetchUsers();
          setIsModalOpen(false);
          setError(null);
          Swal.fire({
            title: 'Sucesso!',
            text: 'Usuário atualizado com sucesso!',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: 'Erro',
            text: 'Falha ao atualizar usuário. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#1575C5'
          });
        }
      } else {
        // Create new user - password is required for new users
        if (!formData.passwordUser) {
          Swal.fire({
            title: 'Erro de Validação',
            text: 'Senha é obrigatória para novos usuários',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#1575C5'
          });
          return;
        }
        
        const newUser = await createUser(userData);
        
        if (newUser) {
          // Refresh the user list from server to get updated data
          await fetchUsers();
          setIsModalOpen(false);
          setError(null);
          Swal.fire({
            title: 'Sucesso!',
            text: 'Usuário criado com sucesso!',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: 'Erro',
            text: 'Falha ao criar usuário. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#1575C5'
          });
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Falha ao salvar usuário. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'idUser',
      width: '80px'
    },
    {
      header: 'Usuário',
      accessor: 'emailUser',
      cell: (value: string, row: UserWithCompany) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserAvatar 
            pictureUrl={row.pictureUser} 
            email={row.emailUser} 
            size="sm" 
          />
          <span>{value}</span>
        </div>
      )
    },
    {
      header: 'Empresa',
      accessor: 'companyname',
      cell: (value: string, row: UserWithCompany) => {
        const company = companies.find(c => c.idcompany === row.fk_user_idCompany);
        return company?.namecompany || value || '-';
      }
    }
  ];

  return (
    <div className="category-manager">
      <CrudTable
        title="Gerenciamento de Usuários"
        data={users}
        columns={columns}
        loading={loading}
        error={error}
        idField="idUser"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchUsers}
      />
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h3>
              <button 
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className='form-admin'>
              <div className="form-group">
                <label htmlFor="emailUser">Email</label>
                <input
                  type="email"
                  id="emailUser"
                  name="emailUser"
                  value={formData.emailUser}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="passwordUser">
                  {currentUser ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha'}
                </label>
                <input
                  type="password"
                  id="passwordUser"
                  name="passwordUser"
                  value={formData.passwordUser}
                  onChange={handleInputChange}
                  required={!currentUser} // Only required for new users
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Senha</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!!formData.passwordUser} // Required if password field has a value
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fk_user_idCompany">Empresa</label>
                <select
                  id="fk_user_idCompany"
                  name="fk_user_idCompany"
                  value={formData.fk_user_idCompany}
                  onChange={handleInputChange}
                >
                  <option value="">-- Selecione uma Empresa --</option>
                  {companies.map(company => (
                    <option key={company.idcompany} value={company.idcompany}>
                      {company.namecompany}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="save-button"
                >
                  {currentUser ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
