import connectDB from '@/lib/mongodb';
import Grievance from '@/models/Grievance';
import { authMiddleware } from '@/middleware/auth';
import { roleAuth } from '@/middleware/roleAuth';

async function handler(req, res) {
  const { id } = req.query;
  await connectDB();

  // Get grievance and check permissions
  const grievance = await Grievance.findById(id);
  if (!grievance) {
    return res.status(404).json({ error: 'Grievance not found' });
  }

  // Check if user has permission to access this grievance
  const canAccess = 
    req.user.role === 'superadmin' ||
    (req.user.role === 'admin' && grievance.department === req.user.department) ||
    (req.user.role === 'user' && grievance.submittedBy.toString() === req.user.id);

  if (!canAccess) {
    return res.status(403).json({ error: 'Access forbidden' });
  }

  switch (req.method) {
    case 'GET':
      try {
        await grievance.populate('submittedBy', 'name email');
        await grievance.populate('assignedTo', 'name email');
        res.status(200).json(grievance);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch grievance' });
      }
      break;

    case 'PUT':
      try {
        const updates = req.body;
        
        // Only allow status updates from admin/superadmin
        if (updates.status && req.user.role === 'user') {
          return res.status(403).json({ error: 'Only administrators can update status' });
        }

        // Add note if provided
        if (updates.note) {
          grievance.notes.push({
            author: req.user.id,
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

        res.status(200).json(grievance);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    case 'DELETE':
      try {
        // Only allow superadmin or admin to delete
        if (req.user.role === 'user') {
          return res.status(403).json({ error: 'Only administrators can delete grievances' });
        }

        await grievance.remove();
        res.status(200).json({ message: 'Grievance deleted successfully' });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}

export default authMiddleware(handler); 