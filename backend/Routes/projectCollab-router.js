import express from "express";
import {
    createNewProjectCollaboration,
    updateCurrentProject,
    getAllProjects,
    getProjectById,
    deleteProjectById,
    requestForCollaboration,
    acceptApplication,
} from "../controllers/project-controller.js"

import authMiddleware  from "../middlewares/auth-middleware.js";

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
    createNewProjectCollaboration
);

// Get all projects (with filters, sort, pagination)
router.get(
    "/get",
    getAllProjects
);

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

// Request for collaboration
router.post(
    "/:id/request",
    authMiddleware,
    requestForCollaboration
);

// Accept collaboration application
router.post(
    "/accept/:applicationId",
    authMiddleware,
    acceptApplication
);

export default router;
