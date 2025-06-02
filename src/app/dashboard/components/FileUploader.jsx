import React, { useState, useRef } from 'react';
import Icon from '@/components/AppIcon';
import { uploadToCloudinary } from '@/lib/cloudinary';

const FileUploader = ({ onFileSelect, currentFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentFile);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = async (file) => {
    // Reset error state
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // Create preview URL
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);

      // Upload to Cloudinary
      const result = await uploadToCloudinary(file);
      
      // Call the parent's onFileSelect with the Cloudinary URL
      onFileSelect(result.url);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image. Please try again.');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setPreviewUrl(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {/* File Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !previewUrl && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          isDragging
            ? 'border-[var(--primary)] bg-[var(--primary-light)]'
            : 'border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)]'
        } ${previewUrl ? 'cursor-default' : 'cursor-pointer'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          accept="image/*"
          className="hidden"
        />

        {isUploading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center py-4">
            <Icon name="Loader2" size={24} className="text-[var(--primary)] animate-spin mb-2" />
            <p className="text-sm text-[var(--text-secondary)]">Uploading image...</p>
          </div>
        ) : previewUrl ? (
          // Preview State
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={removeFile}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-4">
            <Icon
              name="Upload"
              size={24}
              className="text-[var(--text-secondary)] mb-2"
            />
            <p className="text-sm text-[var(--text-secondary)] text-center">
              Drag and drop an image here, or click to select
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Maximum file size: 5MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <Icon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUploader;