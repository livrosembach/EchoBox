import React, { useState, useEffect } from 'react';
import CrudTable from './CrudTable';
import { CompanyData } from '../interface/user/CompanyData';
import '../css/CategoryManager.css'; // Reusing the same styling

const CompanyManager: React.FC = () => {
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3003/company');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setCompanies(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching companies:', error);
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
    setIsModalOpen(true);
  };

  const handleEdit = (company: CompanyData) => {
    setCurrentCompany(company);
    setFormData({
      nameCompany: company.namecompany || '',
      emailCompany: company.emailcompany || '',
      cnpjCompany: company.cnpjcompany || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3003/company/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Update local state after successful deletion
      setCompanies(companies.filter(company => company.idcompany !== id));
    } catch (error) {
      console.error('Error deleting company:', error);
      setError('Failed to delete company. Please try again.');
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
      const companyData = {
        nameCompany: formData.nameCompany,
        emailCompany: formData.emailCompany,
        cnpjCompany: formData.cnpjCompany
      };
      
      if (currentCompany) {
        // Update existing company
        const response = await fetch(`http://localhost:3003/company/${currentCompany.idcompany}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(companyData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const updatedCompany = await response.json();
        
        // Update local state
        setCompanies(companies.map(company => 
          company.idcompany === currentCompany.idcompany ? updatedCompany : company
        ));
      } else {
        // Create new company
        const response = await fetch('http://localhost:3003/company', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(companyData)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const newCompany = await response.json();
        
        // Add to local state
        setCompanies([...companies, newCompany]);
      }
      
      // Close modal after successful operation
      setIsModalOpen(false);
      setError(null);
    } catch (error) {
      console.error('Error saving company:', error);
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
      header: 'Name',
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

  return (
    <div className="category-manager">
      <CrudTable
        title="Company Management"
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
              <h2>{currentCompany ? 'Edit Company' : 'Add Company'}</h2>
              <button 
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nameCompany">Company Name:</label>
                <input
                  type="text"
                  id="nameCompany"
                  name="nameCompany"
                  value={formData.nameCompany}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="emailCompany">Email:</label>
                <input
                  type="email"
                  id="emailCompany"
                  name="emailCompany"
                  value={formData.emailCompany}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cnpjCompany">CNPJ:</label>
                <input
                  type="text"
                  id="cnpjCompany"
                  name="cnpjCompany"
                  value={formData.cnpjCompany}
                  onChange={handleInputChange}
                  required
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

export default CompanyManager;
