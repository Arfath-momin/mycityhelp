import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = body;

    console.log('Login attempt for email:', email);

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('No user found with email:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('User found:', { 
      id: user._id, 
      email: user.email,
      hasPassword: !!user.password 
    });

    // Check if user is active
    if (user.status === 'inactive') {
      console.log('User account is inactive:', email);
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 401 }
      );
    }

    // Direct password comparison using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison details:', {
      providedPassword: !!password,
      storedPasswordHash: user.password?.substring(0, 10) + '...',
      isMatch
    });

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create token
    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        department: user.department
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Remove password from user object
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('Login successful for:', email);

    return NextResponse.json({
      token,
      user: userResponse
    }, { status: 200 });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 