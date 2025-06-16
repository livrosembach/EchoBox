import React, { useState, useEffect } from 'react';
import CrudTable from './CrudTable';
import { FeedbackData } from '../interface/feedback/FeedbackData';
import { CategoryData } from '../interface/feedback/CategoryData';
import { StatusData } from '../interface/feedback/StatusData';
import { UserData } from '../interface/user/UserData';
import { CompanyData } from '../interface/user/CompanyData';
import { getFeedbacks, getFeedbackById, createFeedback, updateFeedback, deleteFeedback } from '../controller/feedback/Feedback';
import { getCategory } from '../controller/feedback/Category';
import { getStatus } from '../controller/feedback/Status';
import { getUsers } from '../controller/user/User';
import { getCompanies } from '../controller/feedback/Company';
import { getCurrentUser } from '../utils/Auth';
import { useAdminGuard } from '../utils/AdminGuard';
import '../css/CategoryManager.css'; // Reusing base styling
import '../css/FeedbackManager.css'; // Custom styling for feedback manager
import Swal from 'sweetalert2';
import * as Validation from '../utils/FormValidation';
import { validateForm, required, minLength, maxLength, getFirstErrorByField, ValidationRule } from '../utils/FormValidation';

interface FeedbackFormData {
  titleFeedback: string;
  reviewFeedback: string;
  fk_feedback_idUser: string;
  fk_feedback_idCompany: string;
  fk_feedback_idCategory: string;
  fk_feedback_idStatus: string;
}

