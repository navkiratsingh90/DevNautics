import express from "express";
import {
  getAuthUrl,
  getTokens,
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvents,
} from "../utils/googleAuth.js";

import {
  createNewProject,
  addMembers,
  assignTasks,
  getUserTasks,
  markTaskCompleted,
  updateProject,
  getProjectById,
  getProjectByStatus,
  deleteProjectById,
  getTopContributors,
  removeMember,
  deleteTask,
} from "../controllers/workspace-controller.js";

import authMiddleware from "../middlewares/auth-middleware.js"; // ✅ Ensure authentication

const router = express.Router();

// ✅ Create new project
router.post("/create", authMiddleware, createNewProject);

// ✅ Add members to a project
router.post("/add-members", authMiddleware, addMembers);

// ✅ Update project info (GitHub, status, etc.)
router.put("/update/:projectId", authMiddleware, updateProject);

// ✅ Get project by ID
router.get("/get/:projectId", authMiddleware, getProjectById);

// ✅ Get projects by status
router.get("/", authMiddleware, getProjectByStatus);

// ✅ Delete a project
router.delete("/delete/:projectId", authMiddleware, deleteProjectById);

// ✅ Remove member from project
router.delete("/remove-member", authMiddleware, removeMember);

// ✅ Assign task to a member
router.post("/assign-task", authMiddleware, assignTasks);

// ✅ Get tasks assigned to logged-in user
router.get("/:projectId/user-tasks", authMiddleware, getUserTasks);

// ✅ Mark a task completed
router.put("/task/complete", authMiddleware, markTaskCompleted);

// ✅ Delete a task
router.delete("/:projectId/task/:taskId", authMiddleware, deleteTask);

// ✅ Get top contributors for a project
router.get("/:projectId/top-contributors", authMiddleware, getTopContributors);

// 1. Redirect to Google Login
router.get("/auth",authMiddleware ,  (req, res) => {
  const user = req.user.userID || req.user._id;
  const url = getAuthUrl(user);
  res.redirect(url);
});

// 2. Callback
router.get("/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const userId = req.query.state; // ⭐ get userId

    const { access_token, refresh_token, expiry_date } =
      await getTokens(code);

    // 🔥 Update user in DB
    await User.findByIdAndUpdate(userId, {
      googleAccessToken: access_token,
      googleRefreshToken: refresh_token,
      googleTokenExpiry: expiry_date,
    });

    res.send("Google Calendar Connected Successfully ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send("OAuth Failed ❌");
  }
});

// 3. Create Event
router.post("/create-event/:id", async (req, res) => {
 const user = req.user.userID || req.user._id;

  const event = await createCalendarEvent({
    accessToken: user.googleAccessToken,
    refreshToken: user.googleRefreshToken,
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });

  res.json(event);
});

router.delete("/event/:eventId", async (req, res) => {
  const result = await deleteCalendarEvent({
    accessToken: req.user.googleAccessToken,
    refreshToken: req.user.googleRefreshToken,
    eventId: req.params.eventId,
  });

  res.json(result);
});

router.get("/events/:id", async (req, res) => {
  const events = await getCalendarEvents({
    accessToken: req.user.googleAccessToken,
    refreshToken: req.user.googleRefreshToken,
  });

  const filtered = events.filter(e =>
    e.description?.includes(`workspaceId:${req.params.workspaceId}`)
  );

  res.json(filtered);
});

export default router;