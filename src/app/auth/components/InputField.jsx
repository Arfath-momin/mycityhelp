import React, { useState } from "react";
import Icon from "@/components/AppIcon";

const InputField = ({ 
  label, 
  type, 
  value, 
  onChange, 
  error, 
  placeholder, 
  icon, 
  required = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon 
              name={icon} 
              size={20} 
              color={error ? "var(--color-error)" : isFocused ? "var(--color-primary)" : "var(--color-text-tertiary)"} 
            />
          </div>
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`input ${icon ? "pl-10" : ""} ${type === "password" ? "pr-10" : ""} ${
            error ? "input-error" : ""
          } transition-colors duration-200`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${label}-error` : undefined}
        />
        
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            tabIndex={-1}
          >
            <Icon 
              name={showPassword ? "EyeOff" : "Eye"} 
              size={20} 
              color="var(--color-text-tertiary)" 
            />
          </button>
        )}
      </div>
      
      {error && (
        <p id={`${label}-error`} className="text-sm text-error flex items-center gap-1">
          <Icon name="AlertCircle" size={16} />
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;