import express from 'express';
import {
  createActivity,
  getActivities,
  getActivityById,
  deleteActivity,
  likeActivity,
  addComment,
  deleteComment,
  getUserFeed,
  getTrendingActivities,
} from '../controllers/activity-controller.js';
import singleUpload from '../middlewares/multer-middleware.js';
import authMiddleware from '../middlewares/auth-middleware.js';
// import { protect } from '../middleware/authMiddleware.js';
// import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/get-activities', getActivities);
router.get('/trending', getTrendingActivities);
// router.get('/tag/:tag', getActivitiesByTag);
router.get('/:id', getActivityById);

// Protected routes
router.post('/create', authMiddleware , singleUpload, createActivity);
// router.put('/:id', singleUpload, updateActivity);
router.delete('/:id', authMiddleware, deleteActivity);
router.post('/:id/like',authMiddleware , likeActivity);
router.post('/:id/comments',authMiddleware, addComment);
router.delete('/:id/comments/:commentId',authMiddleware, deleteComment);
router.get('/feed/my', getUserFeed);

export default router;