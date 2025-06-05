'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Icon from '@/components/AppIcon';
import StatusBadge from './StatusBadge';

const ComplaintList = ({ complaints = [], isLoading, onComplaintClick }) => {
  const [expandedComplaint, setExpandedComplaint] = useState(null);

  // Ensure complaints is an array
  const complaintsList = Array.isArray(complaints) ? complaints : [];

  const toggleExpanded = (complaintId) => {
    setExpandedComplaint(expandedComplaint === complaintId ? null : complaintId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Clock';
      case 'in progress':
        return 'RefreshCw';
      case 'resolved':
        return 'CheckCircle';
      case 'rejected':
        return 'XCircle';
      default:
        return 'HelpCircle';
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 animate-pulse">
            <div className="h-4 bg-[var(--border)] rounded w-1/4 mb-4" />
            <div className="h-4 bg-[var(--border)] rounded w-3/4 mb-2" />
            <div className="h-4 bg-[var(--border)] rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!complaintsList.length) {
    return (
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-8 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
            <Icon name="Inbox" size={32} className="text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text)]">No Grievances Found</h3>
            <p className="text-[var(--text-secondary)] mt-1">
              You haven't submitted any grievances yet
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaintsList.map((complaint) => (
        <button
          key={complaint.trackingId || complaint._id}
          onClick={() => onComplaintClick(complaint)}
          className="w-full bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6 text-left transition-all duration-200 hover:shadow-lg hover:border-[var(--primary-light)] group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-[var(--text)] truncate group-hover:text-[var(--primary)] transition-colors">
                  {complaint.title}
                </h3>
                <StatusBadge status={complaint.status} />
              </div>
              <p className="text-[var(--text-secondary)] mb-4 line-clamp-2">
                {complaint.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <Icon name="Hash" size={14} />
                  {complaint.trackingId}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Calendar" size={14} />
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Tag" size={14} />
                  {complaint.category}
                </span>
                {complaint.department && (
                  <span className="flex items-center gap-1">
                    <Icon name="Briefcase" size={14} />
                    {complaint.department}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center self-center">
              <div className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group-hover:bg-[var(--primary-light)] group-hover:border-[var(--primary-light)] transition-colors">
                <Icon 
                  name="ChevronRight" 
                  size={18} 
                  className="text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-colors" 
                />
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ComplaintList;