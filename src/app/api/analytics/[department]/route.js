import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Analytics from '@/models/Analytics';
import { verifyAuth } from '@/lib/auth';

export async function GET(request, context) {
  try {
    // Connect to database first
    await connectDB();

    // Get params asynchronously
    const params = context.params;
    if (!params) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    // Verify authentication and authorization
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow admin and superadmin to access analytics
    if (!['admin', 'superadmin'].includes(authResult.user.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { department } = params;
    if (!department) {
      return NextResponse.json(
        { error: 'Department is required' },
        { status: 400 }
      );
    }

    try {
      // Initialize department analytics if needed
      await Analytics.initializeDepartment(department);

      // Update analytics
      const analytics = await Analytics.updateDepartmentAnalytics(department);
      
      if (!analytics) {
        return NextResponse.json(
          { error: 'Analytics not found for this department' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        metrics: {
          totalGrievances: analytics.metrics.totalGrievances || 0,
          resolvedGrievances: analytics.metrics.resolvedGrievances || 0,
          pendingGrievances: analytics.metrics.pendingGrievances || 0,
          inProgressGrievances: analytics.metrics.inProgressGrievances || 0
        },
        categoryBreakdown: analytics.categoryBreakdown || []
      });
    } catch (analyticsError) {
      console.error('Analytics processing error:', analyticsError);
      // Return empty metrics instead of error to prevent dashboard from breaking
      return NextResponse.json({
        metrics: {
          totalGrievances: 0,
          resolvedGrievances: 0,
          pendingGrievances: 0,
          inProgressGrievances: 0
        },
        categoryBreakdown: []
      });
    }
  } catch (error) {
    console.error('Analytics Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 