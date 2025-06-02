import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  const handleStatusChange = (e) => {
    onFilterChange({ status: e.target.value });
  };

  const handleDateRangeChange = (e) => {
    onFilterChange({ dateRange: e.target.value });
  };

  const clearFilters = () => {
    onFilterChange({ status: 'all', dateRange: 'all' });
  };

  const hasActiveFilters = filters.status !== 'all' || filters.dateRange !== 'all';

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-gray-500" />
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Status:
            </label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={handleStatusChange}
              className="input text-sm py-1 px-2 min-w-32"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-gray-500" />
            <label htmlFor="date-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Date:
            </label>
            <select
              id="date-filter"
              value={filters.dateRange}
              onChange={handleDateRangeChange}
              className="input text-sm py-1 px-2 min-w-32"
            >
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Icon name="X" size={14} />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">Active filters:</span>
            {filters.status !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                Status: {statusOptions.find(opt => opt.value === filters.status)?.label}
              </span>
            )}
            {filters.dateRange !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                Date: {dateRangeOptions.find(opt => opt.value === filters.dateRange)?.label}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;