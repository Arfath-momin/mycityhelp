import mongoose from 'mongoose';

// Function to generate a random tracking ID
function generateTrackingId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

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
    unique: true,
    sparse: true
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
grievanceSchema.pre('save', async function(next) {
  try {
    // Only generate tracking ID if it doesn't exist
    if (!this.trackingId) {
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!isUnique && attempts < maxAttempts) {
        const newTrackingId = generateTrackingId();
        // Check if this tracking ID already exists
        const existing = await this.constructor.findOne({ trackingId: newTrackingId });
        if (!existing) {
          this.trackingId = newTrackingId;
          isUnique = true;
        }
        attempts++;
      }

      if (!isUnique) {
        throw new Error('Could not generate unique tracking ID');
      }
    }
    
    // Set createdAt if it's a new document
    if (this.isNew && !this.createdAt) {
      this.createdAt = new Date();
    }
    
    // Update timestamps
    this.updatedAt = new Date();
    if (this.status === 'resolved' && !this.resolvedAt) {
      this.resolvedAt = new Date();
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Add indexes for better query performance
grievanceSchema.index({ status: 1, department: 1 });
grievanceSchema.index({ submittedBy: 1 });
grievanceSchema.index({ createdAt: -1 });
grievanceSchema.index({ trackingId: 1 }, { unique: true, sparse: true });

export default mongoose.models.Grievance || mongoose.model('Grievance', grievanceSchema); 