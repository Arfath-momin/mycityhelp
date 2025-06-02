import React from "react";
import Icon from "@/components/AppIcon";

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-error-light border border-error border-opacity-20 rounded-lg p-4 flex items-start gap-3">
      <Icon name="AlertTriangle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-sm font-medium text-error mb-1">Authentication Error</h4>
        <p className="text-sm text-error">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;