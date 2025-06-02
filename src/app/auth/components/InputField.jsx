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
      <label className="block text-sm font-medium text-[var(--text)]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon 
              name={icon} 
              size={20} 
              color={error ? "#EF4444" : isFocused ? "var(--primary)" : "var(--text-secondary)"} 
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
          className={`w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg 
            ${icon ? "pl-10" : ""} ${type === "password" ? "pr-10" : ""}
            ${error ? "border-red-500 focus:border-red-500" : "focus:border-[var(--primary)]"}
            text-[var(--text)] placeholder-[var(--text-secondary)]
            focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]
            transition-colors duration-200`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${label}-error` : undefined}
        />
        
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-secondary)] hover:text-[var(--text)]"
            tabIndex={-1}
          >
            <Icon 
              name={showPassword ? "EyeOff" : "Eye"} 
              size={20} 
              color="currentColor"
            />
          </button>
        )}
      </div>
      
      {error && (
        <p id={`${label}-error`} className="text-sm text-red-500 flex items-center gap-1">
          <Icon name="AlertCircle" size={16} color="#EF4444" />
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;