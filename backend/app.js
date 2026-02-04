const express = require("express")
const cors = require("cors");
// const app  = express()
const AuthRoutes = require("./router/authRoutes")
const cookieParser = require("cookie-parser");
const db = require("./utils/db");
const {app, server} = require("./lib/socket")
require("dotenv").config();

app.use(cors({
    origin: "http://localhost:5173", // ya 3000 / frontend URL
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())

app.use(express.urlencoded({extended:true}));

app.use("/users",AuthRoutes)

server.listen(3000,()=>{
    console.log("port is running on 3000")
})