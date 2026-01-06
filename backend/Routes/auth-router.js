import express from "express";
import {
  registerUser,
  verifyUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  jwtAuth,
  getUser,
} from "../controllers/auth-controller.js";
import authMiddleware from '../middlewares/auth-middleware.js';

const router = express.Router();

// Auth APIs
router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.get("/get-user", authMiddleware ,getUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected test route
router.get("/me", jwtAuth, (req, res) => {
  console.log("reached");
  res.status(200).json({ msg: "Authorized" });
});

router.get("/test", (req, res) => {
  res.json({ success: true, message: "Auth API working" });
});

export default router;
