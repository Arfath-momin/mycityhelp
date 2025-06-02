import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-[var(--gray-900)]/50 flex items-center justify-center z-50">
      <div className="bg-[var(--background)] rounded-lg p-6 flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-[var(--primary)] border-opacity-30 border-t-[var(--primary)] rounded-full animate-spin"></div>
        <span className="text-[var(--text)] font-medium">Processing...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;