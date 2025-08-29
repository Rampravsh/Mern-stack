import express from "express";
import {
  register,
  login,
  google,
  forgotPassword,
  resetPassword,
  logout,
  verifyOTPController,
  resendOTPController,
} from "../controllers/authController.js";
import { isVerified } from "../middlewares/authMiddleware.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", verifyToken, isVerified, login);
router.post("/google", google);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-otp", verifyOTPController);
router.post("/resend-otp", resendOTPController);
router.get("/logout", logout);

export default router;
