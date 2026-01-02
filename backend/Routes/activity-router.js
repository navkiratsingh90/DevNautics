import express from 'express';
import {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  likeActivity,
  addComment,
  deleteComment,
  getUserFeed,
  getTrendingActivities,
  getActivitiesByTag
} from '../controllers/activityController.js';
// import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getActivities);
router.get('/trending', getTrendingActivities);
router.get('/tag/:tag', getActivitiesByTag);
router.get('/:id', getActivityById);

// Protected routes
router.post('/', upload.single('file'), createActivity);
router.put('/:id', upload.single('file'), updateActivity);
router.delete('/:id', deleteActivity);
router.post('/:id/like', likeActivity);
router.post('/:id/comments', addComment);
router.delete('/:id/comments/:commentId', deleteComment);
router.get('/feed/my', getUserFeed);

export default router;