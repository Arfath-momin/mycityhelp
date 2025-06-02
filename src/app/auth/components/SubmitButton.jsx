import React from "react";
import Icon from "@/components/AppIcon";

const SubmitButton = ({ isLoading, text, loadingText }) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg
        bg-[var(--primary)] hover:bg-[var(--primary-hover)]
        text-white font-medium transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin"></div>
          {loadingText}
        </>
      ) : (
        <>
          <Icon name="LogIn" size={20} color="white" />
          {text}
        </>
      )}
    </button>
  );
};

export default SubmitButton;