'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Icon from '@/components/AppIcon';
import StatusBadge from './StatusBadge';

const ComplaintList = ({ complaints = [], isLoading }) => {
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
        {[...Array(3)].map((_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!complaintsList.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="FileText" size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
        <p className="text-gray-500 mb-6">
          You haven't submitted any complaints yet, or no complaints match your current filters.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="btn btn-primary"
        >
          Submit Your First Complaint
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaintsList.map((complaint) => {
        if (!complaint) return null;
        
        return (
          <div
            key={complaint._id || Math.random().toString()}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            {/* Complaint Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                  {complaint.title || 'Untitled Complaint'}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span>Submitted: {formatDate(complaint.createdAt)}</span>
                  </div>
                  {complaint.location && (
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={14} />
                      <span>{complaint.location}</span>
                    </div>
                  )}
                  {complaint.category && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Tag" size={14} />
                      <span>{complaint.category}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3 ml-4">
                <StatusBadge status={complaint.status} />
                <button
                  onClick={() => toggleExpanded(complaint._id)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={expandedComplaint === complaint._id ? 'Collapse details' : 'Expand details'}
                >
                  <Icon 
                    name={expandedComplaint === complaint._id ? 'ChevronUp' : 'ChevronDown'} 
                    size={20} 
                  />
                </button>
              </div>
            </div>

            {/* Complaint Preview */}
            <div className="mb-4">
              <p className="text-gray-700 line-clamp-2">
                {complaint.description || 'No description provided'}
              </p>
            </div>

            {/* Expanded Details */}
            {expandedComplaint === complaint._id && (
              <div className="border-t border-gray-200 pt-4 space-y-4">
                {/* Full Description */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Full Description</h5>
                  <div className="bg-gray-50 rounded-md p-3">
                    <p className="text-gray-700 whitespace-pre-line">
                      {complaint.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* Image */}
                {complaint.imageUrl && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Attached Image</h5>
                    <div className="w-full max-w-md">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                        <Image
                          src={complaint.imageUrl}
                          alt={`Image for ${complaint.title || 'complaint'}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Timeline */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Status Timeline</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-600">
                        Submitted on {formatDate(complaint.createdAt)}
                      </span>
                    </div>
                    {complaint.updatedAt && complaint.updatedAt !== complaint.createdAt && (
                      <div className="flex items-center space-x-3 text-sm">
                        <div className={`w-2 h-2 rounded-full ${
                          complaint.status === 'resolved' ? 'bg-green-500' : 
                          complaint.status === 'in progress' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-gray-600">
                          Last updated on {formatDate(complaint.updatedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Response */}
                {complaint.adminResponse && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Admin Response</h5>
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <div className="flex items-start space-x-2">
                        <Icon name="MessageSquare" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-blue-800 text-sm">{complaint.adminResponse}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Complaint ID: {complaint._id || 'N/A'}
                  </div>
                  <div className="flex items-center space-x-2">
                    {complaint.status === 'resolved' && (
                      <button className="text-sm text-primary hover:text-primary-700 font-medium">
                        Rate Resolution
                      </button>
                    )}
                    <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ComplaintList;