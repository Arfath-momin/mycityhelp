import React from 'react';
import Icon from '../../../components/AppIcon';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';

const DetailPanel = ({ complaint, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[var(--background)] w-full max-w-4xl rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[var(--border)]">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text)]">Complaint Details</h2>
            <p className="mt-1 text-[var(--text-secondary)]">View detailed information about this complaint</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--surface)] rounded-full transition-colors"
          >
            <Icon name="X" size={20} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Top Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Tracking ID */}
                <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="Hash" size={18} className="text-[var(--primary)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)]">Tracking ID</span>
                    </div>
                    <button 
                      onClick={() => navigator.clipboard.writeText(complaint._id || complaint.id)}
                      className="p-1.5 hover:bg-[var(--background)] rounded-lg transition-colors group"
                      title="Copy Tracking ID"
                    >
                      <Icon name="Copy" size={14} className="text-[var(--text-secondary)] group-hover:text-[var(--primary)]" />
                    </button>
                  </div>
                  <p className="mt-1 text-lg font-mono font-medium text-[var(--text)]">{complaint._id || complaint.id}</p>
                </div>

                {/* Status */}
                <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Activity" size={18} className="text-[var(--primary)]" />
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Current Status</span>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Category & Department */}
                <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Tag" size={16} className="text-[var(--primary)]" />
                        <span className="text-sm font-medium text-[var(--text-secondary)]">Category</span>
                      </div>
                      <p className="text-[var(--text)]">{complaint.category}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Briefcase" size={16} className="text-[var(--primary)]" />
                        <span className="text-sm font-medium text-[var(--text-secondary)]">Department</span>
                      </div>
                      <p className="text-[var(--text)]">{complaint.department}</p>
                    </div>
                  </div>
                </div>

                {/* Date Info */}
                <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Calendar" size={18} className="text-[var(--primary)]" />
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Submission Date</span>
                  </div>
                  <p className="text-[var(--text)]">
                    {format(new Date(complaint.submittedDate || complaint.createdAt), 'PPP')}
                  </p>
                </div>
              </div>
            </div>

            {/* Title and Description */}
            <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="FileText" size={18} className="text-[var(--primary)]" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">Complaint Details</span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--text)] mb-3">{complaint.title}</h3>
              <p className="text-[var(--text)] whitespace-pre-line">{complaint.description}</p>
            </div>

            {/* Image */}
            {complaint.image && (
              <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="Image" size={18} className="text-[var(--primary)]" />
                  <span className="text-sm font-medium text-[var(--text-secondary)]">Attached Image</span>
                </div>
                <img
                  src={complaint.image}
                  alt="Complaint"
                  className="w-full rounded-lg object-cover max-h-96"
                />
              </div>
            )}

            {/* Updates */}
            {complaint.notes && complaint.notes.length > 0 && (
              <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="MessageSquare" size={18} className="text-[var(--primary)]" />
                  <span className="text-sm font-medium text-[var(--text-secondary)]">Updates</span>
                </div>
                <div className="space-y-3">
                  {complaint.notes.map((note, index) => (
                    <div
                      key={note.id || index}
                      className="bg-[var(--background)] rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[var(--text)]">
                          {note.author}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {format(new Date(note.timestamp), 'PPp')}
                        </span>
                      </div>
                      <p className="text-[var(--text)]">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border)] bg-[var(--surface)]">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-[var(--background)] text-[var(--text)] rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel; 