import express from "express";
import {
  getAuthUrl,
  getTokens,
  createCalendarEvent,
} from "../services/googleCalendarService.js";

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
} from "../controllers/projectTracker-controller.js";

import authMiddleware from "../middlewares/authMiddleware.js"; // ✅ Ensure authentication

const router = express.Router();

/* -------------------- 📁 PROJECT ROUTES -------------------- */

// ✅ Create new project
router.post("/create", authMiddleware, createNewProject);

// ✅ Add members to a project
router.post("/add-members", authMiddleware, addMembers);

// ✅ Update project info (GitHub, status, etc.)
router.put("/update/:projectId", authMiddleware, updateProject);

// ✅ Get project by ID
router.get("/:projectId", authMiddleware, getProjectById);

// ✅ Get projects by status
router.get("/", authMiddleware, getProjectByStatus);

// ✅ Delete a project
router.delete("/:projectId", authMiddleware, deleteProjectById);


/* -------------------- 👥 MEMBER MANAGEMENT -------------------- */

// ✅ Remove member from project
router.delete("/remove-member", authMiddleware, removeMember);


/* -------------------- ✅ TASK MANAGEMENT -------------------- */

// ✅ Assign task to a member
router.post("/assign-task", authMiddleware, assignTasks);

// ✅ Get tasks assigned to logged-in user
router.get("/:projectId/user-tasks", authMiddleware, getUserTasks);

// ✅ Mark a task completed
router.put("/task/complete", authMiddleware, markTaskCompleted);

// ✅ Delete a task
router.delete("/:projectId/task/:taskId", authMiddleware, deleteTask);


/* -------------------- 📊 CONTRIBUTIONS -------------------- */

// ✅ Get top contributors for a project
router.get("/:projectId/top-contributors", authMiddleware, getTopContributors);


/* -------------------- 🗓️ CALENDAR MANAGEMENT -------------------- */



// 1. Redirect to Google Login
router.get("/auth", (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

// 2. Callback
router.get("/callback", async (req, res) => {
  const code = req.query.code;

  const tokens = await getTokens(code);

  // 👉 store tokens in DB (important)
  console.log(tokens);

  res.send("Connected Successfully ✅");
});

// 3. Create Event
router.post("/create-event", async (req, res) => {
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

export default router;