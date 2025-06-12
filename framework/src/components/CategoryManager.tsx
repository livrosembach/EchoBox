import React, { useState, useEffect } from 'react';
import CrudTable from './CrudTable';
import { CategoryData } from '../interface/feedback/CategoryData';
import { getCategory, createCategory, updateCategory, deleteCategory } from '../controller/feedback/Category';
import { useAdminGuard } from '../utils/AdminGuard';
import '../css/CategoryManager.css';

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

  useEffect(() => {
    if (isAuthorized) {
      fetchCategories();
    }
  }, [isAuthorized]);

  if (isLoading) {
    return <div className="loading">Verificando permissões...</div>;
  }

  if (!isAuthorized) {
    return null; // Component will be redirected by the hook
  }

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategory();
      setCategories(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
        setCategories(categories.filter(category => category.idcategory !== id));
        setError(null);
      } else {
        setError('Falha ao deletar categoria. Ela pode estar em uso por feedbacks existentes.');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Falha ao deletar categoria. Tente novamente.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (currentCategory) {
        // Update existing category
        const updatedCategory = await updateCategory(currentCategory.idcategory, {
          typecategory: formData.typeCategory,
          colorcategory: formData.colorCategory
        });
        
        if (updatedCategory) {
          setCategories(categories.map(category => 
            category.idcategory === currentCategory.idcategory ? updatedCategory : category
          ));
          setIsModalOpen(false);
          setError(null);
        } else {
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
        } else {
          setError('Falha ao criar categoria. Tente novamente.');
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
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
        onRefresh={fetchCategories}
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
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="typeCategory">Nome da Categoria</label>
                <input
                  type="text"
                  id="typeCategory"
                  name="typeCategory"
                  value={formData.typeCategory}
                  onChange={handleInputChange}
                  required
                />
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
                    pattern="^#([A-Fa-f0-9]{6})$"
                  />
                </div>
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
