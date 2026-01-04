import express from "express";
import {
  registerUser,
  verifyUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  jwtAuth,
} from "../controllers/auth-controller.js";

const router = express.Router();

// Auth APIs
router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
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
