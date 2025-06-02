import mongoose from 'mongoose';
import Grievance from './Grievance';

const analyticsSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    unique: true
  },
  metrics: {
    totalGrievances: {
      type: Number,
      default: 0
    },
    pendingGrievances: {
      type: Number,
      default: 0
    },
    inProgressGrievances: {
      type: Number,
      default: 0
    },
    resolvedGrievances: {
      type: Number,
      default: 0
    },
    rejected: {
      type: Number,
      default: 0
    },
    averageResolutionTime: {
      type: Number, // in hours
      default: 0
    },
    percentageChanges: {
      type: Map,
      of: Number
    }
  },
  monthlyMetrics: {
    type: Map,
    of: {
      totalGrievances: Number,
      pendingGrievances: Number,
      inProgressGrievances: Number,
      resolvedGrievances: Number
    },
    default: new Map()
  },
  categoryBreakdown: [{
    category: String,
    count: Number
  }],
  priorityBreakdown: [{
    priority: String,
    count: Number
  }],
  timeSeriesData: [{
    date: Date,
    newGrievances: Number,
    resolvedGrievances: Number
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Initialize analytics for a department
analyticsSchema.statics.initializeDepartment = async function(department) {
  try {
    const existingAnalytics = await this.findOne({ department });
    if (!existingAnalytics) {
      await this.create({
        department,
        metrics: {
          totalGrievances: 0,
          pendingGrievances: 0,
          inProgressGrievances: 0,
          resolvedGrievances: 0
        }
      });
    }
  } catch (error) {
    console.error(`Failed to initialize analytics for department ${department}:`, error);
  }
};

// Method to update analytics
analyticsSchema.statics.updateDepartmentAnalytics = async function(department) {
  try {
    // Ensure department analytics exists
    await this.initializeDepartment(department);
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Get total counts (all time)
    const [totalCount, pendingCount, inProgressCount, resolvedCount] = await Promise.all([
      Grievance.countDocuments({ department }),
      Grievance.countDocuments({ department, status: 'pending' }),
      Grievance.countDocuments({ department, status: 'in-progress' }),
      Grievance.countDocuments({ department, status: 'resolved' })
    ]);

    // Get this month's counts
    const [
      thisMonthTotal,
      thisMonthPending,
      thisMonthInProgress,
      thisMonthResolved
    ] = await Promise.all([
      Grievance.countDocuments({ 
        department,
        createdAt: { $gte: startOfMonth }
      }),
      Grievance.countDocuments({ 
        department,
        status: 'pending',
        createdAt: { $gte: startOfMonth }
      }),
      Grievance.countDocuments({ 
        department,
        status: 'in-progress',
        createdAt: { $gte: startOfMonth }
      }),
      Grievance.countDocuments({ 
        department,
        status: 'resolved',
        createdAt: { $gte: startOfMonth }
      })
    ]);

    // Get last month's counts
    const [
      lastMonthTotal,
      lastMonthPending,
      lastMonthInProgress,
      lastMonthResolved
    ] = await Promise.all([
      Grievance.countDocuments({ 
        department,
        createdAt: { 
          $gte: startOfPrevMonth,
          $lt: startOfMonth
        }
      }),
      Grievance.countDocuments({ 
        department,
        status: 'pending',
        createdAt: { 
          $gte: startOfPrevMonth,
          $lt: startOfMonth
        }
      }),
      Grievance.countDocuments({ 
        department,
        status: 'in-progress',
        createdAt: { 
          $gte: startOfPrevMonth,
          $lt: startOfMonth
        }
      }),
      Grievance.countDocuments({ 
        department,
        status: 'resolved',
        createdAt: { 
          $gte: startOfPrevMonth,
          $lt: startOfMonth
        }
      })
    ]);

    // Calculate percentage changes
    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const monthlyChanges = {
      totalGrievances: calculatePercentageChange(thisMonthTotal, lastMonthTotal),
      pendingGrievances: calculatePercentageChange(thisMonthPending, lastMonthPending),
      inProgressGrievances: calculatePercentageChange(thisMonthInProgress, lastMonthInProgress),
      resolvedGrievances: calculatePercentageChange(thisMonthResolved, lastMonthResolved)
    };

    // Get category breakdown
    const categoryBreakdown = await Grievance.aggregate([
      { $match: { department } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } }
    ]);

    // Update analytics document
    const analytics = await this.findOneAndUpdate(
      { department },
      {
        $set: {
          metrics: {
            totalGrievances: totalCount,
            pendingGrievances: pendingCount,
            inProgressGrievances: inProgressCount,
            resolvedGrievances: resolvedCount,
            percentageChanges: monthlyChanges
          },
          categoryBreakdown,
          lastUpdated: new Date()
        }
      },
      { new: true, upsert: true }
    );

    return analytics;
  } catch (error) {
    console.error(`Failed to update analytics for department ${department}:`, error);
    throw error;
  }
};

const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);
export default Analytics; 