import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Grievance from '@/models/Grievance';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify JWT token
async function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function GET(request) {
  try {
    await connectDB();

    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const department = searchParams.get('department');
    const dateRange = searchParams.get('dateRange');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    const query = {};

    // Add filters if provided
    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;
    if (department && department !== 'all') query.department = department;
    if (dateRange && dateRange !== 'all') {
      const date = new Date();
      switch (dateRange) {
        case 'today':
          date.setHours(0, 0, 0, 0);
          query.createdAt = { $gte: date };
          break;
        case 'week':
          date.setDate(date.getDate() - 7);
          query.createdAt = { $gte: date };
          break;
        case 'month':
          date.setMonth(date.getMonth() - 1);
          query.createdAt = { $gte: date };
          break;
      }
    }

    // Add role-based filters
    if (user.role === 'admin') {
      query.department = user.department;
    } else if (user.role === 'user') {
      query.submittedBy = user.id;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Grievance.countDocuments(query);

    // Fetch grievances with pagination
    const grievances = await Grievance.find(query)
      .populate('submittedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      grievances,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Fetch Grievances Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grievances' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    // Verify authentication
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();

    // Create grievance with user information
    const grievanceData = {
      ...body,
      submittedBy: user.id,
      status: 'pending' // Set initial status
    };

    // Create the grievance
    const grievance = await Grievance.create(grievanceData);

    // Fetch the populated grievance
    const populatedGrievance = await Grievance.findById(grievance._id)
      .populate('submittedBy', 'name email')
      .select('+trackingId'); // Make sure to include the tracking ID

    // Return response with tracking ID prominently featured
    return NextResponse.json({
      success: true,
      data: {
        ...populatedGrievance.toObject(),
        trackingId: populatedGrievance.trackingId // Ensure tracking ID is included
      },
      message: `Complaint registered successfully. Your tracking ID is: ${populatedGrievance.trackingId}`
    }, { status: 201 });
  } catch (error) {
    console.error('Create Grievance Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create grievance' },
      { status: 400 }
    );
  }
} 