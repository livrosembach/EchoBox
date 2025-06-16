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

interface FormData {
  emailUser: string;
  passwordUser: string;
  fk_user_idCompany: string;
  confirmPassword: string;
}

interface ValidationErrors {
  emailUser: string;
  passwordUser: string;
  fk_user_idCompany: string;
  confirmPassword: string;
}

const UserManager: React.FC = () => {
  const { isAuthorized, isLoading } = useAdminGuard();
  const [users, setUsers] = useState<UserWithCompany[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserWithCompany | null>(null);
  const [formData, setFormData] = useState<FormData>({
    emailUser: '',
    passwordUser: '',
    fk_user_idCompany: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    emailUser: '',
    passwordUser: '',
    fk_user_idCompany: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0, // 0-4 scale
    hasLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
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
    setValidationErrors({
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
    setValidationErrors({
      emailUser: '',
      passwordUser: '',
      fk_user_idCompany: '',
      confirmPassword: ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: 'Confirmação',
        text: 'Tem certeza que deseja excluir este usuário?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) {
        return;
      }

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

  // Validate a single field
  const validateField = (name: string, value: string, allValues = formData): string => {
    switch (name) {
      case 'emailUser':
        if (!value.trim()) return 'O email é obrigatório';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Digite um email válido' : '';
      case 'passwordUser':
        // Password is required for new users, optional for existing users
        if (!currentUser && !value.trim()) return 'A senha é obrigatória para novos usuários';
        if (value.trim()) {
          // Password validation only if a value is provided
          // Password must be at least 8 characters
          if (value.length < 8) return 'A senha deve ter pelo menos 8 caracteres';
          
          // Password must contain one uppercase letter
          if (!/[A-Z]/.test(value)) return 'A senha deve conter pelo menos uma letra maiúscula';
          
          // Password must contain one lowercase letter
          if (!/[a-z]/.test(value)) return 'A senha deve conter pelo menos uma letra minúscula';
          
          // Password must contain one number
          if (!/[0-9]/.test(value)) return 'A senha deve conter pelo menos um número';
          
          // Password must contain one special character
          if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) 
            return 'A senha deve conter pelo menos um caractere especial (!@#$%^&*()_+-=[]{};\':"\\|,.<>/?)';
        }
        return '';
      case 'confirmPassword':
        // Only validate if password has a value
        if (allValues.passwordUser && !value.trim()) return 'Confirmação de senha obrigatória';
        if (allValues.passwordUser && value !== allValues.passwordUser) return 'As senhas não coincidem';
        return '';
      case 'fk_user_idCompany':
        // Company is not strictly required
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    // Validate the field and update errors
    const fieldError = validateField(name, value, newFormData);
    setValidationErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
    
    // If we're updating password, we need to re-validate confirmPassword
    if (name === 'passwordUser') {
      const confirmError = validateField('confirmPassword', formData.confirmPassword, newFormData);
      setValidationErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
      
      // Check password strength
      checkPasswordStrength(value);
    }
  };

  // Check password strength and update criteria state
  const checkPasswordStrength = (password: string) => {
    // Check criteria
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    // Calculate score (0-4)
    let score = 0;
    if (hasLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    
    // Adjust score based on password length
    if (password.length < 4) score = Math.min(score, 1);
    if (password.length < 6) score = Math.min(score, 2);
    
    setPasswordStrength({
      score: Math.min(Math.floor(score * 0.8), 4), // Scale to 0-4
      hasLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecial
    });
  };

  // Get password strength label
  const getPasswordStrengthText = () => {
    switch (passwordStrength.score) {
      case 0: return 'Muito fraca';
      case 1: return 'Fraca';
      case 2: return 'Média';
      case 3: return 'Forte';
      case 4: return 'Muito forte';
      default: return '';
    }
  };

  // Get password strength class
  const getPasswordStrengthClass = () => {
    switch (passwordStrength.score) {
      case 0: return 'strength-very-weak';
      case 1: return 'strength-weak';
      case 2: return 'strength-medium';
      case 3: return 'strength-strong';
      case 4: return 'strength-very-strong';
      default: return '';
    }
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const emailError = validateField('emailUser', formData.emailUser);
    const passwordError = validateField('passwordUser', formData.passwordUser);
    const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword, formData);
    const companyError = validateField('fk_user_idCompany', formData.fk_user_idCompany);
    
    setValidationErrors({
      emailUser: emailError,
      passwordUser: passwordError,
      confirmPassword: confirmPasswordError,
      fk_user_idCompany: companyError
    });
    
    return !(emailError || passwordError || confirmPasswordError || companyError);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateForm()) {
      Swal.fire({
        title: 'Formulário Incompleto',
        text: 'Por favor, corrija os erros no formulário antes de enviar.',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
      return;
    }
    
    setIsSubmitting(true);
    
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
          setIsSubmitting(false);
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
    } finally {
      setIsSubmitting(false);
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
                  className={validationErrors.emailUser ? 'input-error' : ''}
                />
                {validationErrors.emailUser && (
                  <div className="validation-error">{validationErrors.emailUser}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="passwordUser">
                  {currentUser ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha'}
                </label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="passwordUser"
                    name="passwordUser"
                    value={formData.passwordUser}
                    onChange={handleInputChange}
                    className={validationErrors.passwordUser ? 'input-error' : ''}
                  />
                  <button
                    type="button"
                    className="btn-toggle-password"
                    onClick={() => setShowPassword(prev => !prev)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                  </button>
                </div>
                {validationErrors.passwordUser && (
                  <div className="validation-error">{validationErrors.passwordUser}</div>
                )}
                
                {/* Password strength indicators */}
                {formData.passwordUser && (
                  <div className="password-strength-meter">
                    <div className={`strength-meter-fill ${getPasswordStrengthClass()}`}></div>
                  </div>
                )}
                {formData.passwordUser && (
                  <div className="password-strength-text">
                    Força da senha: <strong>{getPasswordStrengthText()}</strong>
                  </div>
                )}
                <div className="password-criteria">
                  <small>A senha deve conter:</small>
                  <ul>
                    <li className={passwordStrength.hasLength ? 'met' : ''}>
                      Pelo menos 8 caracteres
                    </li>
                    <li className={passwordStrength.hasUppercase ? 'met' : ''}>
                      Pelo menos uma letra maiúscula
                    </li>
                    <li className={passwordStrength.hasLowercase ? 'met' : ''}>
                      Pelo menos uma letra minúscula
                    </li>
                    <li className={passwordStrength.hasNumber ? 'met' : ''}>
                      Pelo menos um número
                    </li>
                    <li className={passwordStrength.hasSpecial ? 'met' : ''}>
                      Pelo menos um caractere especial
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Senha</label>
                <div className="password-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={validationErrors.confirmPassword ? 'input-error' : ''}
                  />
                  <button
                    type="button"
                    className="btn-toggle-password"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showConfirmPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <div className="validation-error">{validationErrors.confirmPassword}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="fk_user_idCompany">Empresa</label>
                <select
                  id="fk_user_idCompany"
                  name="fk_user_idCompany"
                  value={formData.fk_user_idCompany}
                  onChange={handleInputChange}
                  className={validationErrors.fk_user_idCompany ? 'input-error' : ''}
                >
                  <option value="">-- Selecione uma Empresa --</option>
                  {companies.map(company => (
                    <option key={company.idcompany} value={company.idcompany}>
                      {company.namecompany}
                    </option>
                  ))}
                </select>
                {validationErrors.fk_user_idCompany && (
                  <div className="validation-error">{validationErrors.fk_user_idCompany}</div>
                )}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (currentUser ? 'Atualizando...' : 'Criando...') 
                    : (currentUser ? 'Atualizar' : 'Criar')}
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
