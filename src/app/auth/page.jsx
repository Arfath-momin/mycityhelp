'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "./components/AuthForm";
import InputField from "./components/InputField";
import SubmitButton from "./components/SubmitButton";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import Icon from "@/components/AppIcon"
import { loginUser, registerUser } from "../../services/api";

const AuthenticationScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
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

  const validateForm = () => {
    const errors = {};
    
    if (activeTab === "register" && !formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    
    if (activeTab === "register") {
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (formError) setFormError("");
  };

  const handleSendOTP = async () => {
    if (!formData.email || !validateEmail(formData.email)) {
      setFieldErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setFormError("");
    
    try {
      if (activeTab === "login") {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userData", JSON.stringify(data.user));
        
        switch (data.user.role) {
          case "user":
            router.push("/dashboard");
            break;
          case "admin":
            router.push("/admin");
            break;
          case "superadmin":
            router.push("/super-admin");
            break;
          default:
            router.push("/dashboard");
        }
      } else {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        // After successful registration, log in automatically
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const loginData = await loginResponse.json();
        
        if (!loginResponse.ok) {
          throw new Error(loginData.error || 'Auto-login failed');
        }

        localStorage.setItem("token", loginData.token);
        localStorage.setItem("userRole", "user");
        localStorage.setItem("userData", JSON.stringify(loginData.user));
        
        router.push("/dashboard");
      }
    } catch (error) {
      setFormError(error.message || "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ name: "", email: "", password: "", confirmPassword: "", otp: "" });
    setFieldErrors({});
    setFormError("");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-[var(--primary)] rounded-full flex items-center justify-center">
            <Icon name="Shield" size={32} color="white" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Grievance Portal</h1>
          <p className="text-[var(--text-secondary)]">Secure access to your complaint management system</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-sm p-8">
          {/* Tab Navigation */}
          <div className="flex mb-6 bg-[var(--surface)] rounded-lg p-1">
            <button
              onClick={() => handleTabChange("login")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "login" 
                  ? "bg-[var(--background)] text-[var(--primary)] shadow-sm" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text)]"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => handleTabChange("register")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "register" 
                  ? "bg-[var(--background)] text-[var(--primary)] shadow-sm" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text)]"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <AuthForm
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            activeTab={activeTab}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-[var(--text-secondary)]">
          <p>&copy; {new Date().getFullYear()} Grievance Portal. All rights reserved.</p>
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default AuthenticationScreen;