import { Router } from "express";
import {
  approveCertification,
  getAllUsers,
  getPendingCertifications,
  getUserReportByAdmin,
} from "../controllers/adminController.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const adminRouter = Router();

adminRouter.get(
  "/all-users",
  (req, res, next) => {
    protectRoute(req, res, next, ["admin"]);
  },
  getAllUsers
);

adminRouter.get(
  "/certifications/pending",
  (req, res, next) => {
    protectRoute(req, res, next, ["admin"]);
  },
  getPendingCertifications
);

adminRouter.put(
  "/certifications/approve/:userId/:certId",
  (req, res, next) => {
    protectRoute(req, res, next, ["admin"]);
  },
  approveCertification
);
adminRouter.get(
  "/user-report/:userId",
  (req, res, next) => {
    protectRoute(req, res, next, ["admin"]);
  },
  getUserReportByAdmin
);
// getUserReportByAdmin
export default adminRouter;
