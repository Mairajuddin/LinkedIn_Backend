import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  updateEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", protectRoute, getAllEvents); //post sy get kia hy

router.post("/create", protectRoute, createEvent);
router.put("/:eventId", protectRoute, updateEvent);

router.delete("/delete/:id", protectRoute, deleteEvent);

export default router;
//67e89a4407d6f57454b66000
