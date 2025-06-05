import connectDB from '@/lib/mongodb';
import Grievance from '@/models/Grievance';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('trackingId');

    if (!trackingId) {
      return NextResponse.json(
        { error: 'Tracking ID is required' },
        { status: 400 }
      );
    }

    // Find grievance by tracking ID
    const grievance = await Grievance.findOne({ trackingId })
      .populate('submittedBy', 'name email')
      .select('-__v');

    if (!grievance) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: grievance
    });
  } catch (error) {
    console.error('Get Grievance Status Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch grievance status' },
      { status: 500 }
    );
  }
} 