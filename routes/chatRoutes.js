import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { accessChat, fetchChats } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", protectRoute, accessChat); // ✅ POST for creating/accessing a chat
router.get("/", protectRoute, fetchChats); // ✅ GET for fetching user's chats

export default router; // ✅ Correct Export
