import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authMiddleware } from '@/middleware/auth';
import { roleAuth } from '@/middleware/roleAuth';

export async function POST(request) {
  try {
    await connectDB();

    // Verify superadmin secret key
    const superadminKey = request.headers.get('x-superadmin-key');
    if (superadminKey !== process.env.SUPERADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, password } = body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Create superadmin
    const superadmin = await User.create({
      name,
      email,
      password,
      role: 'superadmin'
    });

    // Remove password from response
    const userResponse = superadmin.toObject();
    delete userResponse.password;

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('Superadmin Registration Error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
} 