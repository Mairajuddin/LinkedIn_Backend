import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { accessChat, fetchChats } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", protectRoute, accessChat);
router.get("/", protectRoute, fetchChats);

export default router;
