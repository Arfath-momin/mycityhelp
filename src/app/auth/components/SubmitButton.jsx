import React from "react";
import Icon from "@/components/AppIcon";

const SubmitButton = ({ isLoading, text, loadingText }) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="btn btn-primary w-full flex items-center justify-center gap-2 py-3"
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin"></div>
          {loadingText}
        </>
      ) : (
        <>
          <Icon name="LogIn" size={20} />
          {text}
        </>
      )}
    </button>
  );
};

export default SubmitButton;