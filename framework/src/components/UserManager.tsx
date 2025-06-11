import React, { useState, useEffect } from 'react';
import CrudTable from './CrudTable';
import { UserData } from '../interface/user/UserData';
import { CompanyData } from '../interface/user/CompanyData';
import '../css/CategoryManager.css'; // Reusing the same styling

interface UserWithCompany extends UserData {
  companyname?: string;
}

const UserManager: React.FC = () => {
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
    fetchUsers();
    fetchCompanies();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3003/user');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      // Transform the data to match our interface
      const transformedData = data.map((user: any) => ({
        idUser: user.iduser,
        emailUser: user.emailuser,
        companyname: user.namecompany,
        fk_user_idCompany: user.fk_user_idcompany
      }));
      setUsers(transformedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://localhost:3003/company');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
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
      const response = await fetch(`http://localhost:3003/user/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Update local state after successful deletion
      setUsers(users.filter(user => user.idUser !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
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
      setError('Passwords do not match');
      return;
    }
    
    try {
      // Prepare data for API
      const userData = {
        emailUser: formData.emailUser,
        passwordUser: formData.passwordUser,
        fk_user_idCompany: formData.fk_user_idCompany ? parseInt(formData.fk_user_idCompany) : null
      };
      
      if (currentUser) {
        // Update existing user
        // Only include password if it was provided (not empty)
        const updateData = formData.passwordUser ? 
          userData : 
          { emailUser: userData.emailUser, fk_user_idCompany: userData.fk_user_idCompany };
        
        const response = await fetch(`http://localhost:3003/user/${currentUser.idUser}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const updatedUser = await response.json();
        
        // Find company name for the updated user
        const company = companies.find(c => c.idcompany === parseInt(formData.fk_user_idCompany));
        
        // Update local state
        setUsers(users.map(user => 
          user.idUser === currentUser.idUser ? 
          { 
            ...updatedUser,
            companyname: company?.namecompany
          } : user
        ));
      } else {
        // Create new user - password is required for new users
        if (!formData.passwordUser) {
          setError('Password is required for new users');
          return;
        }
        
        const response = await fetch('http://localhost:3003/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const newUser = await response.json();
        
        // Find company name for the new user
        const company = companies.find(c => c.idcompany === parseInt(formData.fk_user_idCompany));
        
        // Add to local state
        setUsers([...users, { 
          ...newUser, 
          companyname: company?.namecompany
        }]);
      }
      
      // Close modal after successful operation
      setIsModalOpen(false);
      setError(null);
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Failed to save user. Please try again.');
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'idUser',
      width: '80px'
    },
    {
      header: 'Email',
      accessor: 'emailUser'
    },
    {
      header: 'Company',
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
        title="User Management"
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
              <h3>{currentUser ? 'Edit User' : 'Add New User'}</h3>
              <button 
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
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
                  {currentUser ? 'New Password (leave blank to keep current)' : 'Password'}
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
                <label htmlFor="confirmPassword">Confirm Password</label>
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
                <label htmlFor="fk_user_idCompany">Company</label>
                <select
                  id="fk_user_idCompany"
                  name="fk_user_idCompany"
                  value={formData.fk_user_idCompany}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Company --</option>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button"
                >
                  {currentUser ? 'Update' : 'Create'}
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
