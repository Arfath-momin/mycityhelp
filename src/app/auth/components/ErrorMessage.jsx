import React from "react";
import Icon from "@/components/AppIcon";

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
      <Icon name="AlertTriangle" size={20} color="#EF4444" className="flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Authentication Error</h4>
        <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;