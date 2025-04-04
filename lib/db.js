import mongoose from "mongoose";
import { createSuperAdmin } from "../services/common_utils.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URL || "mongodb://localhost:27017/LinkedIn-Clone"
      // "mongodb+srv://qazimairaj4:H1kYY4suDfUrCCXr@cluster0.wa7s7.mongodb.net"
    );

    console.log("✅ DB connection successful");
    await createSuperAdmin();

    mongoose.connection.on("close", () => {
      console.log("⚠ DB connection CLOSED");
    });
  } catch (error) {
    console.error("❌ ERROR IN CONNECTING DB:", error);
  }
};
