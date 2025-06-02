import React from 'react';
import Icon from '@/components/AppIcon';

const AnalyticsCard = ({ title, value = 0, icon, color, isLoading }) => {
  const getIconColor = (bgColor) => {
    switch (bgColor) {
      case 'bg-blue-500':
        return 'text-blue-500';
      case 'bg-green-500':
        return 'text-green-500';
      case 'bg-yellow-500':
        return 'text-yellow-500';
      case 'bg-red-500':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-[var(--background)] rounded-lg border border-[var(--border)] p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 ${color} bg-opacity-15 rounded-lg flex items-center justify-center`}>
              <Icon name={icon} size={20} className={getIconColor(color)} />
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
          </div>
          <p className="text-2xl font-bold text-[var(--text)]">
            {isLoading ? (
              <span className="inline-block w-16 h-8 bg-[var(--surface)] rounded animate-pulse" />
            ) : (
              value.toLocaleString()
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const AnalyticsCards = ({ data, isLoading }) => {
  const cards = [
    {
      title: 'Total Grievances',
      value: data?.totalGrievances ?? 0,
      icon: 'FileText',
      color: 'bg-blue-500'
    },
    {
      title: 'Resolved',
      value: data?.resolvedGrievances ?? 0,
      icon: 'CheckCircle',
      color: 'bg-green-500'
    },
    {
      title: 'In Progress',
      value: data?.inProgressGrievances ?? 0,
      icon: 'Clock',
      color: 'bg-yellow-500'
    },
    {
      title: 'Pending',
      value: data?.pendingGrievances ?? 0,
      icon: 'AlertCircle',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <AnalyticsCard key={index} {...card} isLoading={isLoading} />
      ))}
    </div>
  );
};

export default AnalyticsCards; 