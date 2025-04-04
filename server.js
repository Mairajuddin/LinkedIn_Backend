import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import http from "http";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
// eventRoutes
import { connectDB } from "./lib/db.js";
import adminRouter from "./routes/adminRoutes.js";
import { setupSocket } from "./Configurations/socket.js"; // ✅ Import Socket Setup
// import { setupSocket } from "./socket.js";  // ✅ Make sure the `.js` extension is included

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ Create HTTP Server
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Setup Socket.io
setupSocket(server); // ✅ Initialize Socket.io

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

app.use(express.json({ limit: "5mb" })); // parse JSON request bodies
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/connections", connectionRoutes);
app.use("/admin", adminRouter);
// Add these lines
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/events", eventRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
