import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Grievance from '@/models/Grievance';
import { verifyAuth } from '@/lib/auth';

async function getGrievanceAndCheckPermissions(grievanceId, user) {
  const grievance = await Grievance.findById(grievanceId);
  if (!grievance) {
    return { error: 'Grievance not found', status: 404 };
  }

  // Check if user has permission to access this grievance
  const canAccess = 
    user.role === 'superadmin' ||
    (user.role === 'admin' && grievance.department === user.department) ||
    (user.role === 'user' && grievance.submittedBy.toString() === user.id);

  if (!canAccess) {
    return { error: 'Access forbidden', status: 403 };
  }

  return { grievance };
}

export async function GET(request, context) {
  try {
    await connectDB();

    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Grievance ID is required' }, { status: 400 });
    }

    const { grievance, error, status } = await getGrievanceAndCheckPermissions(id, authResult.user);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    await grievance.populate('submittedBy', 'name email');
    await grievance.populate('assignedTo', 'name email');
    
    return NextResponse.json(grievance);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch grievance' }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    await connectDB();

    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Grievance ID is required' }, { status: 400 });
    }

    const { grievance, error, status } = await getGrievanceAndCheckPermissions(id, authResult.user);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const updates = await request.json();

    // Only allow status updates from admin/superadmin
    if (updates.status && authResult.user.role === 'user') {
      return NextResponse.json({ error: 'Only administrators can update status' }, { status: 403 });
    }

    // Add note if provided
    if (updates.note) {
      grievance.notes.push({
        author: authResult.user.id,
        content: updates.note,
        isPublic: updates.isPublicNote || true,
        timestamp: new Date()
      });
      delete updates.note;
      delete updates.isPublicNote;
    }

    // Update grievance
    Object.assign(grievance, updates);
    await grievance.save();

    await grievance.populate('submittedBy', 'name email');
    await grievance.populate('assignedTo', 'name email');

    return NextResponse.json(grievance);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, context) {
  try {
    await connectDB();

    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Grievance ID is required' }, { status: 400 });
    }

    const { grievance, error, status } = await getGrievanceAndCheckPermissions(id, authResult.user);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    // Only allow superadmin or admin to delete
    if (authResult.user.role === 'user') {
      return NextResponse.json({ error: 'Only administrators can delete grievances' }, { status: 403 });
    }

    await grievance.deleteOne();
    return NextResponse.json({ message: 'Grievance deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
} 