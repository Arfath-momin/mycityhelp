import React from "react";
import Icon from "./AppIcon";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
          <div className="text-center p-8 max-w-md bg-[var(--surface)] rounded-2xl shadow-lg border border-[var(--border)]">
            <div className="flex justify-center items-center mb-6">
              <div className="p-4 rounded-full bg-red-50 dark:bg-red-900/10">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="48" 
                  height="48" 
                  viewBox="0 0 32 33" 
                  className="text-red-600 dark:text-red-400"
                >
                  <path 
                    d="M16 28.5C22.6274 28.5 28 23.1274 28 16.5C28 9.87258 22.6274 4.5 16 4.5C9.37258 4.5 4 9.87258 4 16.5C4 23.1274 9.37258 28.5 16 28.5Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeMiterlimit="10" 
                  />
                  <path 
                    d="M11.5 15.5C12.3284 15.5 13 14.8284 13 14C13 13.1716 12.3284 12.5 11.5 12.5C10.6716 12.5 10 13.1716 10 14C10 14.8284 10.6716 15.5 11.5 15.5Z" 
                    fill="currentColor" 
                  />
                  <path 
                    d="M20.5 15.5C21.3284 15.5 22 14.8284 22 14C22 13.1716 21.3284 12.5 20.5 12.5C19.6716 12.5 19 13.1716 19 14C19 14.8284 19.6716 15.5 20.5 15.5Z" 
                    fill="currentColor" 
                  />
                  <path 
                    d="M21 22.5C19.9625 20.7062 18.2213 19.5 16 19.5C13.7787 19.5 12.0375 20.7062 11 22.5" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-center mb-8">
              <h1 className="text-2xl font-semibold text-[var(--text)]">
                Something went wrong
              </h1>
              <p className="text-[var(--text-secondary)] text-base max-w-sm mx-auto">
                We encountered an unexpected error while processing your request. Please try again or return to the home page.
              </p>
            </div>
            <div className="flex justify-center items-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--primary-light)] font-medium py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all duration-200"
              >
                <Icon name="RotateCcw" size={18} />
                Try Again
              </button>
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="bg-[var(--primary)] text-[var(--background)] font-medium py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all duration-200 hover:bg-[var(--primary-hover)] shadow-sm"
              >
                <Icon name="Home" size={18} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;