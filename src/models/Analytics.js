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
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Get previous month
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1);
    const previousMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    // Get current month metrics
    const [
      totalCount,
      pendingCount,
      inProgressCount,
      resolvedCount
    ] = await Promise.all([
      Grievance.countDocuments({ 
        department,
        createdAt: {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
        }
      }),
      Grievance.countDocuments({ 
        department, 
        status: 'pending',
        createdAt: {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
        }
      }),
      Grievance.countDocuments({ 
        department, 
        status: 'in-progress',
        createdAt: {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
        }
      }),
      Grievance.countDocuments({ 
        department, 
        status: 'resolved',
        createdAt: {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1),
          $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
        }
      })
    ]);

    // Get previous month metrics
    const [
      prevTotalCount,
      prevPendingCount,
      prevInProgressCount,
      prevResolvedCount
    ] = await Promise.all([
      Grievance.countDocuments({ 
        department,
        createdAt: {
          $gte: new Date(prevDate.getFullYear(), prevDate.getMonth(), 1),
          $lt: new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
        }
      }),
      Grievance.countDocuments({ 
        department, 
        status: 'pending',
        createdAt: {
          $gte: new Date(prevDate.getFullYear(), prevDate.getMonth(), 1),
          $lt: new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
        }
      }),
      Grievance.countDocuments({ 
        department, 
        status: 'in-progress',
        createdAt: {
          $gte: new Date(prevDate.getFullYear(), prevDate.getMonth(), 1),
          $lt: new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
        }
      }),
      Grievance.countDocuments({ 
        department, 
        status: 'resolved',
        createdAt: {
          $gte: new Date(prevDate.getFullYear(), prevDate.getMonth(), 1),
          $lt: new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
        }
      })
    ]);

    // Calculate percentage changes
    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const percentageChanges = {
      totalGrievances: calculatePercentageChange(totalCount, prevTotalCount),
      pendingGrievances: calculatePercentageChange(pendingCount, prevPendingCount),
      inProgressGrievances: calculatePercentageChange(inProgressCount, prevInProgressCount),
      resolvedGrievances: calculatePercentageChange(resolvedCount, prevResolvedCount)
    };

    // Get category breakdown
    const categoryBreakdown = await Grievance.aggregate([
      { $match: { department } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } }
    ]);

    // Get priority breakdown
    const priorityBreakdown = await Grievance.aggregate([
      { $match: { department } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $project: { priority: '$_id', count: 1, _id: 0 } }
    ]);

    // Update analytics document with monthly data
    const monthlyMetrics = new Map();
    monthlyMetrics.set(currentMonth, {
      totalGrievances: totalCount,
      pendingGrievances: pendingCount,
      inProgressGrievances: inProgressCount,
      resolvedGrievances: resolvedCount
    });
    monthlyMetrics.set(previousMonth, {
      totalGrievances: prevTotalCount,
      pendingGrievances: prevPendingCount,
      inProgressGrievances: prevInProgressCount,
      resolvedGrievances: prevResolvedCount
    });

    return await this.findOneAndUpdate(
      { department },
      {
        metrics: {
          totalGrievances: totalCount,
          pendingGrievances: pendingCount,
          inProgressGrievances: inProgressCount,
          resolvedGrievances: resolvedCount,
          percentageChanges
        },
        monthlyMetrics,
        categoryBreakdown,
        priorityBreakdown,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error(`Failed to update analytics for department ${department}:`, error);
    throw error;
  }
};

const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);
export default Analytics; 