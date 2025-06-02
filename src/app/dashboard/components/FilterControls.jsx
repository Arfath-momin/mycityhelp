import React from 'react';
import Icon from '@/components/AppIcon';
import { CATEGORIES } from '@/constants';

// Define valid categories with proper structure
const VALID_CATEGORIES = [
  { value: 'Infrastructure', label: 'Infrastructure' },
  { value: 'Roads', label: 'Roads' },
  { value: 'Noise', label: 'Noise' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Environment', label: 'Environment' },
  { value: 'Water Supply', label: 'Water Supply' },
  { value: 'Electricity', label: 'Electricity' },
  { value: 'Sanitation', label: 'Sanitation' },
  { value: 'Other', label: 'Other' }
];

const FilterControls = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Status Filter */}
      <div className="flex-1">
        <label htmlFor="status-filter" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Status
        </label>
        <div className="relative">
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full bg-white border border-[var(--border)] rounded-lg px-4 py-2.5 pr-10 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option key="status-all" value="all">All Status</option>
            <option key="status-pending" value="pending">Pending</option>
            <option key="status-in_progress" value="in_progress">In Progress</option>
            <option key="status-resolved" value="resolved">Resolved</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Icon name="ChevronDown" size={18} className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex-1">
        <label htmlFor="category-filter" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Category
        </label>
        <div className="relative">
          <select
            id="category-filter"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full bg-white border border-[var(--border)] rounded-lg px-4 py-2.5 pr-10 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option key="category-all" value="all">All Categories</option>
            {VALID_CATEGORIES.map((category) => (
              <option key={`category-${category.value}`} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Icon name="ChevronDown" size={18} className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="flex-1">
        <label htmlFor="date-filter" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Time Period
        </label>
        <div className="relative">
          <select
            id="date-filter"
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full bg-white border border-[var(--border)] rounded-lg px-4 py-2.5 pr-10 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option key="date-all" value="all">All Time</option>
            <option key="date-today" value="today">Today</option>
            <option key="date-week" value="week">This Week</option>
            <option key="date-month" value="month">This Month</option>
            <option key="date-year" value="year">This Year</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Icon name="ChevronDown" size={18} className="text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;