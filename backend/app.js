const express = require("express")
const cors = require("cors");
// const app  = express()
const AuthRoutes = require("./router/authRoutes");
const messageRoutes = require("./router/messageRoutes");
const cookieParser = require("cookie-parser");
const db = require("./utils/db");
const { app, server } = require("./lib/socket")
require("dotenv").config();

app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL, // ya 3000 / frontend URL
    credentials: true
}));

app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.use("/users", AuthRoutes);
app.use("/chatroom", messageRoutes)

const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
