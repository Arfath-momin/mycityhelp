import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import { CATEGORIES } from '@/constants';
import FileUploader from './FileUploader';
import { getDepartmentForCategory, getPriorityLevel } from '@/utils/departmentMapping';

const NewComplaintForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    image: null
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Automatically assign department and priority based on category and description
    const department = getDepartmentForCategory(formData.category);
    const priority = getPriorityLevel(formData.category, formData.description);
    
    try {
      const completeFormData = {
        ...formData,
        department,
        priority
      };

      const result = await onSubmit(completeFormData);
      if (result.success) {
        setFormData({
          title: '',
          description: '',
          category: '',
          location: '',
          image: null
        });
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Title
        </label>
        <div className="relative">
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full bg-white border ${
              errors.title ? 'border-red-500' : 'border-[var(--border)]'
            } rounded-lg px-4 py-2.5 text-gray-900 placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
            placeholder="Enter a clear title for your grievance"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <Icon name="AlertCircle" size={14} />
              {errors.title}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Description
        </label>
        <div className="relative">
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className={`w-full bg-white border ${
              errors.description ? 'border-red-500' : 'border-[var(--border)]'
            } rounded-lg px-4 py-2.5 text-gray-900 placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
            placeholder="Provide detailed information about your grievance"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <Icon name="AlertCircle" size={14} />
              {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Category
        </label>
        <div className="relative">
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full bg-white border ${
              errors.category ? 'border-red-500' : 'border-[var(--border)]'
            } rounded-lg px-4 py-2.5 pr-10 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={`category-${category}`} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Icon name="ChevronDown" size={18} className="text-gray-500" />
          </div>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <Icon name="AlertCircle" size={14} />
              {errors.category}
            </p>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Location
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="MapPin" size={18} className="text-gray-500" />
          </div>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className={`w-full bg-white border ${
              errors.location ? 'border-red-500' : 'border-[var(--border)]'
            } rounded-lg pl-10 pr-4 py-2.5 text-gray-900 placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
            placeholder="Enter the location of the issue"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <Icon name="AlertCircle" size={14} />
              {errors.location}
            </p>
          )}
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Attach Image (Optional)
        </label>
        <FileUploader
          onFileSelect={(file) => handleInputChange('image', file)}
          currentFile={formData.image}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Icon name="Loader2" className="animate-spin" size={18} />
              Submitting...
            </>
          ) : (
            <>
              <Icon name="Send" size={18} />
              Submit Grievance
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default NewComplaintForm;