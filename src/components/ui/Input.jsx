import React, { useState, forwardRef } from 'react';
import Icon from '../AppIcon';

const Input = forwardRef(({
  type = 'text',
  label = '',
  placeholder = '',
  value = '',
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  disabled = false,
  required = false,
  error = '',
  success = false,
  helperText = '',
  icon = null,
  iconPosition = 'left',
  clearable = false,
  showPasswordToggle = false,
  rows = 4,
  className = '',
  inputClassName = '',
  id = '',
  name = '',
  autoComplete = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isTextarea = type === 'textarea';
  const actualType = type === 'password' && showPassword ? 'text' : type;

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur(e);
  };

  const handleClear = () => {
    onChange({ target: { value: '', name } });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const baseInputClasses = `
    block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
    focus:outline-none focus:ring-1 transition-colors
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : success ?'border-green-300 focus:border-green-500 focus:ring-green-500': 'border-gray-300 focus:border-primary focus:ring-primary'}
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${(icon && iconPosition === 'right') || clearable || showPasswordToggle ? 'pr-10' : ''}
    ${inputClassName}
  `.trim();

  const InputComponent = isTextarea ? 'textarea' : 'input';

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className={`block text-sm font-medium ${
            error ? 'text-red-700' : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon 
              name={icon} 
              size={16} 
              className={`${error ? 'text-red-400' : success ? 'text-green-400' : 'text-gray-400'}`}
            />
          </div>
        )}

        {/* Input field */}
        <InputComponent
          ref={ref}
          id={inputId}
          name={name}
          type={isTextarea ? undefined : actualType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          rows={isTextarea ? rows : undefined}
          className={baseInputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : 
            helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />

        {/* Right side icons */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
          {/* Clear button */}
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Clear input"
            >
              <Icon name="X" size={16} />
            </button>
          )}

          {/* Password toggle */}
          {type === 'password' && showPasswordToggle && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          )}

          {/* Right icon */}
          {icon && iconPosition === 'right' && !clearable && !showPasswordToggle && (
            <Icon 
              name={icon} 
              size={16} 
              className={`${error ? 'text-red-400' : success ? 'text-green-400' : 'text-gray-400'}`}
            />
          )}

          {/* Success icon */}
          {success && !icon && (
            <Icon name="Check" size={16} className="text-green-400" />
          )}
        </div>
      </div>

      {/* Helper text or error message */}
      {(error || helperText) && (
        <p 
          id={error ? `${inputId}-error` : `${inputId}-helper`}
          className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}
        >
          {error || helperText}
        </p>
      )}

      {/* Focus indicator for accessibility */}
      {isFocused && (
        <div className="sr-only" aria-live="polite">
          {label || placeholder} field is focused
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;