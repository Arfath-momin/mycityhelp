import React from 'react';
import Icon from '@/components/AppIcon';

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase()?.trim() || 'unknown';

  const statusConfig = {
    'pending': {
      color: 'bg-yellow-100 text-yellow-800',
      icon: 'Clock'
    },
    'in-progress': {
      color: 'bg-blue-100 text-blue-800',
      icon: 'Loader'
    },
    'in progress': {
      color: 'bg-blue-100 text-blue-800',
      icon: 'Loader'
    },
    'resolved': {
      color: 'bg-green-100 text-green-800',
      icon: 'CheckCircle'
    },
    'rejected': {
      color: 'bg-red-100 text-red-800',
      icon: 'XCircle'
    },
    'unknown': {
      color: 'bg-gray-100 text-gray-800',
      icon: 'HelpCircle'
    }
  };

  const config = statusConfig[normalizedStatus] || statusConfig.unknown;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon name={config.icon} size={12} className="animate-spin-slow" />
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;