const mongoose = require('mongoose');

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cityhelp';

// User Schema (simplified version matching your actual schema)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  status: String,
  lastLogin: Date
}, { timestamps: true });

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the User model
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Find all users
    const users = await User.find({}).select('-password');
    
    console.log('\nUsers in database:');
    users.forEach(user => {
      console.log('\nUser Details:');
      console.log('- Name:', user.name);
      console.log('- Email:', user.email);
      console.log('- Role:', user.role);
      console.log('- Status:', user.status);
      console.log('- Last Login:', user.lastLogin);
      console.log('- Created At:', user.createdAt);
    });

    if (users.length === 0) {
      console.log('No users found in the database');
    }

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the script
checkUsers(); 