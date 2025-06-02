import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusBadge = ({ status, size = 'default', showIcon = true }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          color: 'bg-warning-light text-yellow-800 border-yellow-200',
          icon: 'Clock',
          iconColor: '#F59E0B'
        };
      case 'in progress':
        return {
          color: 'bg-info-light text-blue-800 border-blue-200',
          icon: 'RefreshCw',
          iconColor: '#0EA5E9'
        };
      case 'resolved':
        return {
          color: 'bg-success-light text-green-800 border-green-200',
          icon: 'CheckCircle',
          iconColor: '#16A34A'
        };
      case 'rejected':
        return {
          color: 'bg-error-light text-red-800 border-red-200',
          icon: 'XCircle',
          iconColor: '#DC2626'
        };
      case 'on hold':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: 'Pause',
          iconColor: '#6B7280'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: 'HelpCircle',
          iconColor: '#6B7280'
        };
    }
  };

  const config = getStatusConfig(status);
  
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    default: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    small: 12,
    default: 14,
    large: 16
  };

  return (
    <span className={`inline-flex items-center space-x-1 rounded-full border font-medium ${config.color} ${sizeClasses[size]}`}>
      {showIcon && (
        <Icon 
          name={config.icon} 
          size={iconSizes[size]} 
          color={config.iconColor}
        />
      )}
      <span className="capitalize">{status}</span>
    </span>
  );
};

export default StatusBadge;