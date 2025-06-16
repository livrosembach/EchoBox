import React, { useState, useEffect } from 'react';
import CrudTable from './CrudTable';
import { CategoryData } from '../interface/feedback/CategoryData';
import { getCategory, createCategory, updateCategory, deleteCategory } from '../controller/feedback/Category';
import { useAdminGuard } from '../utils/AdminGuard';
import '../css/CategoryManager.css';
import Swal from 'sweetalert2';
import * as Validation from '../utils/FormValidation';
import { validateForm, required, hexColor, minLength, maxLength, getFirstErrorByField, ValidationRule } from '../utils/FormValidation';

const CategoryManager: React.FC = () => {
  const { isAuthorized, isLoading } = useAdminGuard();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryData | null>(null);
  const [formData, setFormData] = useState({
    typeCategory: '',
    colorCategory: '#CCCCCC'
  });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isAuthorized) {
      fetchCategories();
    }
  }, [isAuthorized]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategory();
      setCategories(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Falha ao carregar categorias. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
      setError('Falha ao carregar categorias. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentCategory(null);
    setFormData({
      typeCategory: '',
      colorCategory: '#CCCCCC'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (category: CategoryData) => {
    setCurrentCategory(category);
    setFormData({
      typeCategory: category.typecategory,
      colorCategory: category.colorcategory || '#CCCCCC'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteCategory(id);
      if (success) {
        setCategories(categories.filter((category) => category.idcategory !== id));
        setError(null);
        Swal.fire({
          title: 'Sucesso!',
          text: 'Categoria excluída com sucesso!',
          icon: 'success',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Erro',
          text: 'Falha ao deletar categoria. Ela pode estar em uso por feedbacks existentes.',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#1575C5'
        });
        setError('Falha ao deletar categoria. Ela pode estar em uso por feedbacks existentes.');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Falha ao deletar categoria. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
      setError('Falha ao deletar categoria. Tente novamente.');
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
    const fieldValidations: Record<string, ValidationRule[]> = {
      typeCategory: [
        required('O nome da categoria é obrigatório'),
        minLength(3, 'O nome da categoria deve ter pelo menos 3 caracteres'),
        maxLength(50, 'O nome da categoria deve ter no máximo 50 caracteres')
      ],
      colorCategory: [
        required('A cor da categoria é obrigatória'),
        hexColor('A cor deve estar no formato hexadecimal válido (#RRGGBB)')
      ]
    };
    
    // Only validate the specified field
    const fieldRules = fieldValidations[fieldName];
    if (!fieldRules) return true;
    
    const validation = validateForm(
      { [fieldName]: value },
      { [fieldName]: fieldRules }
    );
    
    const error = getFirstErrorByField(validation, fieldName);
    
    setValidationErrors((prev) => ({
      ...prev,
      [fieldName]: error || ''
    }));
    
    return !error;
  };
  
  const validateAllFields = (): boolean => {
    const fieldValidations: Record<string, ValidationRule[]> = {
      typeCategory: [
        required('O nome da categoria é obrigatório'),
        minLength(3, 'O nome da categoria deve ter pelo menos 3 caracteres'),
        maxLength(50, 'O nome da categoria deve ter no máximo 50 caracteres')
      ],
      colorCategory: [
        required('A cor da categoria é obrigatória'),
        hexColor('A cor deve estar no formato hexadecimal válido (#RRGGBB)')
      ]
    };
    
    const validation = validateForm(formData, fieldValidations);
    
    const newErrors: { [key: string]: string } = {};
    validation.errors.forEach((error: Validation.ValidationError) => {
      newErrors[error.field] = error.message;
    });
    
    setValidationErrors(newErrors);
    return validation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const isValid = validateAllFields();
    if (!isValid) {
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
      if (currentCategory) {
        // Update existing category
        const updatedCategory = await updateCategory(currentCategory.idcategory, {
          typecategory: formData.typeCategory,
          colorcategory: formData.colorCategory
        });
        
        if (updatedCategory) {
          setCategories(categories.map((category) => 
            category.idcategory === currentCategory.idcategory ? updatedCategory : category
          ));
          setIsModalOpen(false);
          setError(null);
          Swal.fire({
            title: 'Sucesso!',
            text: 'Categoria atualizada com sucesso!',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: 'Erro',
            text: 'Falha ao atualizar categoria. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#1575C5'
          });
          setError('Falha ao atualizar categoria. Tente novamente.');
        }
      } else {
        // Create new category
        const newCategory = await createCategory({
          typecategory: formData.typeCategory,
          colorcategory: formData.colorCategory
        });
        
        if (newCategory) {
          setCategories([...categories, newCategory]);
          setIsModalOpen(false);
          setError(null);
          Swal.fire({
            title: 'Sucesso!',
            text: 'Categoria criada com sucesso!',
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: 'Erro',
            text: 'Falha ao criar categoria. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#1575C5'
          });
          setError('Falha ao criar categoria. Tente novamente.');
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Falha ao salvar categoria. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#1575C5'
      });
      setError('Falha ao salvar categoria. Tente novamente.');
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'idcategory',
      width: '80px'
    },
    {
      header: 'Nome da Categoria',
      accessor: 'typecategory'
    },
    {
      header: 'Cor',
      accessor: 'colorcategory',
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

  if (isLoading) {
    return <div className="loading">Verificando permissões...</div>;
  }

  if (!isAuthorized) {
    return null; // Component will be redirected by the hook
  }

  return (
    <div className="category-manager">
      <CrudTable
        title="Gerenciamento de Categorias"
        data={categories}
        columns={columns}
        loading={loading}
        error={error}
        idField="idcategory"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{currentCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</h3>
              <button 
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className='form-admin'>
              <div className="form-group">
                <label htmlFor="typeCategory">Nome da Categoria</label>
                <input
                  type="text"
                  id="typeCategory"
                  name="typeCategory"
                  value={formData.typeCategory}
                  onChange={handleInputChange}
                  className={validationErrors.typeCategory ? 'is-invalid' : ''}
                />
                {validationErrors.typeCategory && (
                  <span className="validation-error">{validationErrors.typeCategory}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="colorCategory">Cor da Categoria</label>
                <div className="color-input-container">
                  <input
                    type="color"
                    id="colorCategory"
                    name="colorCategory"
                    value={formData.colorCategory}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="colorCategory"
                    value={formData.colorCategory}
                    onChange={handleInputChange}
                    placeholder="#RRGGBB"
                    className={validationErrors.colorCategory ? 'is-invalid' : ''}
                  />
                </div>
                {validationErrors.colorCategory && (
                  <span className="validation-error">{validationErrors.colorCategory}</span>
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
                  {currentCategory ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
