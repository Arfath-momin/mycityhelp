import React from 'react';
import Icon from '../AppIcon';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  shadow = 'sm',
  border = true,
  hover = false,
  onClick = null,
  className = '',
  header = null,
  footer = null,
  loading = false,
  ...props
}) => {
  const isInteractive = onClick || hover;

  const baseClasses = 'bg-white rounded-lg transition-all duration-200';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const variantClasses = {
    default: '',
    interactive: 'cursor-pointer hover:shadow-md',
    complaint: 'border-l-4 border-l-primary',
    statistic: 'text-center',
    admin: 'border border-gray-200',
    success: 'border-l-4 border-l-green-500 bg-green-50',
    warning: 'border-l-4 border-l-amber-500 bg-amber-50',
    error: 'border-l-4 border-l-red-500 bg-red-50',
    info: 'border-l-4 border-l-blue-500 bg-blue-50',
  };

  const cardClasses = `
    ${baseClasses}
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${border ? 'border border-gray-200' : ''}
    ${variantClasses[variant]}
    ${isInteractive ? 'cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2' : ''}
    ${className}
  `.trim();

  const handleClick = (e) => {
    if (onClick && !loading) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick(e);
    }
  };

  const CardComponent = onClick ? 'button' : 'div';

  if (loading) {
    return (
      <div className={cardClasses}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <CardComponent
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-pressed={onClick ? false : undefined}
      {...props}
    >
      {/* Header */}
      {header && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          {header}
        </div>
      )}

      {/* Main content */}
      <div className={header || footer ? 'flex-1' : ''}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </CardComponent>
  );
};

// Specialized card components
const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  loading = false,
  className = '',
  ...props 
}) => {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  };

  const changeIcons = {
    positive: 'TrendingUp',
    negative: 'TrendingDown',
    neutral: 'Minus',
  };

  if (loading) {
    return (
      <Card variant="statistic" className={className} loading={true} {...props} />
    );
  }

  return (
    <Card variant="statistic" className={className} {...props}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {icon && (
          <div className="p-2 bg-primary-100 rounded-lg">
            <Icon name={icon} size={20} className="text-primary" />
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {change && (
        <div className={`flex items-center text-sm ${changeColors[changeType]}`}>
          <Icon name={changeIcons[changeType]} size={16} className="mr-1" />
          <span>{change}</span>
        </div>
      )}
    </Card>
  );
};

const ComplaintCard = ({ 
  complaint, 
  onClick,
  showActions = true,
  className = '',
  ...props 
}) => {
  const statusColors = {
    pending: 'bg-amber-100 text-amber-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const priorityColors = {
    low: 'text-gray-600',
    medium: 'text-amber-600',
    high: 'text-red-600',
  };

  return (
    <Card 
      variant="complaint" 
      onClick={onClick}
      className={className}
      {...props}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {complaint.title}
          </h3>
          <p className="text-sm text-gray-600">
            ID: {complaint.id} • {complaint.category}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[complaint.status]}`}>
          {complaint.status}
        </span>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">
        {complaint.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Submitted: {complaint.submittedDate}</span>
          <span className={`font-medium ${priorityColors[complaint.priority]}`}>
            {complaint.priority} priority
          </span>
        </div>
        {showActions && (
          <Icon name="ChevronRight" size={16} />
        )}
      </div>
    </Card>
  );
};

Card.Stat = StatCard;
Card.Complaint = ComplaintCard;

export default Card;