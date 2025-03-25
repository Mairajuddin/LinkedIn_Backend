import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
} from "../controllers/eventController.js";

const router = express.Router();

// ✅ Get all events
router.get("/", protectRoute, getAllEvents);

// ✅ Create a new event (only "admin" or "head" users allowed)
router.post("/create", protectRoute, createEvent);

// ✅ Delete an event (admin can delete any, user can delete only own)
router.delete("/delete/:id", protectRoute, deleteEvent);

export default router;
