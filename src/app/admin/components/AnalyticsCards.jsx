import React from 'react';
import Icon from '../../../components/AppIcon';

const AnalyticsCards = ({ data }) => {
  const formatPercentage = (value) => {
    const rounded = Math.round(value * 10) / 10;
    return `${rounded >= 0 ? '+' : ''}${rounded}%`;
  };

  const cards = [
    {
      title: 'Total Complaints',
      value: data.totalComplaints,
      icon: 'FileText',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: formatPercentage(data.percentageChanges?.totalGrievances || 0),
      changeType: (data.percentageChanges?.totalGrievances || 0) >= 0 ? 'increase' : 'decrease'
    },
    {
      title: 'Resolved',
      value: data.resolvedComplaints,
      icon: 'CheckCircle',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: formatPercentage(data.percentageChanges?.resolvedGrievances || 0),
      changeType: (data.percentageChanges?.resolvedGrievances || 0) >= 0 ? 'increase' : 'decrease'
    },
    {
      title: 'In Progress',
      value: data.inProgressComplaints,
      icon: 'Clock',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: formatPercentage(data.percentageChanges?.inProgressGrievances || 0),
      changeType: (data.percentageChanges?.inProgressGrievances || 0) >= 0 ? 'increase' : 'decrease'
    },
    {
      title: 'Pending',
      value: data.pendingComplaints,
      icon: 'AlertCircle',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: formatPercentage(data.percentageChanges?.pendingGrievances || 0),
      changeType: (data.percentageChanges?.pendingGrievances || 0) >= 0 ? 'increase' : 'decrease'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-full ${card.bgColor}`}>
              <Icon name={card.icon} size={24} className={card.color} />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${
              card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {card.change}
            </span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;