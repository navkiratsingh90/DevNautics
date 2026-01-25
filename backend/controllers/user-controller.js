import User from '../models/user-model.js'
import Activity from "../models/activity-model.js";
import Challenge from "../models/challenge-model.js";
import cloudinary from '../utils/cloudinary.js'
import getDataUri from '../utils/datauri.js';
import ProjectFlow from "../models/workspace-model.js";
import Discussion from "../models/discussion-model.js"
import mongoose from 'mongoose';
// ===================== PROFILE =====================

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user)
      .populate("activeProjects")
      .populate("connectedUsers", "username email")
      .populate("challengesAttended");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("getUserProfile:", error);
    res.status(500).json({ msg: "Failed to fetch profile" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userID || req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { about: req.body.about },
      { new: true }
    );

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ msg: "Profile updated", user });
  } catch (error) {
    console.error("updateUserProfile:", error);
    res.status(500).json({ msg: "Failed to update profile" });
  }
};

// ===================== EDUCATION =====================

export const addEducation = async (req, res) => {
  try {
    const { schoolName, degree, duration, description } = req.body;
    const userId = req.user.userID || req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.education.push({ schoolName, degree, duration, description });
    await user.save();

    res.status(200).json({ msg: "Education added", education: user.education });
  } catch (error) {
    console.error("addEducation:", error);
    res.status(500).json({ msg: "Failed to add education" });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.education = user.education.filter(
      edu => edu._id.toString() !== req.params.eduId
    );

    await user.save();
    res.status(200).json({ msg: "Education removed" });
  } catch (error) {
    console.error("deleteEducation:", error);
    res.status(500).json({ msg: "Failed to delete education" });
  }
};

// ===================== WORK EXPERIENCE =====================

export const addWorkExperience = async (req, res) => {
  try {
    const { companyName, duration, role, description, location } = req.body;
    const userId = req.user.userID || req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.workExperience.push({ companyName, duration, role, description, location });
    await user.save();

    res.status(200).json({ msg: "Work experience added" });
  } catch (error) {
    console.error("addWorkExperience:", error);
    res.status(500).json({ msg: "Failed to add work experience" });
  }
};

export const deleteWorkExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.workExperience = user.workExperience.filter(
      w => w._id.toString() !== req.params.workId
    );

    await user.save();
    res.status(200).json({ msg: "Work experience removed" });
  } catch (error) {
    console.error("deleteWorkExperience:", error);
    res.status(500).json({ msg: "Failed to delete work experience" });
  }
};

export const addProject = async (req, res) => {
  try {
    const userId = req.user.userID || req.user._id;

    const {
      title,
      description,
      techStack,
      role,
      duration,
      githubLink,
      liveLink,
    } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }
    let file;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (req.file) {
       const fileUri = getDataUri(req.file);
      const uploadRes = await cloudinary.uploader.upload(fileUri.content);
      file = uploadRes.secure_url;
    }
    user.projects.push({
      title,
      description,
      file,
      techStack,
      role,
      duration,
      githubLink,
      liveLink,
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Project added successfully 🚀",
      projects: user.projects,
    });

  } catch (error) {
    console.error("addProject:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add project",
    });
  }
};

// ===================== SKILLS =====================

// export const updateSkills = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.user,
//       { skills: req.body },
//       { new: true }
//     );

//     if (!user) return res.status(404).json({ msg: "User not found" });

