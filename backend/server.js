import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import setupSocketServer from "./utils/socketServer.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import coherePollRoutes from "./routes/pollsChoreRoutes.js";
import chatbotRoutes from "./routes/chatbotRoute.js";
import rateLimit from "express-rate-limit";

import marketplaceRoutes from "./routes/marketplaceRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = setupSocketServer(server);

// For __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

// Static files for profile pics or uploads
app.use('/uploads/profiles', express.static(path.join(path.resolve(), 'uploads/profiles')));
app.use('/uploads/posts', express.static(path.join(path.resolve(), 'uploads/posts')));

app.use("/uploads", express.static("uploads"));
app.use("/api/search", searchRoutes);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/friends", friendRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/api/messages", chatRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use('/api/polls', coherePollRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/events", eventRoutes);

// Limit: 5 requests per minute per IP
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Too many requests. Please try again later.",
});

app.use("/api/chatbot", limiter);
// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
