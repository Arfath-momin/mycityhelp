import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const grievanceSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    index: false
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Infrastructure', 'Roads', 'Noise', 'Utilities', 'Environment', 'Water Supply', 'Electricity', 'Sanitation', 'Other']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  location: {
    type: String,
    required: [true, 'Please provide a location']
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  department: {
    type: String,
    required: [true, 'Please provide a department']
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  image: {
    type: String
  },
  notes: [noteSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  }
});

// Generate tracking ID before saving
grievanceSchema.pre('save', function(next) {
  // Only generate tracking ID if it doesn't exist
  if (!this.trackingId) {
    // Use the first 6 characters of the _id as the tracking ID
    this.trackingId = this._id.toString().substring(0, 6);
  }
  
  // Update timestamps
  this.updatedAt = new Date();
  if (this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
  next();
});

// Add indexes for better query performance
grievanceSchema.index({ status: 1, department: 1 });
grievanceSchema.index({ submittedBy: 1 });
grievanceSchema.index({ createdAt: -1 });
grievanceSchema.index({ trackingId: 1 }, { unique: true, sparse: true });

export default mongoose.models.Grievance || mongoose.model('Grievance', grievanceSchema); 