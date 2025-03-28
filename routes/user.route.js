// import express from "express";
// import { protectRoute } from "../middleware/auth.middleware.js";
// import {
//   getSuggestedConnections,
//   getPublicProfile,
//   updateProfile,
// } from "../controllers/user.controller.js";
// import multer from "multer";
// const upload = multer();
// const router = express.Router();

// router.get("/suggestions", protectRoute, getSuggestedConnections);
// router.get("/:username", protectRoute, getPublicProfile);

// router.put("/update-profile", upload.none(), protectRoute, updateProfile);

// export default router;
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getSuggestedConnections,
  getPublicProfile,
  updateProfile,
  addExperience,
  addCertification,
  addEducation,
  getUserReport,
} from "../controllers/user.controller.js";
import multer from "multer";
import path from "path";
import upload from "../Configurations/upload.js";

const router = express.Router();

router.get("/suggestions", protectRoute, getSuggestedConnections);
router.get("/:username", protectRoute, getPublicProfile);

router.put(
  "/update-profile",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "bannerImg", maxCount: 1 },
  ]),
  protectRoute,
  updateProfile
);
router.post(
  "/add-certification",
  protectRoute,
  upload.single("file"),
  addCertification
);

router.post("/add-experience", protectRoute, addExperience);
router.post("/add-education", protectRoute, addEducation);
router.post(
  "/my-report",
  (req, res, next) => {
    protectRoute(req, res, next, ["user"]);
  },
  getUserReport
);
// GET METHOD IS NOT WORKING BUT BY USING POST REPORT GET SUCCESSFULLY WILL CHECK THIS ISSUE IN THE END HASSSAN BETA

export default router;
