import React from 'react';
import Icon from '../../../components/AppIcon';

const AnalyticsCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
        <Icon name={icon} size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const AnalyticsCards = ({ data }) => {
  const cards = [
    {
      title: 'Total Grievances',
      value: data.totalGrievances,
      icon: 'FileText',
      color: 'bg-primary'
    },
    {
      title: 'Resolved',
      value: data.resolvedGrievances,
      icon: 'CheckCircle',
      color: 'bg-success'
    },
    {
      title: 'In Progress',
      value: data.inProgressGrievances,
      icon: 'Clock',
      color: 'bg-warning'
    },
    {
      title: 'Pending',
      value: data.pendingGrievances,
      icon: 'AlertCircle',
      color: 'bg-error'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <AnalyticsCard key={index} {...card} />
      ))}
    </div>
  );
};

export default AnalyticsCards; 