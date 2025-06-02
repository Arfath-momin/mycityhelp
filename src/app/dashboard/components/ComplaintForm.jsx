'use client'
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import FileUploader from './FileUploader';

const ComplaintForm = ({ categories, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    imageUrl: null,
    department: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      imageUrl
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const grievanceData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        image: formData.imageUrl,
        department: formData.department,
        priority: formData.priority
      };

      const result = await onSubmit(grievanceData);
      
      if (result.success) {
        setShowSuccess(true);
        setFormData({
          title: '',
          description: '',
          category: '',
          location: '',
          imageUrl: null,
          department: '',
          priority: 'medium'
        });
        
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      imageUrl: null,
      department: '',
      priority: 'medium'
    });
    setErrors({});
    setShowSuccess(false);
  };

  const getDepartmentForCategory = (category) => {
    switch (category) {
      case 'Infrastructure':
      case 'Roads':
        return 'Public Works';
      case 'Water Supply':
        return 'Water Department';
      case 'Electricity':
        return 'Electricity Department';
      case 'Sanitation':
        return 'Sanitation Department';
      case 'Environment':
        return 'Environmental Department';
      default:
        return 'General Administration';
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setFormData(prev => ({
      ...prev,
      category,
      department: getDepartmentForCategory(category)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {showSuccess && (
        <div className="bg-success-light border border-green-200 rounded-md p-4 flex items-center space-x-3">
          <Icon name="CheckCircle" size={20} color="var(--color-success)" />
          <p className="text-success font-medium">Complaint submitted successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Complaint Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a brief title for your complaint"
            className={`input ${errors.title ? 'input-error' : ''}`}
            maxLength={100}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-error flex items-center space-x-1">
              <Icon name="AlertCircle" size={16} />
              <span>{errors.title}</span>
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.title.length}/100 characters
          </p>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            className={`input ${errors.category ? 'input-error' : ''}`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-error flex items-center space-x-1">
              <Icon name="AlertCircle" size={16} />
              <span>{errors.category}</span>
            </p>
          )}
        </div>

        <input
          type="hidden"
          name="department"
          value={formData.department}
        />

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="input"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter the location of the issue"
            className={`input ${errors.location ? 'input-error' : ''}`}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-error flex items-center space-x-1">
              <Icon name="AlertCircle" size={16} />
              <span>{errors.location}</span>
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide a detailed description of the issue"
            rows={4}
            className={`input resize-none ${errors.description ? 'input-error' : ''}`}
            maxLength={1000}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error flex items-center space-x-1">
              <Icon name="AlertCircle" size={16} />
              <span>{errors.description}</span>
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/1000 characters
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image (Optional)
          </label>
          <FileUploader
            onFileUpload={handleImageUpload}
            currentImage={formData.imageUrl}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={resetForm}
          className="btn btn-outline flex items-center space-x-2"
          disabled={isSubmitting}
        >
          <Icon name="RotateCcw" size={16} />
          <span>Reset</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary flex items-center space-x-2 min-w-32"
        >
          {isSubmitting ? (
            <>
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Icon name="Send" size={16} />
              <span>Submit Complaint</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ComplaintForm;