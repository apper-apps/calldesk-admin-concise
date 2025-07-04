import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const DataTable = ({ 
  data, 
  columns, 
  loading = false,
  onRowClick,
  sortable = true,
  className = '' 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    if (!sortable) return;

    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return 'ArrowUpDown';
    }
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  if (loading) {
    return (
      <div className="bg-surface rounded-lg border border-slate-700 overflow-hidden">
        <div className="animate-pulse">
          <div className="bg-slate-800 p-4 flex space-x-4">
            {columns.map((_, index) => (
              <div key={index} className="h-4 bg-slate-600 rounded flex-1"></div>
            ))}
          </div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="p-4 border-t border-slate-700 flex space-x-4">
              {columns.map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-slate-600 rounded flex-1"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface rounded-lg border border-slate-700 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider ${
                    sortable && column.sortable !== false ? 'cursor-pointer hover:text-white' : ''
                  }`}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.label}</span>
                    {sortable && column.sortable !== false && (
                      <ApperIcon name={getSortIcon(column.key)} size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {sortedData.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: rowIndex * 0.05 }}
                className={`hover:bg-slate-800/50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;