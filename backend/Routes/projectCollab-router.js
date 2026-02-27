import express from "express";
import {
    createNewProjectCollaboration,
    updateCurrentProject,
    getAllProjects,
    getProjectById,
    deleteProjectById,
    addTeammate,
} from "../controllers/project-controller.js"

import authMiddleware  from "../middlewares/auth-middleware.js";
import singleUpload from "../middlewares/multer-middleware.js";

const router = express.Router();

/**
 * =========================
 * PROJECT COLLAB ROUTES
 * =========================
 */

// Create new project collaboration
router.post(
    "/create",
    authMiddleware,
    singleUpload,
    createNewProjectCollaboration
);

// Get all projects (with filters, sort, pagination)
router.post("/get", getAllProjects);


// Get project by ID
router.get(
    "/:id",
    getProjectById
);

// Update project (add roles / team members / status / description)
router.put(
    "/:id",
    authMiddleware,
    updateCurrentProject
);

// Delete project
router.delete(
    "/:id",
    authMiddleware,
    deleteProjectById
);



router.post(
    "/:id/add-member",
    authMiddleware,
    addTeammate
);


export default router;
