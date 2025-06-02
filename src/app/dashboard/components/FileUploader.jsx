import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const FileUploader = ({ onFileUpload, currentImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, or GIF)';
    }
    
    if (file.size > maxFileSize) {
      return 'File size must be less than 5MB';
    }
    
    return null;
  };

  const handleFileUpload = async (file) => {
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // Simulate file upload to server
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock URL for the uploaded image
      const mockImageUrl = URL.createObjectURL(file);
      onFileUpload(mockImageUrl);
      
    } catch (error) {
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

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
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeImage = () => {
    onFileUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!currentImage && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary bg-primary-50' :'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center space-y-3">
              <Icon name="Loader2" size={32} className="text-primary animate-spin" />
              <p className="text-sm text-gray-600">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon name="Upload" size={24} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Preview */}
      {currentImage && (
        <div className="relative">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-100">
              <Image
                src={currentImage}
                alt="Uploaded complaint image"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Remove Button */}
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Remove image"
          >
            <Icon name="X" size={16} className="text-gray-600" />
          </button>
          
          {/* Image Info */}
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Image uploaded successfully</span>
            <button
              onClick={openFileDialog}
              className="text-primary hover:text-primary-700 font-medium"
            >
              Change image
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="bg-error-light border border-red-200 rounded-md p-3 flex items-center space-x-2">
          <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0" />
          <p className="text-sm text-error">{uploadError}</p>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Supported formats: JPEG, PNG, GIF</p>
        <p>• Maximum file size: 5MB</p>
        <p>• Images help us better understand and resolve your complaint</p>
      </div>
    </div>
  );
};

export default FileUploader;