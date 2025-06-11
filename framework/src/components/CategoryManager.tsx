import React, { useState, useEffect } from 'react';
import CrudTable from './CrudTable';
import { CategoryData } from '../interface/feedback/CategoryData';
import { getCategory } from '../controller/feedback/Category';
import '../css/CategoryManager.css';

const CategoryManager: React.FC = () => {
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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategory();
      setCategories(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again.');
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
      // Add your API call to delete a category
      await fetch(`http://localhost:3003/category/${id}`, {
        method: 'DELETE'
      });
      
      // Update local state after successful deletion
      setCategories(categories.filter(category => category.idcategory !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category. Please try again.');
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
        const response = await fetch(`http://localhost:3003/category/${currentCategory.idcategory}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            typeCategory: formData.typeCategory,
            colorCategory: formData.colorCategory
          })
        });
        
        const updatedCategory = await response.json();
        
        // Update local state
        setCategories(categories.map(category => 
          category.idcategory === currentCategory.idcategory ? 
          { ...updatedCategory, 
            typecategory: updatedCategory.typeCategory || updatedCategory.typecategory,
            colorcategory: updatedCategory.colorCategory || updatedCategory.colorcategory
          } : category
        ));
      } else {
        // Create new category
        const response = await fetch('http://localhost:3003/category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            typeCategory: formData.typeCategory,
            colorCategory: formData.colorCategory
          })
        });
        
        const newCategory = await response.json();
        
        // Add to local state with correct property names
        setCategories([...categories, { 
          idcategory: newCategory.idCategory || newCategory.idcategory,
          typecategory: newCategory.typeCategory || newCategory.typecategory,
          colorcategory: newCategory.colorCategory || newCategory.colorcategory
        }]);
      }
      
      // Close modal after successful operation
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
      setError('Failed to save category. Please try again.');
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'idcategory',
      width: '80px'
    },
    {
      header: 'Category Name',
      accessor: 'typecategory'
    },
    {
      header: 'Color',
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
        title="Category Management"
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
              <h3>{currentCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button 
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="typeCategory">Category Name</label>
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
                <label htmlFor="colorCategory">Category Color</label>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button"
                >
                  {currentCategory ? 'Update' : 'Create'}
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
