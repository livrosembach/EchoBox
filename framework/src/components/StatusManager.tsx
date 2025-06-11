import React, { useState, useEffect } from 'react';
import CrudTable from './CrudTable';
import { StatusData } from '../interface/feedback/StatusData';
import { getStatus } from '../controller/feedback/Status';
import '../css/CategoryManager.css'; // Reusing the same styling

const StatusManager: React.FC = () => {
  const [statuses, setStatuses] = useState<StatusData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<StatusData | null>(null);
  const [formData, setFormData] = useState({
    typeStatus: '',
    colorStatus: '#CCCCCC'
  });

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const data = await getStatus();
      setStatuses(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching statuses:', error);
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
    setIsModalOpen(true);
  };

  const handleEdit = (status: StatusData) => {
    setCurrentStatus(status);
    setFormData({
      typeStatus: status.typestatus,
      colorStatus: status.colorstatus || '#CCCCCC'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:3003/status/${id}`, {
        method: 'DELETE'
      });
      
      setStatuses(statuses.filter(status => status.idstatus !== id));
    } catch (error) {
      console.error('Error deleting status:', error);
      setError('Failed to delete status. Please try again.');
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
      if (currentStatus) {
        // Update existing status
        const response = await fetch(`http://localhost:3003/status/${currentStatus.idstatus}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            typeStatus: formData.typeStatus,
            colorStatus: formData.colorStatus
          })
        });
        
        const updatedStatus = await response.json();
        
        // Update local state
        setStatuses(statuses.map(status => 
          status.idstatus === currentStatus.idstatus ? 
          { ...updatedStatus, 
            typestatus: updatedStatus.typeStatus || updatedStatus.typestatus,
            colorstatus: updatedStatus.colorStatus || updatedStatus.colorstatus
          } : status
        ));
      } else {
        // Create new status
        const response = await fetch('http://localhost:3003/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            typeStatus: formData.typeStatus,
            colorStatus: formData.colorStatus
          })
        });
        
        const newStatus = await response.json();
        
        // Add to local state with correct property names
        setStatuses([...statuses, { 
          idstatus: newStatus.idStatus || newStatus.idstatus,
          typestatus: newStatus.typeStatus || newStatus.typestatus,
          colorstatus: newStatus.colorStatus || newStatus.colorstatus
        }]);
      }
      
      // Close modal after successful operation
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving status:', error);
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
      header: 'Status Name',
      accessor: 'typestatus'
    },
    {
      header: 'Color',
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
        title="Status Management"
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
              <h3>{currentStatus ? 'Edit Status' : 'Add New Status'}</h3>
              <button 
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="typeStatus">Status Name</label>
                <input
                  type="text"
                  id="typeStatus"
                  name="typeStatus"
                  value={formData.typeStatus}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="colorStatus">Status Color</label>
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
                  {currentStatus ? 'Update' : 'Create'}
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
