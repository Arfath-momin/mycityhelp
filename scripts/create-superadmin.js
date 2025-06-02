const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cityhelp';

// Superadmin details
const superadmin = {
  name: 'Arfath Momin',
  email: 'arfathmominn@admin.com',
  password: 'Admin@123', // You should change this after first login
  role: 'superadmin',
  status: 'active'
};

// User Schema (simplified version matching your actual schema)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  status: String,
  lastLogin: Date
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

async function createSuperAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the User model
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Check if superadmin already exists
    const existingAdmin = await User.findOne({ email: superadmin.email });
    if (existingAdmin) {
      console.log('Superadmin already exists with this email');
      return;
    }

    // Create superadmin
    const newSuperAdmin = await User.create(superadmin);
    console.log('Superadmin created successfully:', {
      name: newSuperAdmin.name,
      email: newSuperAdmin.email,
      role: newSuperAdmin.role
    });

  } catch (error) {
    console.error('Error creating superadmin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
createSuperAdmin(); 