const FeedbackManager: React.FC = () => {
  const { isAuthorized, isLoading: authLoading } = useAdminGuard();
  const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [statuses, setStatuses] = useState<StatusData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentFeedback, setCurrentFeedback] = useState<FeedbackData | null>(null);
  const [formData, setFormData] = useState<FeedbackFormData>({
    titleFeedback: '',
    reviewFeedback: '',
    fk_feedback_idUser: '',
    fk_feedback_idCompany: '',
    fk_feedback_idCategory: '',
    fk_feedback_idStatus: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthorized) {
      fetchFeedbacks();
      fetchCategories();
      fetchStatuses();
      fetchUsers();
      fetchCompanies();
    }
  }, [isAuthorized]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await getFeedbacks();
      setFeedbacks(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Falha ao carregar feedbacks. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
      setError('Failed to load feedbacks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategory();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const data = await getStatus();
      setStatuses(data);
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleAdd = async () => {
    // Get current logged-in user
    const currentUser = getCurrentUser();
    
    setCurrentFeedback(null);
    setFormData({
      titleFeedback: '',
      reviewFeedback: '',
      fk_feedback_idUser: currentUser ? currentUser.id : '',
      fk_feedback_idCompany: currentUser ? currentUser.companyId || '' : '',
      fk_feedback_idCategory: '',
      fk_feedback_idStatus: ''
    });
    
    // Reset validation errors
    setValidationErrors({});
    
    // Only refresh user and company data when adding new feedback
    await Promise.all([
      fetchUsers(),
      fetchCompanies(),
      fetchCategories(),
      fetchStatuses()
    ]);
    
    setIsModalOpen(true);
  };

  const handleEdit = (feedback: FeedbackData) => {
    // Find the full feedback object from API to get foreign keys
    getFeedbackById(feedback.idfeedback)
      .then(data => {
        if (data) {
          setCurrentFeedback(feedback);
          setFormData({
            titleFeedback: data.titlefeedback || '',
            reviewFeedback: data.reviewfeedback || '',
            fk_feedback_idUser: data.fk_feedback_iduser ? data.fk_feedback_iduser.toString() : '',
            fk_feedback_idCompany: data.fk_feedback_idcompany ? data.fk_feedback_idcompany.toString() : '',
            fk_feedback_idCategory: data.fk_feedback_idcategory ? data.fk_feedback_idcategory.toString() : '',
            fk_feedback_idStatus: data.fk_feedback_idstatus ? data.fk_feedback_idstatus.toString() : ''
          });
          
          // Reset validation errors
          setValidationErrors({});

          // Only refresh categories and statuses for editing (user/company are readonly)
          Promise.all([
            fetchCategories(),
            fetchStatuses(),
            fetchUsers(), // Still needed for displaying readonly user info
            fetchCompanies() // Still needed for displaying readonly company info
          ]).then(() => {
            setIsModalOpen(true);
          });
        } else {
          Swal.fire({
            title: 'Erro',
            text: 'Falha ao carregar detalhes do feedback para edição.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#1575C5'
          });
          setError("Failed to load feedback details for editing");
        }
      })
      .catch(err => {
        console.error("Error fetching feedback details:", err);
        Swal.fire({
          title: 'Erro',
          text: 'Falha ao carregar detalhes do feedback para edição.',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#1575C5'
        });
        setError("Failed to load feedback details for editing");
      });
  };

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteFeedback(id);
      if (success) {
        setFeedbacks(feedbacks.filter(feedback => feedback.idfeedback !== id));
        setError(null);
        Swal.fire({
          title: 'Sucesso!',
          text: 'Feedback excluído com sucesso!',
          icon: 'success',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Erro',
          text: 'Falha ao excluir feedback. Tente novamente.',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#1575C5'
        });
        setError('Failed to delete feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Falha ao excluir feedback. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
      setError('Failed to delete feedback. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate field as user types
    validateField(name, value);
  };
  
  const validateField = (name: string, value: string): boolean => {
    const fieldValidations: Record<string, ValidationRule[]> = {
      titleFeedback: [
        required('O título do feedback é obrigatório'),
        minLength(5, 'O título deve ter pelo menos 5 caracteres'),
        maxLength(100, 'O título deve ter no máximo 100 caracteres')
      ],
      reviewFeedback: [
        required('A descrição do feedback é obrigatória'),
        minLength(10, 'A descrição deve ter pelo menos 10 caracteres'),
        maxLength(500, 'A descrição deve ter no máximo 500 caracteres')
      ],
      fk_feedback_idCategory: [
        required('A categoria é obrigatória')
      ],
      fk_feedback_idStatus: [
        required('O status é obrigatório')
      ],
      fk_feedback_idUser: [
        required('O usuário é obrigatório')
      ],
      fk_feedback_idCompany: [
        required('A empresa é obrigatória')
      ]
    };
    
    // Only validate the specified field
    const fieldRules = fieldValidations[name];
    if (!fieldRules) return true;
    
    const validation = validateForm(
      { [name]: value },
      { [name]: fieldRules }
    );
    
    const error = getFirstErrorByField(validation, name);
    
    setValidationErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
    
    return !error;
  };
  
  const validateAllFields = (): boolean => {
    const titleValid = validateField('titleFeedback', formData.titleFeedback);
    const reviewValid = validateField('reviewFeedback', formData.reviewFeedback);
    const categoryValid = validateField('fk_feedback_idCategory', formData.fk_feedback_idCategory);
    const statusValid = validateField('fk_feedback_idStatus', formData.fk_feedback_idStatus);
    
    // Only validate user and company when creating new feedback
    let userValid = true;
    let companyValid = true;
    
    if (!currentFeedback) {
      userValid = validateField('fk_feedback_idUser', formData.fk_feedback_idUser);
      companyValid = validateField('fk_feedback_idCompany', formData.fk_feedback_idCompany);
    }
    
    return titleValid && reviewValid && categoryValid && statusValid && userValid && companyValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateAllFields()) {
      Swal.fire({
        title: 'Formulário Inválido',
        text: 'Por favor, corrija os erros no formulário antes de enviar.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
      return;
    }
    
    try {
      if (currentFeedback) {
        // Update existing feedback - only send editable fields
        const feedbackData = {
          titleFeedback: formData.titleFeedback,
          reviewFeedback: formData.reviewFeedback,
          fk_feedback_idCategory: parseInt(formData.fk_feedback_idCategory),
          fk_feedback_idStatus: parseInt(formData.fk_feedback_idStatus)
        };
        
        const updatedFeedback = await updateFeedback(currentFeedback.idfeedback, feedbackData);
        if (updatedFeedback) {
          // Refresh the data after successful update
          fetchFeedbacks();
          setIsModalOpen(false);
          setError(null);
          Swal.fire({
            title: 'Sucesso!',
            text: 'Feedback atualizado com sucesso!',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: 'Erro',
            text: 'Falha ao atualizar feedback. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#1575C5'
          });
          setError('Failed to update feedback. Please try again.');
        }
      } else {
        // Create new feedback - include all fields
        const feedbackData = {
          titleFeedback: formData.titleFeedback,
          reviewFeedback: formData.reviewFeedback,
          fk_feedback_idUser: parseInt(formData.fk_feedback_idUser),
          fk_feedback_idCompany: parseInt(formData.fk_feedback_idCompany),
          fk_feedback_idCategory: parseInt(formData.fk_feedback_idCategory),
          fk_feedback_idStatus: parseInt(formData.fk_feedback_idStatus)
        };
        
        const newFeedback = await createFeedback(feedbackData);
        if (newFeedback) {
          // Refresh the data after successful creation
          fetchFeedbacks();
          setIsModalOpen(false);
          setError(null);
          Swal.fire({
            title: 'Sucesso!',
            text: 'Feedback criado com sucesso!',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: 'Erro',
            text: 'Falha ao criar feedback. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#1575C5'
          });
          setError('Failed to create feedback. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Falha ao salvar feedback. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
      setError('Failed to save feedback. Please try again.');
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'idfeedback',
      width: '10%',
      hideOnMobile: true
    },
    {
      header: 'Título',
      accessor: 'titlefeedback',
      width: '20%'
    },
    {
      header: 'Categoria',
      accessor: 'typecategory',
      width: '15%',
      cell: (value: string, row: FeedbackData) => (
        <span 
          className="tag" 
          style={{ backgroundColor: row.colorcategory || '#CCCCCC' }}
        >
          {value}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'typestatus',
      width: '15%',
      cell: (value: string, row: FeedbackData) => (
        <span 
          className="tag" 
          style={{ backgroundColor: row.colorstatus || '#007bff' }}
        >
          {value}
        </span>
      )
    },
    {
      header: 'Conteúdo',
      accessor: 'reviewfeedback',
      width: '40%',
      cell: (value: string) => (
        <div className="truncate-text">{value}</div>
      ),
      hideOnSmallMobile: true
    }
  ];

  if (authLoading) {
    return <div className="loading">Checando permissões...</div>;
  }

  if (!isAuthorized) {
    return null; // Component will be redirected by the hook
  }

  return (
    <div className="category-manager">
      <CrudTable
        title="Gerenciamento de Feedback"
        data={feedbacks}
        columns={columns}
        loading={loading}
        error={error}
        idField="idfeedback"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchFeedbacks}
      />
      
      {isModalOpen && (
        <div className="modal-overlay feedback-form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentFeedback ? 'Editar Feedback' : 'Adicionar Feedback'}</h3>
              <button 
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="responsive-form form-admin">
              <div className="form-group">
                <label htmlFor="titleFeedback">Título:</label>
                <input
                  type="text"
                  id="titleFeedback"
                  name="titleFeedback"
                  value={formData.titleFeedback}
                  onChange={handleInputChange}
                  className={validationErrors.titleFeedback ? 'is-invalid' : ''}
                />
                {validationErrors.titleFeedback && (
                  <span className="validation-error">{validationErrors.titleFeedback}</span>
                )}
              </div>

              {/* Only show user and company selection when creating new feedback */}
              {!currentFeedback && (
                <>
                  <div className="form-group">
                    <label htmlFor="fk_feedback_idUser">Usuário:</label>
                    <select
                      id="fk_feedback_idUser"
                      name="fk_feedback_idUser"
                      value={formData.fk_feedback_idUser}
                      onChange={handleInputChange}
                      className={validationErrors.fk_feedback_idUser ? 'is-invalid' : ''}
                    >
                      <option value="">Escolha um usuário</option>
                      {users.map(user => (
                        <option key={user.idUser} value={user.idUser}>
                          {user.emailUser}
                        </option>
                      ))}
                    </select>
                    {validationErrors.fk_feedback_idUser && (
                      <span className="validation-error">{validationErrors.fk_feedback_idUser}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="fk_feedback_idCompany">Empresa:</label>
                    <select
                      id="fk_feedback_idCompany"
                      name="fk_feedback_idCompany"
                      value={formData.fk_feedback_idCompany}
                      onChange={handleInputChange}
                      className={validationErrors.fk_feedback_idCompany ? 'is-invalid' : ''}
                    >
                      <option value="">Escolha uma empresa</option>
                      {companies.map(company => (
                        <option key={company.idcompany} value={company.idcompany}>
                          {company.namecompany}
                        </option>
                      ))}
                    </select>
                    {validationErrors.fk_feedback_idCompany && (
                      <span className="validation-error">{validationErrors.fk_feedback_idCompany}</span>
                    )}
                  </div>
                </>
              )}

              {/* Show read-only user and company info when editing */}
              {currentFeedback && (
                <>
                  <div className="form-group">
                    <label>Usuário:</label>
                    <div className="readonly-field">
                      {users.find(u => u.idUser?.toString() === formData.fk_feedback_idUser)?.emailUser || 'Loading...'}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Empresa:</label>
                    <div className="readonly-field">
                      {companies.find(c => c.idcompany?.toString() === formData.fk_feedback_idCompany)?.namecompany || 'Loading...'}
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="fk_feedback_idCategory">Categoria:</label>
                <select
                  id="fk_feedback_idCategory"
                  name="fk_feedback_idCategory"
                  value={formData.fk_feedback_idCategory}
                  onChange={handleInputChange}
                  className={validationErrors.fk_feedback_idCategory ? 'is-invalid' : ''}
                >
                  <option value="">Escolha uma categoria</option>
                  {categories.map(category => (
                    <option key={category.idcategory} value={category.idcategory}>
                      {category.typecategory}
                    </option>
                  ))}
                </select>
                {validationErrors.fk_feedback_idCategory && (
                  <span className="validation-error">{validationErrors.fk_feedback_idCategory}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="fk_feedback_idStatus">Status:</label>
                <select
                  id="fk_feedback_idStatus"
                  name="fk_feedback_idStatus"
                  value={formData.fk_feedback_idStatus}
                  onChange={handleInputChange}
                  className={validationErrors.fk_feedback_idStatus ? 'is-invalid' : ''}
                >
                  <option value="">Escolha um status</option>
                  {statuses.map(status => (
                    <option key={status.idstatus} value={status.idstatus}>
                      {status.typestatus}
                    </option>
                  ))}
                </select>
                {validationErrors.fk_feedback_idStatus && (
                  <span className="validation-error">{validationErrors.fk_feedback_idStatus}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="reviewFeedback">Comentário:</label>
                <textarea
                  id="reviewFeedback"
                  name="reviewFeedback"
                  value={formData.reviewFeedback}
                  onChange={handleInputChange}
                  rows={5}
                  className={validationErrors.reviewFeedback ? 'is-invalid' : ''}
                />
                {validationErrors.reviewFeedback && (
                  <span className="validation-error">{validationErrors.reviewFeedback}</span>
                )}
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
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
                  {currentFeedback ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManager;
