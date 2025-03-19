import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { encryptPassword } from "../services/common_utils.js";
import { readMultiple, readSingle } from "../database/dbFunctions.js";
import { HTTP_STATUS } from "../services/constants.js";
import Post from "../models/post.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await readMultiple(User, { role: "user" });

    if (!users.length) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPendingCertifications = async (req, res) => {
  try {
    const users = await User.find({ "certifications.isVerified": false })
      .select("name email certifications")
      .sort({ createdAt: -1 }); // 🟢 Sort by latest users first

    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching pending certifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const approveCertification = async (req, res) => {
  try {
    const { userId, certId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const cert = user.certifications.id(certId);
    if (!cert)
      return res.status(404).json({ message: "Certification not found" });

    cert.isVerified = true;

    const allCertsVerified = user.certifications.every((c) => c.isVerified);
    user.isVerified = allCertsVerified;

    await user.save();

    res.json({ success: true, message: "Certification approved", user });
  } catch (error) {
    console.error("Error approving certification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserReportByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Total posts count
    const totalPosts = await Post.countDocuments({ author: userId });

    // Total comments received on user's posts
    const userPosts = await Post.find({ author: userId });
    const totalComments = userPosts.reduce(
      (sum, post) => sum + post.comments.length,
      0
    );

    // Total shares count
    const totalShares = await Post.countDocuments({
      sharedPost: { $ne: null },
      author: userId,
    });

    // Total likes received on user's posts
    const totalLikes = userPosts.reduce(
      (sum, post) => sum + post.likes.length,
      0
    );

    res.status(200).json({
      success: true,
      user: userExists.name,
      data: {
        totalPosts,
        totalComments,
        totalShares,
        totalLikes,
      },
    });
  } catch (error) {
    console.error("Error in getUserReportByAdmin controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
