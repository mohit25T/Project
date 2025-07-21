import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Message from "../models/Message.js";

const setupSocketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5137", // Adjust to your frontend
            credentials: true
        }
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) throw new Error("No token provided");

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select("-password");
            if (!user) throw new Error("User not found");

            socket.user = user;
            next();
        } catch (error) {
            console.error("Socket Auth Error:", error.message);
            next(new Error("Authentication failed"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`🟢 ${socket.user.name} connected`);

        // User joins their personal room (userId based)
        socket.join(socket.user._id.toString());

        socket.on("sendMessage", async ({ receiverId, text }) => {
            try {
                const message = new Message({
                    sender: socket.user._id,
                    receiver: receiverId,
                    text
                });

                await message.save();

                io.to(receiverId).emit("receiveMessage", {
                    sender: { _id: socket.user._id, name: socket.user.name },
                    text: message.text,
                    timestamp: message.createdAt
                });

                console.log(`📩 ${socket.user.name} -> ${receiverId}: ${text}`);
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("errorMessage", { error: "Failed to send message." });
            }
        });

        socket.on("disconnect", () => {
            console.log(`🔴 ${socket.user.name} disconnected`);
        });
    });

    return io;
};

export default setupSocketServer;