//     res.status(200).json({ msg: "Skills updated", skills: user.skills });
//   } catch (error) {
//     console.error("updateSkills:", error);
//     res.status(500).json({ msg: "Failed to update skills" });
//   }
// };
export const updateSkills = async (req, res) => {
  try {
    const userId = req.user.userID || req.user._id;
    const { category, skill, action } = req.body;

    const validCategories = [
      "frontend",
      "backend",
      "tools",
      "frameworks",
      "libraries",
      "languages",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill category",
      });
    }

    if (!skill || !action) {
      return res.status(400).json({
        success: false,
        message: "Skill and action are required",
      });
    }

    let updateQuery;

    if (action === "add") {
      updateQuery = {
        $addToSet: { [`skills.${category}`]: skill },
      };
    } else if (action === "remove") {
      updateQuery = {
        $pull: { [`skills.${category}`]: skill },
      };
    } else {
      return res.status(400).json({
        success: false,
        message: "Action must be 'add' or 'remove'",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateQuery,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Skill ${action}ed successfully`,
      skills: updatedUser.skills,
    });

  } catch (error) {
    console.error("Update Skills Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating skills",
    });
  }
};


// ===================== CONNECTIONS =====================

export const sendConnectionRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const userId = req.user.userID || req.user._id;

    if (!mongoose.Types.ObjectId.isValid(targetUserId))
      return res.status(400).json({ msg: "Invalid user ID" });

    if (userId === targetUserId)
      return res.status(400).json({ msg: "Cannot connect with yourself" });

    const [requester, target] = await Promise.all([
      User.findById(userId),
      User.findById(targetUserId)
    ]);

    if (!requester || !target)
      return res.status(404).json({ msg: "User not found" });

    if (requester.connectedUsers.includes(targetUserId))
      return res.status(409).json({ msg: "Already connected" });

    if (!target.totalPendingRequests.includes(userId)) {
      target.totalPendingRequests.push(userId);
      await target.save();
    }
    else {
      target.totalPendingRequests.pop(userId);
      await target.save();
    }

    res.status(200).json({ msg: "Connection request sent" , target});
  } catch (error) {
    console.error("sendConnectionRequest:", error);
    res.status(500).json({ msg: "Failed to send request" });
  }
};

export const approveConnectionRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    const userId = req.user;

    const [user, requester] = await Promise.all([
      User.findById(userId),
      User.findById(requesterId)
    ]);

    if (!user || !requester)
      return res.status(404).json({ msg: "User not found" });

    user.totalPendingRequests = user.totalPendingRequests.filter(
      id => id.toString() !== requesterId
    );

    if (!user.connectedUsers.includes(requesterId))
      user.connectedUsers.push(requesterId);

    if (!requester.connectedUsers.includes(userId))
      requester.connectedUsers.push(userId);

    await Promise.all([user.save(), requester.save()]);

    res.status(200).json({ msg: "Connection approved" });
  } catch (error) {
    console.error("approveConnectionRequest:", error);
    res.status(500).json({ msg: "Failed to approve request" });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.userID || req.user._id;
    const user = await User.findById(userId)
      .populate("totalPendingRequests");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ pendingRequests: user.totalPendingRequests });
  } catch (error) {
    console.error("getPendingRequests:", error);
    res.status(500).json({ msg: "Failed to fetch pending requests" });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const { targetUserId } = req.body;

    const [user, target] = await Promise.all([
      User.findById(req.user),
      User.findById(targetUserId)
    ]);

    if (!user || !target)
      return res.status(404).json({ msg: "User not found" });

    user.connectedUsers = user.connectedUsers.filter(
      id => id.toString() !== targetUserId
    );
    target.connectedUsers = target.connectedUsers.filter(
      id => id.toString() !== req.user
    );

    await Promise.all([user.save(), target.save()]);
    res.status(200).json({ msg: "Connection removed" });
  } catch (error) {
    console.error("removeConnection:", error);
    res.status(500).json({ msg: "Failed to remove connection" });
  }
};

export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId)
      .populate("activityPosted")
      .populate("challengesAttended")
      .populate("activeProjects")
      .populate("connectedUsers")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ---------- 1. Activities ------------
    const totalActivities = await Activity.countDocuments({ createdBy: userId });
    const totalLikesReceived = await Activity.aggregate([
      { $match: { createdBy: user._id } },
      { $project: { totalLikes: { $size: "$likes" } } },
      { $group: { _id: null, likes: { $sum: "$totalLikes" } } },
    ]);
    const totalCommentsReceived = await Activity.aggregate([
      { $match: { createdBy: user._id } },
      { $project: { totalComments: { $size: "$comments" } } },
      { $group: { _id: null, comments: { $sum: "$totalComments" } } },
    ]);

    // ---------- 2. Challenges ------------
    const totalChallenges = await Challenge.countDocuments({
      "leaderboard.userId": userId,
    });
    const totalSolvedChallenges = await Challenge.countDocuments({
      successfulSubmissions: userId,
    });

    // ---------- 3. Projects ------------
    const activeProjects = await ProjectFlow.find({ "members.user": userId });
    const totalTasksAssigned = activeProjects.reduce(
      (acc, project) =>
        acc +
        project.tasks.filter(
          (t) => t.assignedTo?.toString() === userId.toString()
        ).length,
      0
    );
    const completedTasks = activeProjects.reduce(
      (acc, project) =>
        acc +
        project.tasks.filter(
          (t) =>
            t.assignedTo?.toString() === userId.toString() &&
            t.status === "Completed"
        ).length,
      0
    );

    // ---------- 4. Discussions ------------
    const totalDiscussionsJoined = await Discussion.countDocuments({
      joinedMembers: userId,
    });
    const totalPendingDiscussionRequests = await Discussion.countDocuments({
      "pendingRequests.username": userId,
    });

    // ---------- 5. Graph Data (Time-series for charts) ------------
    const activityTimeline = await Activity.aggregate([
      { $match: { createdBy: user._id } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const challengeTimeline = await Challenge.aggregate([
      { $match: { "leaderboard.userId": userId } },
      {
        $unwind: "$leaderboard",
      },
      { $match: { "leaderboard.userId": userId } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$leaderboard.submittedAt" },
          },
          score: { $sum: "$leaderboard.score" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ---------- Final Response ------------
    res.status(200).json({
      userInfo: {
        username: user.username,
        email: user.email,
        totalPoints: user.totalPoints,
        connections: user.connectedUsers.length,
      },
      analytics: {
        activities: {
          total: totalActivities,
          likes: totalLikesReceived[0]?.likes || 0,
          comments: totalCommentsReceived[0]?.comments || 0,
          timeline: activityTimeline,
        },
        challenges: {
          totalParticipated: totalChallenges,
          solved: totalSolvedChallenges,
          timeline: challengeTimeline,
					totalPointsScored : user.totalPoints
        },
        projects: {
          total: activeProjects.length,
          tasksAssigned: totalTasksAssigned,
          tasksCompleted: completedTasks,
        },
        discussions: {
          joined: totalDiscussionsJoined,
          pendingRequests: totalPendingDiscussionRequests,
        },
      },
      message: "User analytics fetched successfully",
    });
  } catch (error) {
    console.error("Error in getUserAnalytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};