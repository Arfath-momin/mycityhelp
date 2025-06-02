import jwt from 'jsonwebtoken';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function verifyAuth(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'No token provided' };
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database using id (not userId)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Check if user is active
    if (user.status === 'inactive') {
      return { success: false, error: 'User account is inactive' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { success: false, error: error.message };
  }
}

export function generateToken(user) {
  return jwt.sign(
    { 
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      department: user.department
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
} 