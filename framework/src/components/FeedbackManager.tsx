import React, { useState, useEffect } from 'react';
import CrudTable from './CrudTable';
import { FeedbackData } from '../interface/feedback/FeedbackData';
import { CategoryData } from '../interface/feedback/CategoryData';
import { StatusData } from '../interface/feedback/StatusData';
import { UserData } from '../interface/user/UserData';
import { CompanyData } from '../interface/user/CompanyData';
import '../css/CategoryManager.css'; // Reusing base styling
import '../css/FeedbackManager.css'; // Custom styling for feedback manager

interface FeedbackFormData {
  titleFeedback: string;
  reviewFeedback: string;
  fk_feedback_idUser: string;
  fk_feedback_idCompany: string;
  fk_feedback_idCategory: string;
  fk_feedback_idStatus: string;
}

const FeedbackManager: React.FC = () => {
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

  useEffect(() => {
    fetchFeedbacks();
    fetchCategories();
    fetchStatuses();
    fetchUsers();
    fetchCompanies();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3003/feedback');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setFeedbacks(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError('Failed to load feedbacks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3003/category');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await fetch('http://localhost:3003/status');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setStatuses(data);
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3003/user');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
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
    }
  };

  const handleAdd = () => {
    setCurrentFeedback(null);
    setFormData({
      titleFeedback: '',
      reviewFeedback: '',
      fk_feedback_idUser: '',
      fk_feedback_idCompany: '',
      fk_feedback_idCategory: '',
      fk_feedback_idStatus: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (feedback: FeedbackData) => {
    // Find the full feedback object from API to get foreign keys
    fetch(`http://localhost:3003/feedback/${feedback.idfeedback}`)
      .then(res => res.json())
      .then(data => {
        setCurrentFeedback(feedback);
        // The API might return data with different case, handle both formats
        setFormData({
          titleFeedback: data.titlefeedback || data.titleFeedback || '',
          reviewFeedback: data.reviewfeedback || data.reviewFeedback || '',
          fk_feedback_idUser: data.fk_feedback_iduser?.toString() || data.fk_feedback_idUser?.toString() || '',
          fk_feedback_idCompany: data.fk_feedback_idcompany?.toString() || data.fk_feedback_idCompany?.toString() || '',
          fk_feedback_idCategory: data.fk_feedback_idcategory?.toString() || data.fk_feedback_idCategory?.toString() || '',
          fk_feedback_idStatus: data.fk_feedback_idstatus?.toString() || data.fk_feedback_idStatus?.toString() || ''
        });
        setIsModalOpen(true);
      })
      .catch(err => {
        console.error("Error fetching feedback details:", err);
        setError("Failed to load feedback details for editing");
      });
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3003/feedback/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Update local state after successful deletion
      setFeedbacks(feedbacks.filter(feedback => feedback.idfeedback !== id));
    } catch (error) {
      console.error('Error deleting feedback:', error);
      setError('Failed to delete feedback. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const feedbackData = {
        titleFeedback: formData.titleFeedback,
        reviewFeedback: formData.reviewFeedback,
        fk_feedback_idUser: parseInt(formData.fk_feedback_idUser),
        fk_feedback_idCompany: parseInt(formData.fk_feedback_idCompany),
        fk_feedback_idCategory: parseInt(formData.fk_feedback_idCategory),
        fk_feedback_idStatus: parseInt(formData.fk_feedback_idStatus)
      };
      
      if (currentFeedback) {
        // Update existing feedback
        const response = await fetch(`http://localhost:3003/feedback/${currentFeedback.idfeedback}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(feedbackData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // After successful update, refresh the data
        fetchFeedbacks();
      } else {
        // Create new feedback
        const response = await fetch('http://localhost:3003/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(feedbackData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // After successful creation, refresh the data
        fetchFeedbacks();
      }
      
      // Close modal after successful operation
      setIsModalOpen(false);
      setError(null);
    } catch (error) {
      console.error('Error saving feedback:', error);
      setError('Failed to save feedback. Please try again.');
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'idfeedback',
      width: '10%'
    },
    {
      header: 'Title',
      accessor: 'titlefeedback',
      width: '20%'
    },
    {
      header: 'Category',
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
      header: 'Content',
      accessor: 'reviewfeedback',
      width: '40%',
      cell: (value: string) => (
        <div className="truncate-text">{value}</div>
      )
    }
  ];

  return (
    <div className="category-manager">
      <CrudTable
        title="Feedback Management"
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
              <h2>{currentFeedback ? 'Edit Feedback' : 'Add Feedback'}</h2>
              <button 
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="titleFeedback">Title:</label>
                <input
                  type="text"
                  id="titleFeedback"
                  name="titleFeedback"
                  value={formData.titleFeedback}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fk_feedback_idUser">User:</label>
                <select
                  id="fk_feedback_idUser"
                  name="fk_feedback_idUser"
                  value={formData.fk_feedback_idUser}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a user</option>
                  {users.map(user => (
                    <option key={user.idUser} value={user.idUser}>
                      {user.emailUser}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fk_feedback_idCompany">Company:</label>
                <select
                  id="fk_feedback_idCompany"
                  name="fk_feedback_idCompany"
                  value={formData.fk_feedback_idCompany}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                    <option key={company.idcompany} value={company.idcompany}>
                      {company.namecompany}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fk_feedback_idCategory">Category:</label>
                <select
                  id="fk_feedback_idCategory"
                  name="fk_feedback_idCategory"
                  value={formData.fk_feedback_idCategory}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.idcategory} value={category.idcategory}>
                      {category.typecategory}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fk_feedback_idStatus">Status:</label>
                <select
                  id="fk_feedback_idStatus"
                  name="fk_feedback_idStatus"
                  value={formData.fk_feedback_idStatus}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a status</option>
                  {statuses.map(status => (
                    <option key={status.idstatus} value={status.idstatus}>
                      {status.typestatus}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reviewFeedback">Review:</label>
                <textarea
                  id="reviewFeedback"
                  name="reviewFeedback"
                  value={formData.reviewFeedback}
                  onChange={handleInputChange}
                  required
                  rows={5}
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="button-group">
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManager;
