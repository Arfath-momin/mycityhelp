import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const Dropdown = ({
  options = [],
  value = null,
  onChange = () => {},
  placeholder = 'Select an option',
  label = '',
  error = '',
  disabled = false,
  required = false,
  multiple = false,
  searchable = false,
  clearable = false,
  loading = false,
  className = '',
  dropdownClassName = '',
  optionClassName = '',
  id = '',
  name = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const dropdownId = id || `dropdown-${Math.random().toString(36).substr(2, 9)}`;

  // Filter options based on search term
  const filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Get selected option(s) display text
  const getDisplayText = () => {
    if (multiple) {
      if (!value || value.length === 0) return placeholder;
      if (value.length === 1) {
        const option = options.find(opt => opt.value === value[0]);
        return option ? option.label : placeholder;
      }
      return `${value.length} items selected`;
    } else {
      if (!value) return placeholder;
      const option = options.find(opt => opt.value === value);
      return option ? option.label : placeholder;
    }
  };

  // Handle option selection
  const handleOptionSelect = (optionValue) => {
    if (multiple) {
      const newValue = value || [];
      const isSelected = newValue.includes(optionValue);
      const updatedValue = isSelected
        ? newValue.filter(v => v !== optionValue)
        : [...newValue, optionValue];
      onChange({ target: { value: updatedValue, name } });
    } else {
      onChange({ target: { value: optionValue, name } });
      setIsOpen(false);
    }
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  // Handle clear selection
  const handleClear = (e) => {
    e.stopPropagation();
    onChange({ target: { value: multiple ? [] : null, name } });
    setSearchTerm('');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const isSelected = (optionValue) => {
    if (multiple) {
      return value && value.includes(optionValue);
    }
    return value === optionValue;
  };

  const hasValue = multiple ? value && value.length > 0 : value !== null && value !== undefined;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={dropdownId}
          className={`block text-sm font-medium mb-1 ${
            error ? 'text-red-700' : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Dropdown trigger */}
      <button
        id={dropdownId}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          relative w-full bg-white border rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default 
          focus:outline-none focus:ring-1 transition-colors
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'}
          ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'hover:border-gray-400'}
          ${dropdownClassName}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? `${dropdownId}-label` : undefined}
        {...props}
      >
        <span className={`block truncate ${hasValue ? 'text-gray-900' : 'text-gray-500'}`}>
          {loading ? 'Loading...' : getDisplayText()}
        </span>
        
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Clear selection"
            >
              <Icon name="X" size={16} />
            </button>
          )}
          <Icon 
            name={isOpen ? 'ChevronUp' : 'ChevronDown'} 
            size={16} 
            className="text-gray-400"
          />
        </span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          {/* Search input */}
          {searchable && (
            <div className="px-3 py-2 border-b border-gray-200">
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Options list */}
          <div role="listbox" aria-multiselectable={multiple}>
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                {searchTerm ? 'No options found' : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const selected = isSelected(option.value);
                const highlighted = index === highlightedIndex;
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionSelect(option.value)}
                    className={`
                      w-full text-left px-3 py-2 text-sm cursor-pointer flex items-center justify-between
                      ${highlighted ? 'bg-primary-50 text-primary' : 'text-gray-900'}
                      ${selected ? 'bg-primary-100 text-primary font-medium' : 'hover:bg-gray-50'}
                      ${optionClassName}
                    `}
                    role="option"
                    aria-selected={selected}
                  >
                    <span className="truncate">{option.label}</span>
                    {selected && (
                      <Icon name="Check" size={16} className="text-primary flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Dropdown;