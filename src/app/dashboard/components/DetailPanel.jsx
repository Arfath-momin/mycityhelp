import React from 'react';
import Icon from '../../../components/AppIcon';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';

const DetailPanel = ({ complaint, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Complaint Details</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Status and Date */}
              <div className="flex items-center justify-between">
                <StatusBadge status={complaint.status} />
                <span className="text-sm text-gray-500">
                  Submitted on {format(new Date(complaint.submittedDate), 'MMM d, yyyy')}
                </span>
              </div>

              {/* Title and Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{complaint.title}</h3>
                <p className="text-gray-600 whitespace-pre-line">{complaint.description}</p>
              </div>

              {/* Category and Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <p className="mt-1 text-gray-900">{complaint.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="mt-1 text-gray-900">{complaint.location}</p>
                </div>
              </div>

              {/* Image */}
              {complaint.image && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">
                    Attached Image
                  </label>
                  <img
                    src={complaint.image}
                    alt="Complaint"
                    className="w-full max-w-lg rounded-lg"
                  />
                </div>
              )}

              {/* Updates */}
              {complaint.notes && complaint.notes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Updates</h4>
                  <div className="space-y-4">
                    {complaint.notes.map((note, index) => (
                      <div
                        key={note.id || index}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {note.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(note.timestamp), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="text-gray-600">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel; 