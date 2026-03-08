const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const userSocketMap = new Map();

const getRoomId = (a, b) => [a, b].sort().join("_");
let usersStatus = new Set();

// 🔐 Socket Handshake Auth
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    socket.userId = decoded.id;

    console.log("Authenticated user:", socket.userId);
    next();
  } catch (err) {
    console.log("Auth error:", err.message);
    next(new Error("Authentication failed"));
  }
});

io.on("connection", async (socket) => {
  console.log("✅ User connected:", socket.userId);
  // userSocketMap[socket.userId] = socket.id;
  //  const username =  await userModel.updateOne(
  //     { _id: socket.userId },
  //     { $set: { "active": true } }
  //   )

  // console.log(username.name);

  usersStatus.add(socket.userId);
  userSocketMap.set(socket.userId, socket.id);

  io.emit("online-user", {
    usersStatus: [...usersStatus]
  });

  socket.on("join-chat", ({ receiverId }) => {
    const roomId = getRoomId(socket.userId, receiverId);
    socket.join(roomId);
    console.log("Joined room:", roomId);
  });

  socket.on("typing", ({ receiverId }) => {

    const roomId = getRoomId(socket.userId, receiverId)

    socket.to(roomId).emit("user-typing", {
      userId: socket.userId
    })

  })

  socket.on("stop-typing", ({ receiverId }) => {

    const roomId = getRoomId(socket.userId, receiverId)

    socket.to(roomId).emit("user-stop-typing", {
      userId: socket.userId
    })

  })

  socket.on("send-message", async ({ receiverId, text, image }) => {
    const roomId = getRoomId(socket.userId, receiverId);
    console.log(text)

    // 1️⃣ Save message in MongoDB
    const message = await messageModel.create({
      roomId,
      senderId: socket.userId,
      receiverId: receiverId,
      text,
      image,
      messageType: image ? "image" : "text",
      status: userSocketMap.get(receiverId) ? "delivered" : "sent"
    });

    // 2️⃣ Emit to room (real-time)
    io.to(roomId).emit("receive-message", {
      _id: message._id,
      roomId: message.roomId,
      senderId: message.senderId,
      receiverId: message.receiverId,
      text: message.text,
      image: message.image,
      status: message.status,
      createdAt: message.createdAt,
    });


  });

  socket.on("disconnect", async () => {
    // await userModel.updateOne(
    //   { _id: socket.userId },
    //   { $set: { "active": false } }
    // )
    usersStatus.delete(socket.userId);
    userSocketMap.delete(socket.userId);
    console.log(usersStatus)
    io.emit("offline-user", {
      userId: socket.userId
    });


  });
});


module.exports = { app, server, io };
