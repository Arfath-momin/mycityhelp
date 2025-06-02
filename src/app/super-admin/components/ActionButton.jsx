import React from 'react';
import Icon from '../../../components/AppIcon';

const ActionButton = ({ 
  icon, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  children,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    danger: 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500',
    success: 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500',
    warning: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-yellow-500'
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classes}
      type="button"
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 20} />}
      {children && <span className={icon ? 'ml-2' : ''}>{children}</span>}
    </button>
  );
};

export default ActionButton;