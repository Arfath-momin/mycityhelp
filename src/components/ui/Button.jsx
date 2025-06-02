import React from 'react';
import Icon from '../AppIcon';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  onClick = () => {},
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    link: 'text-primary hover:text-primary-700 underline-offset-4 hover:underline focus:ring-primary-500',
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-base',
  };

  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 16,
    lg: 18,
    xl: 20,
  };

  const handleClick = (e) => {
    if (!disabled && !loading) {
      onClick(e);
    }
  };

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  const iconSize = iconSizes[size];
  const showIcon = icon && !loading;
  const showLoadingIcon = loading;

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={buttonClasses}
      aria-disabled={disabled || loading}
      {...props}
    >
      {/* Loading spinner */}
      {showLoadingIcon && (
        <Icon 
          name="Loader2" 
          size={iconSize} 
          className="animate-spin mr-2" 
        />
      )}

      {/* Left icon */}
      {showIcon && iconPosition === 'left' && (
        <Icon 
          name={icon} 
          size={iconSize} 
          className={children ? 'mr-2' : ''} 
        />
      )}

      {/* Button text */}
      {children && (
        <span className={loading ? 'opacity-70' : ''}>
          {children}
        </span>
      )}

      {/* Right icon */}
      {showIcon && iconPosition === 'right' && (
        <Icon 
          name={icon} 
          size={iconSize} 
          className={children ? 'ml-2' : ''} 
        />
      )}
    </button>
  );
};

export default Button;