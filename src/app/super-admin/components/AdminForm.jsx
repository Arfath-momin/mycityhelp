import React, { useState } from 'react';
import Icon from '@/components/AppIcon';

const AdminForm = ({ admin, onClose, onSubmit, isLoading, departments = [] }) => {
  const [formData, setFormData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    password: '',
    department: admin?.department || '',
    status: admin?.status || 'active'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!admin && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (!admin && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.department) newErrors.department = 'Department is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--background)] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-modal">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
              <Icon name={admin ? 'Edit2' : 'UserPlus'} className="text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)]">
                {admin ? 'Edit Administrator' : 'Add New Administrator'}
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {admin ? 'Update administrator details' : 'Create a new department administrator'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)] rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="User" size={18} className="text-[var(--text-secondary)]" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 bg-[var(--surface)] border ${
                  errors.name ? 'border-red-500' : 'border-[var(--border)]'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]`}
                placeholder="Enter full name"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <Icon name="AlertCircle" size={14} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Mail" size={18} className="text-[var(--text-secondary)]" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 bg-[var(--surface)] border ${
                  errors.email ? 'border-red-500' : 'border-[var(--border)]'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]`}
                placeholder="Enter email address"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <Icon name="AlertCircle" size={14} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          {!admin && (
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="Lock" size={18} className="text-[var(--text-secondary)]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-2 bg-[var(--surface)] border ${
                    errors.password ? 'border-red-500' : 'border-[var(--border)]'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-secondary)] hover:text-[var(--text)]"
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <Icon name="AlertCircle" size={14} />
                  {errors.password}
                </p>
              )}
            </div>
          )}

          {/* Department Field */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2" htmlFor="department">
              Department
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="Briefcase" size={18} className="text-[var(--text-secondary)]" />
              </div>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 bg-[var(--surface)] border ${
                  errors.department ? 'border-red-500' : 'border-[var(--border)]'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]`}
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            {errors.department && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <Icon name="AlertCircle" size={14} />
                {errors.department}
              </p>
            )}
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-2">
              Status
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[var(--primary)] bg-[var(--surface)] border-[var(--border)]"
                />
                <span className="text-sm text-[var(--text)]">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[var(--primary)] bg-[var(--surface)] border-[var(--border)]"
                />
                <span className="text-sm text-[var(--text)]">Inactive</span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-end gap-3 bg-[var(--surface)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--border)] rounded-lg transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" className="animate-spin" size={18} />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Icon name={admin ? 'Save' : 'UserPlus'} size={18} />
                <span>{admin ? 'Update Administrator' : 'Add Administrator'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminForm;