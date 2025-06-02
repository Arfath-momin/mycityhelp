import React from 'react';
import Icon from '@/components/AppIcon';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          icon: 'Clock',
          className: 'bg-yellow-500/10 text-yellow-500'
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          icon: 'Loader',
          className: 'bg-blue-500/10 text-blue-500'
        };
      case 'resolved':
        return {
          label: 'Resolved',
          icon: 'CheckCircle',
          className: 'bg-green-500/10 text-green-500'
        };
      default:
        return {
          label: 'Unknown',
          icon: 'HelpCircle',
          className: 'bg-gray-500/10 text-gray-500'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
      <Icon name={config.icon} size={12} className={config.icon === 'Loader' ? 'animate-spin' : ''} />
      {config.label}
    </span>
  );
};

export default StatusBadge;