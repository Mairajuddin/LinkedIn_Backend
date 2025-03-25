import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { sendMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", protectRoute, sendMessage); // ✅ POST for sending a message
router.get("/:chatId", protectRoute, getMessages); // ✅ GET for fetching messages

export default router; // ✅ Correct export
