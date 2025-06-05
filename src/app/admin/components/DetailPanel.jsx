import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import StatusUpdateForm from './StatusUpdateForm';

const DetailPanel = ({ complaint, onClose, onStatusUpdate, isLoading }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to safely get author name
  const getAuthorName = (author) => {
    if (!author) return 'System';
    if (typeof author === 'string') return author;
    if (typeof author === 'object' && author.name) return author.name;
    return 'Unknown';
  };

  return (
    <div className="w-full lg:w-1/3 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Complaint Details</h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
        >
          <Icon name="X" size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">{complaint.title}</h4>
          <div className="flex items-center space-x-4 mb-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
              {complaint.status.replace('-', ' ')}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
              {complaint.priority} priority
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h5 className="text-sm font-medium text-gray-900 mb-2">Description</h5>
          <p className="text-sm text-gray-600 whitespace-pre-line">{complaint.description}</p>
        </div>

        {/* Image */}
        {complaint.image && (
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Attached Image</h5>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={complaint.image}
                alt="Complaint evidence"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        )}

        {/* Location */}
        <div>
          <h5 className="text-sm font-medium text-gray-900 mb-2">Location</h5>
          <p className="text-sm text-gray-600 mb-3">{complaint.location}</p>
          <div className="rounded-lg overflow-hidden border border-gray-200 h-48">
            {complaint.coordinates?.lat && complaint.coordinates?.lng ? (
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title={complaint.location}
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${complaint.coordinates.lat},${complaint.coordinates.lng}&z=14&output=embed`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <Icon name="MapPin" size={24} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No coordinates available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Complaint Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-1">Submitted By</h5>
            <p className="text-sm text-gray-600">
              {typeof complaint.submittedBy === 'object' 
                ? complaint.submittedBy.name 
                : complaint.submittedBy || 'Anonymous'}
            </p>
            {typeof complaint.submittedBy === 'object' && complaint.submittedBy.email && (
              <p className="text-xs text-gray-500 mt-1">{complaint.submittedBy.email}</p>
            )}
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-1">Category</h5>
            <p className="text-sm text-gray-600">{complaint.category}</p>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-1">Date Submitted</h5>
            <p className="text-sm text-gray-600">{formatDate(complaint.submittedDate)}</p>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-1">Complaint ID</h5>
            <p className="text-sm text-gray-600">
              {complaint.trackingId}
            </p>
          </div>
        </div>

        {/* Status Update Form */}
        <StatusUpdateForm
          complaint={complaint}
          onStatusUpdate={onStatusUpdate}
          isLoading={isLoading}
        />

        {/* Notes History */}
        <div>
          <h5 className="text-sm font-medium text-gray-900 mb-3">Admin Notes</h5>
          {Array.isArray(complaint.notes) && complaint.notes.length > 0 ? (
            <div className="space-y-3">
              {complaint.notes.map((note, index) => (
                <div key={note._id || index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-900">
                      {getAuthorName(note.author)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(note.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{note.content}</p>
                  {note.isPublic && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                      <Icon name="Eye" size={12} className="mr-1" />
                      Public
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No notes added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;