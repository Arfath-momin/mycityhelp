import React, { useState } from "react";
import Icon from "@/components/AppIcon";

const AuthForm = ({ onSubmit, isLoading, activeTab, formError }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: ""
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSendOTP = async () => {
    if (!formData.email || !validateEmail(formData.email)) {
      setFieldErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      return;
    }

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();
      
      if (response.ok) {
        setOtpSent(true);
        setFieldErrors({});
      } else {
        setFieldErrors(prev => ({ ...prev, email: data.error }));
      }
    } catch (error) {
      setFieldErrors(prev => ({ ...prev, email: "Failed to send OTP" }));
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setFieldErrors(prev => ({ ...prev, otp: "Please enter the OTP" }));
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          otp: formData.otp
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setOtpVerified(true);
        setFieldErrors({});
      } else {
        setFieldErrors(prev => ({ ...prev, otp: data.error }));
      }
    } catch (error) {
      setFieldErrors(prev => ({ ...prev, otp: "Failed to verify OTP" }));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const errors = {};
    if (activeTab === "register") {
      if (!formData.name?.trim()) {
        errors.name = "Name is required";
      }
      if (!otpVerified) {
        errors.otp = "Please verify your email first";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }
    if (!formData.email?.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password?.trim()) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Call the parent's onSubmit handler
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display general form errors */}
      {formError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <Icon name="AlertCircle" size={18} className="text-red-500" />
            <p className="text-red-700 text-sm font-medium">{formError}</p>
          </div>
        </div>
      )}

      {activeTab === "register" && (
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="User" size={18} className="text-[var(--text-secondary)]" />
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
              placeholder="Enter your name"
            />
          </div>
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <Icon name="AlertCircle" size={14} />
              {fieldErrors.name}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Mail" size={18} className="text-[var(--text-secondary)]" />
          </div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
            placeholder="Enter your email"
            disabled={otpVerified}
          />
          {activeTab === "register" && !otpSent && !otpVerified && (
            <button
              type="button"
              onClick={handleSendOTP}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[var(--primary)] text-white rounded-md text-sm hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
            >
              Send OTP
            </button>
          )}
        </div>
        {fieldErrors.email && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <Icon name="AlertCircle" size={14} />
            {fieldErrors.email}
          </p>
        )}
      </div>

      {activeTab === "register" && otpSent && !otpVerified && (
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Verification Code
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Key" size={18} className="text-[var(--text-secondary)]" />
            </div>
            <input
              type="text"
              value={formData.otp}
              onChange={(e) => handleInputChange('otp', e.target.value)}
              className="w-full pl-10 pr-20 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)] font-mono tracking-wider"
              placeholder="Enter OTP"
              maxLength={6}
            />
            <button
              type="button"
              onClick={handleVerifyOTP}
              disabled={isVerifying}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[var(--primary)] text-white rounded-md text-sm hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
            >
              {isVerifying ? (
                <Icon name="Loader" size={18} className="animate-spin" />
              ) : (
                'Verify'
              )}
            </button>
          </div>
          {fieldErrors.otp && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <Icon name="AlertCircle" size={14} />
              {fieldErrors.otp}
            </p>
          )}
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleSendOTP}
              className="text-[var(--primary)] hover:underline"
            >
              Resend OTP
            </button>
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Lock" size={18} className="text-[var(--text-secondary)]" />
          </div>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
            placeholder="Enter your password"
          />
        </div>
        {fieldErrors.password && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <Icon name="AlertCircle" size={14} />
            {fieldErrors.password}
          </p>
        )}
      </div>

      {activeTab === "register" && (
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="Lock" size={18} className="text-[var(--text-secondary)]" />
            </div>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
              placeholder="Confirm your password"
            />
          </div>
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <Icon name="AlertCircle" size={14} />
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || (activeTab === "register" && !otpVerified)}
        className="w-full bg-[var(--primary)] text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Icon name="Loader" size={20} className="animate-spin mr-2" />
            {activeTab === "login" ? "Signing in..." : "Registering..."}
          </span>
        ) : (
          <>{activeTab === "login" ? "Sign In" : "Register"}</>
        )}
      </button>
    </form>
  );
};

export default AuthForm;