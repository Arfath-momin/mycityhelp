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
    confirmPassword: ""
  });
  const [fieldErrors, setFieldErrors] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setFormError("");
    
    try {
      if (activeTab === "login") {
        const { token, user } = await loginUser({
          email: formData.email,
          password: formData.password
        });

        // Store token and user info
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userData", JSON.stringify(user));
        
        // Redirect based on role
        switch (user.role) {
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
        const user = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        // After registration, automatically log in
        const { token } = await loginUser({
          email: formData.email,
          password: formData.password
        });

        localStorage.setItem("token", token);
        localStorage.setItem("userRole", "user");
        localStorage.setItem("userData", JSON.stringify(user));
        
        router.push("/user-dashboard");
      }
    } catch (error) {
      setFormError(error.message || "An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setFieldErrors({});
    setFormError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Shield" size={32} color="white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Grievance Portal</h1>
          <p className="text-text-secondary">Secure access to your complaint management system</p>
        </div>

        {/* Auth Card */}
        <div className="card p-8">
          {/* Tab Navigation */}
          <div className="flex mb-6 bg-surface rounded-lg p-1">
            <button
              onClick={() => handleTabChange("login")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "login" ?"bg-white text-primary shadow-sm" :"text-text-secondary hover:text-text-primary"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => handleTabChange("register")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "register" ?"bg-white text-primary shadow-sm" :"text-text-secondary hover:text-text-primary"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <AuthForm onSubmit={handleSubmit}>
            {activeTab === "register" && (
              <InputField
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(value) => handleInputChange("name", value)}
                error={fieldErrors.name}
                placeholder="Enter your full name"
                icon="User"
                required
              />
            )}

            <InputField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              error={fieldErrors.email}
              placeholder="Enter your email address"
              icon="Mail"
              required
            />

            <InputField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(value) => handleInputChange("password", value)}
              error={fieldErrors.password}
              placeholder="Enter your password"
              icon="Lock"
              required
            />

            {activeTab === "register" && (
              <InputField
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(value) => handleInputChange("confirmPassword", value)}
                error={fieldErrors.confirmPassword}
                placeholder="Confirm your password"
                icon="Lock"
                required
              />
            )}

            {formError && <ErrorMessage message={formError} />}

            <SubmitButton
              isLoading={isLoading}
              text={activeTab === "login" ? "Sign In" : "Create Account"}
              loadingText={activeTab === "login" ? "Signing In..." : "Creating Account..."}
            />
          </AuthForm>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-text-tertiary">
          <p>&copy; {new Date().getFullYear()} Grievance Portal. All rights reserved.</p>
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default AuthenticationScreen;