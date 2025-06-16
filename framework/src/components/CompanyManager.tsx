import React, { useState, useEffect } from 'react';
import CrudTable from './CrudTable';
import { CompanyData } from '../interface/user/CompanyData';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../controller/feedback/Company';
import { useAdminGuard } from '../utils/AdminGuard';
import '../css/CategoryManager.css'; // Reusing the same styling
import Swal from 'sweetalert2';

const CompanyManager: React.FC = () => {
  const { isAuthorized, isLoading: authLoading } = useAdminGuard();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentCompany, setCurrentCompany] = useState<CompanyData | null>(null);
  const [formData, setFormData] = useState({
    nameCompany: '',
    emailCompany: '',
    cnpjCompany: ''
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isAuthorized) {
      fetchCompanies();
    }
  }, [isAuthorized]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await getCompanies();
      setCompanies(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching companies:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Falha ao carregar empresas. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
      setError('Failed to load companies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentCompany(null);
    setFormData({
      nameCompany: '',
      emailCompany: '',
      cnpjCompany: ''
    });
    // Reset validation errors
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (company: CompanyData) => {
    setCurrentCompany(company);
    setFormData({
      nameCompany: company.namecompany || '',
      emailCompany: company.emailcompany || '',
      cnpjCompany: company.cnpjcompany || ''
    });
    // Reset validation errors
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteCompany(id);
      if (success) {
        setCompanies(companies.filter(company => company.idcompany !== id));
        setError(null);
        Swal.fire({
          title: 'Sucesso!',
          text: 'Empresa excluída com sucesso!',
          icon: 'success',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Erro',
          text: 'Falha ao deletar empresa. Tente novamente.',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#1575C5'
        });
        setError('Failed to delete company. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Falha ao deletar empresa. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
      setError('Failed to delete company. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate field as user types
    validateField(name, value);
  };
  
  const validateField = (fieldName: string, value: string): boolean => {
    let error = '';
    
    switch (fieldName) {
      case 'nameCompany':
        if (!value.trim()) {
          error = 'O nome da empresa é obrigatório';
        } else if (value.length < 3) {
          error = 'O nome da empresa deve ter pelo menos 3 caracteres';
        } else if (value.length > 100) {
          error = 'O nome da empresa deve ter no máximo 100 caracteres';
        }
        break;
        
      case 'emailCompany':
        if (!value.trim()) {
          error = 'O email da empresa é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Por favor, insira um email válido';
        }
        break;
        
      case 'cnpjCompany':
        if (!value.trim()) {
          error = 'O CNPJ da empresa é obrigatório';
        } else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$|^\d{14}$/.test(value)) {
          error = 'CNPJ inválido. Formato esperado: 00.000.000/0000-00 ou 00000000000000';
        }
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    
    return !error;
  };
  
  const validateAllFields = (): boolean => {
    const nameValid = validateField('nameCompany', formData.nameCompany);
    const emailValid = validateField('emailCompany', formData.emailCompany);
    const cnpjValid = validateField('cnpjCompany', formData.cnpjCompany);
    
    return nameValid && emailValid && cnpjValid;
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
      const companyData = {
        namecompany: formData.nameCompany,
        emailcompany: formData.emailCompany,
        cnpjcompany: formData.cnpjCompany
      };
      
      if (currentCompany && currentCompany.idcompany) {
        // Update existing company
        const updatedCompany = await updateCompany(currentCompany.idcompany, companyData);
        if (updatedCompany) {
          setCompanies(companies.map(company => 
            company.idcompany === currentCompany.idcompany ? updatedCompany : company
          ));
          setIsModalOpen(false);
          setError(null);
          Swal.fire({
            title: 'Sucesso!',
            text: 'Empresa atualizada com sucesso!',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: 'Erro',
            text: 'Falha ao atualizar empresa. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#1575C5'
          });
          setError('Failed to update company. Please try again.');
        }
      } else {
        // Create new company
        const newCompany = await createCompany(companyData);
        if (newCompany) {
          setCompanies([...companies, newCompany]);
          setIsModalOpen(false);
          setError(null);
          Swal.fire({
            title: 'Sucesso!',
            text: 'Empresa criada com sucesso!',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: 'Erro',
            text: 'Falha ao criar empresa. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#1575C5'
          });
          setError('Failed to create company. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error saving company:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Falha ao salvar empresa. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
      setError('Failed to save company. Please try again.');
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'idcompany',
      width: '10%'
    },
    {
      header: 'Nome',
      accessor: 'namecompany',
      width: '30%'
    },
    {
      header: 'Email',
      accessor: 'emailcompany',
      width: '30%'
    },
    {
      header: 'CNPJ',
      accessor: 'cnpjcompany',
      width: '30%'
    }
  ];

  if (authLoading) {
    return <div className="loading">Checking permissions...</div>;
  }

  if (!isAuthorized) {
    return null; // Component will be redirected by the hook
  }

  return (
    <div className="category-manager">
      <CrudTable
        title="Gerenciamento de Empresas"
        data={companies}
        columns={columns}
        loading={loading}
        error={error}
        idField="idcompany"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchCompanies}
      />
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentCompany ? 'Editar Empresa' : 'Adicionar Nova Empresa'}</h3>
              <button 
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className='form-admin'>
              <div className="form-group">
                <label htmlFor="nameCompany">Nome da Empresa:</label>
                <input
                  type="text"
                  id="nameCompany"
                  name="nameCompany"
                  value={formData.nameCompany}
                  onChange={handleInputChange}
                  className={validationErrors.nameCompany ? 'is-invalid' : ''}
                />
                {validationErrors.nameCompany && (
                  <span className="validation-error">{validationErrors.nameCompany}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="emailCompany">Email:</label>
                <input
                  type="email"
                  id="emailCompany"
                  name="emailCompany"
                  value={formData.emailCompany}
                  onChange={handleInputChange}
                  className={validationErrors.emailCompany ? 'is-invalid' : ''}
                />
                {validationErrors.emailCompany && (
                  <span className="validation-error">{validationErrors.emailCompany}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="cnpjCompany">CNPJ:</label>
                <input
                  type="text"
                  id="cnpjCompany"
                  name="cnpjCompany"
                  value={formData.cnpjCompany}
                  onChange={handleInputChange}
                  className={validationErrors.cnpjCompany ? 'is-invalid' : ''}
                  placeholder="00.000.000/0000-00"
                />
                {validationErrors.cnpjCompany && (
                  <span className="validation-error">{validationErrors.cnpjCompany}</span>
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
                  {currentCompany ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManager;
