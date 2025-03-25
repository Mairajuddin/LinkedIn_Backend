import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", protectRoute, getAllEvents); //post sy get kia hy

router.post("/create", protectRoute, createEvent);

router.delete("/delete/:id", protectRoute, deleteEvent);

export default router;
