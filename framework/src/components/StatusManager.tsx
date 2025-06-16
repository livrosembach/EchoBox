import React, { useState, useEffect } from 'react';
import CrudTable from './CrudTable';
import { StatusData } from '../interface/feedback/StatusData';
import { getStatus, createStatus, updateStatus, deleteStatus } from '../controller/feedback/Status';
import { useAdminGuard } from '../utils/AdminGuard';
import '../css/CategoryManager.css'; // Reusing the same styling
import Swal from 'sweetalert2';
import * as Validation from '../utils/FormValidation';

const StatusManager: React.FC = () => {
  const { isAuthorized, isLoading } = useAdminGuard();
  const [statuses, setStatuses] = useState<StatusData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<StatusData | null>(null);
  const [formData, setFormData] = useState({
    typeStatus: '',
    colorStatus: '#CCCCCC'
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isAuthorized) {
      fetchStatuses();
    }
  }, [isAuthorized]);

  if (isLoading) {
    return <div className="loading">Checando permissões...</div>;
  }

  if (!isAuthorized) {
    return null; // Component will be redirected by the hook
  }

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const data = await getStatus();
      setStatuses(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching statuses:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Falha ao carregar status. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
      setError('Failed to load statuses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentStatus(null);
    setFormData({
      typeStatus: '',
      colorStatus: '#CCCCCC'
    });
    // Reset validation errors when opening the form
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (status: StatusData) => {
    setCurrentStatus(status);
    setFormData({
      typeStatus: status.typestatus,
      colorStatus: status.colorstatus || '#CCCCCC'
    });
    // Reset validation errors when opening the form
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteStatus(id);
      if (success) {
        setStatuses(statuses.filter(status => status.idstatus !== id));
        setError(null);
        Swal.fire({
          title: 'Sucesso!',
          text: 'Status excluído com sucesso!',
          icon: 'success',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Erro',
          text: 'Falha ao deletar status. Ele pode estar em uso por feedbacks existentes.',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#1575C5'
        });
        setError('Failed to delete status. It may be in use by existing feedback.');
      }
    } catch (error) {
      console.error('Error deleting status:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Falha ao deletar status. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
      setError('Failed to delete status. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate the field as the user types
    validateField(name, value);
  };
  
  const validateField = (fieldName: string, value: string): boolean => {
    let error = '';
    
    if (fieldName === 'typeStatus') {
      if (!value.trim()) {
        error = 'O nome do status é obrigatório';
      } else if (value.length < 3) {
        error = 'O nome do status deve ter pelo menos 3 caracteres';
      } else if (value.length > 50) {
        error = 'O nome do status deve ter no máximo 50 caracteres';
      }
    } else if (fieldName === 'colorStatus') {
      if (!value.trim()) {
        error = 'A cor do status é obrigatória';
      } else if (!/^#([A-Fa-f0-9]{6})$/.test(value)) {
        error = 'A cor deve estar no formato hexadecimal válido (#RRGGBB)';
      }
    }
    
    // Update validation errors
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    
    return !error;
  };
  
  const validateAllFields = (): boolean => {
    const typeStatusValid = validateField('typeStatus', formData.typeStatus);
    const colorStatusValid = validateField('colorStatus', formData.colorStatus);
    
    return typeStatusValid && colorStatusValid;
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
      if (currentStatus) {
        // Update existing status
        const updatedStatus = await updateStatus(currentStatus.idstatus, {
          typestatus: formData.typeStatus,
          colorstatus: formData.colorStatus
        });
        
        if (updatedStatus) {
          setStatuses(statuses.map(status => 
            status.idstatus === currentStatus.idstatus ? updatedStatus : status
          ));
          setIsModalOpen(false);
          setError(null);
          Swal.fire({
            title: 'Sucesso!',
            text: 'Status atualizado com sucesso!',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: 'Erro',
            text: 'Falha ao atualizar status. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#1575C5'
          });
          setError('Failed to update status. Please try again.');
        }
      } else {
        // Create new status
        const newStatus = await createStatus({
          typestatus: formData.typeStatus,
          colorstatus: formData.colorStatus
        });
        
        if (newStatus) {
          setStatuses([...statuses, newStatus]);
          setIsModalOpen(false);
          setError(null);
          Swal.fire({
            title: 'Sucesso!',
            text: 'Status criado com sucesso!',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: 'Erro',
            text: 'Falha ao criar status. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#1575C5'
          });
          setError('Failed to create status. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error saving status:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Falha ao salvar status. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
      setError('Failed to save status. Please try again.');
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'idstatus',
      width: '80px'
    },
    {
      header: 'Nome Status',
      accessor: 'typestatus'
    },
    {
      header: 'Cor',
      accessor: 'colorstatus',
      cell: (value: string) => (
        <div className="color-cell">
          <div 
            className="color-preview" 
            style={{ backgroundColor: value || '#CCCCCC' }}
          ></div>
          <span>{value || '-'}</span>
        </div>
      )
    }
  ];

  return (
    <div className="category-manager">
      <CrudTable
        title="Gerenciamento de Status"
        data={statuses}
        columns={columns}
        loading={loading}
        error={error}
        idField="idstatus"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchStatuses}
      />
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentStatus ? 'Editar Status' : 'Adicionar Novo Status'}</h3>
              <button 
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className='form-admin'> 
              <div className="form-group">
                <label htmlFor="typeStatus">Nome do Status</label>
                <input
                  type="text"
                  id="typeStatus"
                  name="typeStatus"
                  value={formData.typeStatus}
                  onChange={handleInputChange}
                  className={validationErrors.typeStatus ? 'is-invalid' : ''}
                />
                {validationErrors.typeStatus && (
                  <span className="validation-error">{validationErrors.typeStatus}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="colorStatus">Cor do Status</label>
                <div className="color-input-container">
                  <input
                    type="color"
                    id="colorStatus"
                    name="colorStatus"
                    value={formData.colorStatus}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="colorStatus"
                    value={formData.colorStatus}
                    onChange={handleInputChange}
                    placeholder="#RRGGBB"
                    className={validationErrors.colorStatus ? 'is-invalid' : ''}
                  />
                </div>
                {validationErrors.colorStatus && (
                  <span className="validation-error">{validationErrors.colorStatus}</span>
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
                >
                  {currentStatus ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusManager;
