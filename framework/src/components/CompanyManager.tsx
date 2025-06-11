import React, { useState, useEffect } from 'react';
import CrudTable from './CrudTable';
import { CompanyData } from '../interface/user/CompanyData';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../controller/feedback/Company';
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
      const data = await getCompanies();
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
      const success = await deleteCompany(id);
      if (success) {
        setCompanies(companies.filter(company => company.idcompany !== id));
        setError(null);
      } else {
        setError('Failed to delete company. Please try again.');
      }
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
        } else {
          setError('Failed to update company. Please try again.');
        }
      } else {
        // Create new company
        const newCompany = await createCompany(companyData);
        if (newCompany) {
          setCompanies([...companies, newCompany]);
          setIsModalOpen(false);
          setError(null);
        } else {
          setError('Failed to create company. Please try again.');
        }
      }
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
