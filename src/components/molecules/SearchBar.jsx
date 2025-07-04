import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch,
  showFilters = false,
  filters = [],
  activeFilters = [],
  onFilterChange,
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="flex items-center space-x-3">
        <div className="relative flex-1">
          <ApperIcon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
          />
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full bg-surface border border-slate-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        {showFilters && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="bg-surface hover:bg-surface/80 border border-slate-600 rounded-lg px-4 py-3 text-white flex items-center space-x-2"
            >
              <ApperIcon name="Filter" size={20} />
              <span>Filters</span>
              {activeFilters.length > 0 && (
                <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
            </motion.button>

            {showFilterDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-64 bg-surface border border-slate-600 rounded-lg shadow-lg z-50"
              >
                <div className="p-4 space-y-3">
                  <h4 className="font-medium text-white">Filter by:</h4>
                  {filters.map((filter) => (
                    <label key={filter.key} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={activeFilters.includes(filter.key)}
                        onChange={(e) => {
                          if (onFilterChange) {
                            if (e.target.checked) {
                              onFilterChange([...activeFilters, filter.key]);
                            } else {
                              onFilterChange(activeFilters.filter(f => f !== filter.key));
                            }
                          }
                        }}
                        className="rounded text-primary"
                      />
                      <span className="text-slate-300">{filter.label}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;