import { verifyJWTToken } from "../services/common_utils.js"; // Import your JWT verification function
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../Configurations/config.js";

export const protectRoute = async (req, res, next, roles = []) => {
  try {
    // console.log("===== Incoming Request =====");
    // console.log("Request Method:", req.method);
    // console.log("Received Headers:", req.headers);
    // console.log("Received Cookies:", req.cookies);
    const token = req.cookies["jwt-linkedin"];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = verifyJWTToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    if (roles.length > 0 && !roles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden - Insufficient permissions" });
    }

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const protectRoute = async (req, res, next, roles = []) => {
//   try {
//     const token = req.cookies["jwt-linkedin"];
//     console.log("Received Token:", token);

//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized - No Token Provided" });
//     }

//     const decoded = verifyJWTToken(token);
//     // console.log("Decoded Token:", decoded);

//     if (!decoded) {
//       return res.status(401).json({ message: "Unauthorized - Invalid Token" });
//     }

//     const user = await User.findById(decoded.userId).select("-password");
//     // console.log("Fetched User:", user);

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user;

//     if (roles.length > 0 && !roles.includes(user.role)) {
//       return res
//         .status(403)
//         .json({ message: "Forbidden - Insufficient permissions" });
//     }

//     next();
//   } catch (error) {
//     console.log("Error in protectRoute middleware:", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
