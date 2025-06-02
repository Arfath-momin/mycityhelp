import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const StatusUpdateForm = ({ complaint, onStatusUpdate, isLoading }) => {
  const [selectedStatus, setSelectedStatus] = useState(complaint.status);
  const [notes, setNotes] = useState('');
  const [isPublicNote, setIsPublicNote] = useState(true);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
    { value: 'in-progress', label: 'In Progress', color: 'text-blue-600' },
    { value: 'resolved', label: 'Resolved', color: 'text-green-600' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedStatus === complaint.status && !notes.trim()) {
      return;
    }
    
    await onStatusUpdate(complaint.id, selectedStatus, notes.trim());
    setNotes('');
  };

  const hasChanges = selectedStatus !== complaint.status || notes.trim();

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h5 className="text-sm font-medium text-gray-900 mb-4">Update Status</h5>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input w-full"
            disabled={isLoading}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Note (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note about this status update..."
            rows={3}
            className="input w-full resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Public Note Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="publicNote"
            checked={isPublicNote}
            onChange={(e) => setIsPublicNote(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            disabled={isLoading}
          />
          <label htmlFor="publicNote" className="ml-2 text-sm text-gray-600">
            Make this note visible to the complainant
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!hasChanges || isLoading}
          className="btn btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <Icon name="Save" size={16} />
              <span>Update Status</span>
            </>
          )}
        </button>
      </form>

      {/* Status Change Preview */}
      {selectedStatus !== complaint.status && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center space-x-2">
            <Icon name="Info" size={16} className="text-blue-600" />
            <span className="text-sm text-blue-800">
              Status will change from <strong>{complaint.status.replace('-', ' ')}</strong> to <strong>{selectedStatus.replace('-', ' ')}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusUpdateForm;