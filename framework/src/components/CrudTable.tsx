import React, { useState, useEffect } from 'react';
import '../css/CrudTable.css';

interface Column {
  header: string;
  accessor: string;
  cell?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface CrudTableProps<T> {
  title: string;
  data: T[];
  columns: Column[];
  loading?: boolean;
  error?: string | null;
  idField: string;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (id: any) => void;
  onRefresh?: () => void;
  customActions?: (item: T) => React.ReactNode;
}

const CrudTable = <T extends Record<string, any>>({
  title,
  data,
  columns,
  loading = false,
  error = null,
  idField,
  onAdd,
  onEdit,
  onDelete,
  onRefresh,
  customActions
}: CrudTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredData, setFilteredData] = useState<T[]>(data);
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
      return;
    }
    
    const filtered = data.filter(item => {
      return columns.some(column => {
        const value = item[column.accessor];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchTerm);
        }
        return false;
      });
    });
    
    setFilteredData(filtered);
  }, [searchTerm, data, columns]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const renderCellContent = (item: T, column: Column) => {
    const value = item[column.accessor];
    
    if (column.cell) {
      return column.cell(value, item);
    }
    
    if (value === null || value === undefined) {
      return '-';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    return value;
  };
  
  return (
    <div className="crud-table-container">
      <div className="crud-table-header">
        <h2>{title}</h2>
        <div className="crud-table-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
          </div>
          {onRefresh && (
            <button 
              className="refresh-button action-button" 
              onClick={onRefresh}
              title="Atualizar"
            >
              <i className="fa-solid fa-arrows-rotate"></i>
            </button>
          )}
          {onAdd && (
            <button 
              className="add-button action-button" 
              onClick={onAdd}
              title="Adicionar"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          )}
        </div>
      </div>
      
      {error && <div className="crud-table-error">{error}</div>}
      
      <div className="crud-table-wrapper">
        {loading ? (
          <div className="crud-table-loading">
            <i className="fa-solid fa-spinner fa-spin"></i> Carregando...
          </div>
        ) : (
          <table className="crud-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.accessor} style={{ width: column.width }}>
                    {column.header}
                  </th>
                ))}
                {(onEdit || onDelete || customActions) && (
                  <th style={{ width: '150px' }}>Ações</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete || customActions ? 1 : 0)} className="no-data">
                    Nenhum dado disponível
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item[idField]}>
                    {columns.map((column) => (
                      <td key={`${item[idField]}-${column.accessor}`}>
                        {renderCellContent(item, column)}
                      </td>
                    ))}
                    {(onEdit || onDelete || customActions) && (
                      <td className="action-buttons">
                        {customActions && customActions(item)}
                        {onEdit && (
                          <button 
                            className="edit-button action-button"
                            onClick={() => onEdit(item)}
                            title="Edit"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        )}
                        {onDelete && (
                          <button 
                            className="delete-button action-button"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this item?')) {
                                onDelete(item[idField]);
                              }
                            }}
                            title="Deletar"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CrudTable;