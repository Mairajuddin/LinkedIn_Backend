import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";
import Post from "../models/post.model.js";

export const getSuggestedConnections = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select("connections");

    // find users who are not already connected, and also do not recommend our own profile!! right?
    const suggestedUser = await User.find({
      _id: {
        $ne: req.user._id,
        $nin: currentUser.connections,
      },
    })
      .select("name username profilePicture headline")
      .limit(3);

    res.json(suggestedUser);
  } catch (error) {
    console.error("Error in getSuggestedConnections controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in getPublicProfile controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  console.log("guuuullllooooooooooooooooooooooo", req.body);
  try {
    const allowedFields = [
      "name",
      "username",
      "headline",
      "about",
      "location",
      "skills",
      "experience",
      "education",
      "certifications",
    ];

    const updatedData = {};

    for (const field of allowedFields) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }

    if (req.files?.profilePicture) {
      const file = req.files.profilePicture[0]; // Get the file
      const result = await cloudinary.uploader.upload(file.path); // Upload file
      updatedData.profilePicture = result.secure_url;
    }

    if (req.files?.bannerImg) {
      const file = req.files.bannerImg[0]; // Get the file
      const result = await cloudinary.uploader.upload(file.path); // Upload file
      updatedData.bannerImg = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updatedData },
      { new: true }
    ).select("-password");

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addCertification = async (req, res) => {
  try {
    const { title, institute, startDate, endDate, description } = req.body;

    if (!title || !institute || !startDate || !endDate || !description) {
      return res.status(400).json({
        success: false,
        message: "All certification fields are required.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new certification object
    const newCertification = {
      _id: new mongoose.Types.ObjectId(),
      title,
      institute,
      startDate,
      endDate,
      description,
      file: "", // Assuming no file upload initially
    };

    user.certifications.push(newCertification);
    // user.isVerified = true;

    await user.save();

    res.json({ success: true, data: user.certifications });
  } catch (error) {
    console.error("Error in addCertification:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addExperience = async (req, res) => {
  try {
    const { title, company, startDate, endDate, description } = req.body;

    if (!title || !company || !startDate || !endDate || !description) {
      return res.status(400).json({
        success: false,
        message: "All experience fields are required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new experience object
    const newExperience = {
      _id: new mongoose.Types.ObjectId(),
      title,
      company,
      startDate,
      endDate,
      description,
    };

    user.experience.push(newExperience);

    await user.save();

    res.json({ success: true, data: user.experience });
  } catch (error) {
    console.error("Error in addExperience:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addEducation = async (req, res) => {
  try {
    const { school, fieldOfStudy, startYear, endYear } = req.body;

    if (!school || !fieldOfStudy || !startYear) {
      return res.status(400).json({
        success: false,
        message: "School, fieldOfStudy, and startYear are required.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the education already exists
    const exists = user.education.some(
      (edu) =>
        edu.school === school &&
        edu.fieldOfStudy === fieldOfStudy &&
        edu.startYear === startYear
    );

    if (exists) {
      return res
        .status(400)
        .json({ message: `Education at ${school} already exists.` });
    }

    // Create new education entry
    const newEducation = {
      _id: new mongoose.Types.ObjectId(),
      school,
      fieldOfStudy,
      startYear,
      endYear: endYear || null,
    };

    user.education.push(newEducation);
    await user.save();

    res.json({ success: true, data: user.education });
  } catch (error) {
    console.error("Error in addEducation:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserReport = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId, "UUSSSEERRR-IIDD");

    const totalPosts = await Post.countDocuments({ author: userId });

    const userPosts = await Post.find({ author: userId });
    const totalComments = userPosts.reduce(
      (sum, post) => sum + post.comments.length,
      0
    );

    const totalShares = await Post.countDocuments({
      sharedPost: { $ne: null },
      author: userId,
    });

    const totalLikes = userPosts.reduce(
      (sum, post) => sum + post.likes.length,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        totalPosts,
        totalComments,
        totalShares,
        totalLikes,
      },
    });
  } catch (error) {
    console.error("Error in getUserReport controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
