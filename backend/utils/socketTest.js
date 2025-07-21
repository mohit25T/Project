import { io } from "socket.io-client";

const socket = io("http://localhost:5002", {
    auth: {
        token: "YOUR_VALID_JWT_TOKEN"
    }
});

socket.on("connect", () => {
    console.log("✅ Test connected as:", socket.id);
    socket.emit("joinRoom", { room: "RECEIVER_USER_ID" });
    socket.emit("sendMessage", { room: "RECEIVER_USER_ID", message: "Test message!" });
});

socket.on("receiveMessage", (data) => {
    console.log("📥 Test received message:", data);
});

socket.on("disconnect", () => {
    console.log("❌ Test client disconnected.");
});
