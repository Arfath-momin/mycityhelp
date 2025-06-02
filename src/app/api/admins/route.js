import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();

    // Verify authentication and authorization
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only superadmins can list all admins
    if (authResult.user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const admins = await User.find({ role: 'admin' })
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    // Verify authentication and authorization
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only superadmins can create admins
    if (authResult.user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, department } = body;

    // Validate required fields
    if (!name || !email || !password || !department) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, password, and department are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Create new admin
    const admin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      department,
      role: 'admin',
      status: 'active'
    });

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    return NextResponse.json(adminResponse, { status: 201 });
  } catch (error) {
    console.error('Admin creation error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: error.message || 'Failed to create admin' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    // Verify authentication and authorization
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only superadmins can update admins
    if (authResult.user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, name, email, department, status } = body;

    // Check if email exists for other users
    const existingUser = await User.findOne({ email, _id: { $ne: id } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    const admin = await User.findByIdAndUpdate(
      id,
      { name, email, department, status },
      { new: true }
    ).select('-password');

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(admin);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update admin' },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    // Verify authentication and authorization
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only superadmins can delete admins
    if (authResult.user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id } = body;
    
    const admin = await User.findByIdAndDelete(id);

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete admin' },
      { status: 400 }
    );
  }
} 