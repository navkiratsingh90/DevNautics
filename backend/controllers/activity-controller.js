import Activity from '../models/activity-model.js';
import User from '../models/user-model.js';
import cloudinary from '../utils/cloudinary.js'
import getDataUri from '../utils/datauri.js';

/* ================= CREATE ACTIVITY ================= */
export const createActivity = async (req, res) => {
  try {
    const { description, tags } = req.body;
    let fileUrl = null;
    const userId = req.user.userID || req.user._id;
    if (!description) {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }

    if (req.file) {
      const fileUri = getDataUri(file);
       fileUrl = await cloudinary.uploader.upload(fileUri.content);
    }

    const tagsArray = Array.isArray(tags)
      ? tags
      : tags?.split(',').map(t => t.trim()).filter(Boolean) || [];

    const activity = await Activity.create({
      description,
      file: fileUrl,
      tags: tagsArray,
      createdBy: userId,
    });

    await activity.populate('createdBy', 'name username avatar role');

    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET ALL ACTIVITIES ================= */
export const getActivities = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;

    let query = {};
    if (userId) query.createdBy = userId;

    const skip = (page - 1) * limit;

    const activities = await Activity.find(query)
      .populate('createdBy', 'name username  role')
      .populate('comments.createdBy', 'name username ')
      .populate('likes', 'name username ')
      .skip(skip)
      .limit(Number(limit));

    const total = await Activity.countDocuments(query);

    res.json({
      success: true,
      count: activities.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: activities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= GET ACTIVITY BY ID ================= */
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('createdBy', 'name username avatar role')
      .populate('comments.createdBy', 'name username avatar')
      .populate('likes', 'name username avatar');

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE ACTIVITY ================= */
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    if (
      activity.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // if (activity.file) {
    //   const publicId = activity.file.split('/').pop().split('.')[0];
    //   // await deleteFromCloudinary(publicId);
    // }

    await activity.deleteOne();

    res.json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= LIKE / UNLIKE ACTIVITY ================= */
export const likeActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    const userId = req.user.userID || req.user._id;
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    const index = activity.likes.indexOf(userId);

    if (index > -1) {
      activity.likes.splice(index, 1);
    } else {
      activity.likes.push(userId);
    }

    await activity.save();
    await activity.populate('likes', 'name username avatar');

    res.json({
      success: true,
      liked: index === -1,
      data: activity,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= ADD COMMENT ================= */
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.userID || req.user._id;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Comment is required' });
    }

    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    activity.comments.push({
      createdBy: userId,
      content,
    });

    await activity.save();
    await activity.populate('comments.createdBy', 'name username avatar');

    res.status(201).json({
      success: true,
      activity,
      data: activity.comments.at(-1),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= DELETE COMMENT ================= */
export const deleteComment = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    const userId = req.user.userID || req.user._id;
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    const commentIndex = activity.comments.findIndex(
      c => c._id.toString() === req.params.commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const comment = activity.comments[commentIndex];

    const isCommentOwner = comment.createdBy.toString() === userId.toString();
    const isActivityOwner = activity.createdBy.toString() === userId.toString();

    if (!isCommentOwner && !isActivityOwner ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    activity.comments.splice(commentIndex, 1);
    await activity.save();

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= USER FEED ================= */
export const getUserFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const activities = await Activity.find({
      createdBy: { $in: user.following },
    })
      .populate('createdBy', 'name username avatar role')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Activity.countDocuments({
      createdBy: { $in: user.following },
    });

    res.json({
      success: true,
      count: activities.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================= TRENDING ACTIVITIES ================= */
export const getTrendingActivities = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const activities = await Activity.aggregate([
      { $match: { createdAt: { $gte: oneWeekAgo } } },
      { $addFields: { likeCount: { $size: '$likes' } } },
      { $sort: { likeCount: -1, createdAt: -1 } },
      { $limit: 10 },
    ]);

    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
