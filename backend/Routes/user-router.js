import express from "express";
import {
  getUserProfile,
  updateUserProfile,

  addEducation,
  deleteEducation,

  addWorkExperience,
  deleteWorkExperience,

  updateSkills,

  sendConnectionRequest,
  approveConnectionRequest,
  getPendingRequests,
  removeConnection,
  addProject,
} from "../controllers/user-controller.js";
import authMiddleware from '../middlewares/auth-middleware.js'
import singleUpload from "../middlewares/multer-middleware.js";

const router = express.Router();

/* ===================== PROFILE ===================== */

router.get("/profile", authMiddleware, getUserProfile);
router.put("/update-profile", authMiddleware, updateUserProfile);

/* ===================== EDUCATION ===================== */

router.post("/education", authMiddleware, addEducation);
router.delete("/education/:eduId", authMiddleware, deleteEducation);

/* ===================== WORK EXPERIENCE ===================== */

router.post("/work-experience", authMiddleware, addWorkExperience);
router.delete("/work-experience/:workId", authMiddleware, deleteWorkExperience);

router.post("/project",singleUpload ,authMiddleware, addProject);
/* ===================== SKILLS ===================== */

router.put("/update-skills", authMiddleware, updateSkills);

/* ===================== CONNECTIONS ===================== */

// send request
router.post("/connections/request", authMiddleware, sendConnectionRequest);

// approve request
router.post("/connections/approve", authMiddleware, approveConnectionRequest);

// get pending requests
router.get("/connections/pending", authMiddleware, getPendingRequests);

// remove connection
router.delete("/connections/remove", authMiddleware, removeConnection);

export default router;
