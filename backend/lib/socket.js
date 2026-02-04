const Message = require('../models/messageModel');

const app = require('express')();
const server = require('http').createServer(app);
const {Server} = require("socket.io")
require("dotenv").config();

// const io = require('socket.io')(server);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});


const userSocketMap = {};
const getRoomId = (a, b) => {
  return [a, b].sort().join("_");
};

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        const decoded = jwt.verify(token, JWT_TOKEN);
        socket.userId = decoded.userId;
        next();
    } catch {
        next(new Error("Authentication failed"));
    }
});

io.on("connection", (socket) => {
    userSocketMap[socket.userId] = socket.id;
    console.log("User connected:", socket.userId);

    socket.on("join-chat", ({ receiverId }) => {
        const roomId = [socket.userId, receiverId].sort().join("_");
        socket.join(roomId);
    });

    socket.on("send-message", async (data) => {
        const roomId = getRoomId(socket.userId, receiverId);

        try {
            // 1️⃣ Save message in MongoDB
            const message = await Message.create({
                roomId,
                senderId: socket.userId,
                receiverId:receiverId,
                text,
                image,
                messageType: image ? "image" : "text",
                status: userSocketMap[receiverId] ? "delivered" : "sent",
            });

            // 2️⃣ Emit to room (real-time)
            io.to(roomId).emit("receive-message", {
                _id: message._id,
                roomId: message.roomId,
                senderId: message.senderId,
                text: message.text,
                image: message.image,
                status: message.status,
                createdAt: message.createdAt,
            });
        } catch (err) {
            console.log("Message save error:", err.message);
        }

    });

    socket.on("disconnect", () => {
        delete userSocketMap[socket.userId];
        console.log("User disconnected:", socket.userId);
    });
});

module.exports = { app, server }