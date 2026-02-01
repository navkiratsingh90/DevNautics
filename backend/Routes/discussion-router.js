import express from "express";
import {
    createDiscussion,
    getDiscussions,
    editDiscussion,
    deleteDiscussion,
    giveAdminRole,
    requestToJoinDiscussion,
    acceptUserInDiscussion,
    leaveDiscussion,
    rejectJoinRequest,
} from '../controllers/discussion-controller.js';

import authMiddleware from "../middlewares/auth-middleware.js";
import singleUpload from '../middlewares/multer-middleware.js';

const router = express.Router();

/**
 * CREATE DISCUSSION
 * @route   POST /api/discussions/create
 */
router.post(
    "/create",
    authMiddleware,
    singleUpload,
    createDiscussion
);

/**
 * GET USER DISCUSSIONS
 * @route   GET /api/discussions
 */
router.get("/get", authMiddleware, getDiscussions);

/**
 * EDIT DISCUSSION
 * @route   PUT /api/discussions/edit
 */
router.put("/edit", authMiddleware,singleUpload, editDiscussion);

/**
 * DELETE DISCUSSION
 * @route   DELETE /api/discussions/delete
 */
router.delete("/delete", authMiddleware, deleteDiscussion);

/**
 * GIVE ADMIN ROLE
 * @route   POST /api/discussions/make-admin
 */
router.post("/make-admin", authMiddleware, giveAdminRole);

/**
 * REQUEST TO JOIN DISCUSSION
 * @route   POST /api/discussions/request-join
 */
router.post("/request-join", authMiddleware, requestToJoinDiscussion);

/**
 * ACCEPT USER IN DISCUSSION
 * @route   POST /api/discussions/accept-user
 */
router.post("/accept-user", authMiddleware, acceptUserInDiscussion);

/**
 * REJECT JOIN REQUEST
 * @route   POST /api/discussions/reject-user
 */
router.post("/reject-user", authMiddleware, rejectJoinRequest);

/**
 * LEAVE DISCUSSION
 * @route   POST /api/discussions/leave
 */
router.post("/leave", authMiddleware, leaveDiscussion);

export default router;
