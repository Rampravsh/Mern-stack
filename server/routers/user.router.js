import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getUserProfile);
router.put("/update/:id", verifyToken, updateUserProfile);

export default router;
