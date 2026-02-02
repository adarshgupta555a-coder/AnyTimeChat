const express = require("express")
const cors = require("cors");
const app  = express()
const AuthRoutes = require("./router/authRoutes")
const cookieParser = require("cookie-parser");

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use(express.urlencoded({extended:true}));

app.use("/users",AuthRoutes)

app.listen(3000,()=>{
    console.log("port is running on 3000")
})