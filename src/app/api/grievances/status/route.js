import connectDB from '@/lib/mongodb';
import Grievance from '@/models/Grievance';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Basic format validation (either 24 chars for full ID or 6 chars for tracking ID)
    if (!id || !(/^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-fA-F]{6}$/.test(id))) {
      return NextResponse.json(
        { error: 'Please enter a valid complaint ID (24 characters) or tracking ID (6 characters)' },
        { status: 400 }
      );
    }

    await connectDB();

    let grievance;
    // If it's a 24-character hex (full MongoDB ObjectId)
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      grievance = await Grievance.findById(id)
        .select('status title department createdAt updatedAt category location notes trackingId')
        .lean();
    }
    // If it's a 6-character tracking ID
    else {
      grievance = await Grievance.findOne({ trackingId: id })
        .select('status title department createdAt updatedAt category location notes trackingId')
        .lean();
    }

    if (!grievance) {
      return NextResponse.json(
        { error: 'No complaint found with this ID' },
        { status: 404 }
      );
    }

    // Filter public notes
    const publicNotes = grievance.notes
      .filter(note => note.isPublic)
      .map(note => ({
        content: note.content,
        timestamp: note.timestamp
      }));

    return NextResponse.json({
      id: grievance._id,
      trackingId: grievance.trackingId,
      status: grievance.status,
      title: grievance.title,
      department: grievance.department,
      category: grievance.category,
      location: grievance.location,
      createdAt: grievance.createdAt,
      updatedAt: grievance.updatedAt,
      publicNotes
    });
  } catch (error) {
    console.error('Error fetching grievance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaint status. Please try again.' },
      { status: 500 }
    );
  }
} 