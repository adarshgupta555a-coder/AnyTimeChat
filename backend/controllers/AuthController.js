const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const cloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");


const Signup = async (req, res) => {
    try {
        const { username, email, password, profilepic, subscribe } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userCheck = await userModel.findOne({ email: email });
        if (userCheck) return res.status(400).send({ message: "this email is already exists." });

        let profileImage = "";

        if (req.file) {
            profileImage = await cloudinaryImage(req.file.path);
        }
        console.log(profileImage)

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            profilePic: profileImage,
            username,
            email,
            password: hashPassword,
            msg: subscribe
        })

        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).send({ message: "Signup Successfully." })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const Signin = async (req, res) => {
    try {
        const { email, password, msg } = req.body;
        // console.log(email)
        const userCheck = await userModel.findOne({ email: email });
        // console.log(userCheck)
        if (!userCheck) {
            return res.status(400).send({ message: "email Id and password is invalid." })
        }

        const MatchPassword = await bcrypt.compare(password, userCheck.password);
        if (!MatchPassword) {
            return res.status(400).send({ message: "email Id and password is invalid." })
        }

        if (msg) {
            userCheck.msg = msg;
            await userCheck.save();
        }

        const token = generateToken(userCheck);
        // console.log(token)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).send({ message: "Signin Successfully", token: token })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}



const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select("-password -__v");;
        res.status(200).send(users)
        // console.log(req.cookies.token);
        // console.log(req.user)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const logoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none"
    });

    res.status(200).json({ message: "Logged out successfully" });
}

const verifyToken = async (req, res) => {
    try {

        // console.log("Cookies:", req.cookies);
        const token = req.cookies?.token;

        // console.log("Token:", token);

        if (!token) {
            return res.status(401).send({ message: "Please login first" });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);

        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).send({ message: "User not found" });
        }

        res.status(200).send({ user: user, token: token });

    } catch (error) {
        console.log(error);
        return res.status(401).send({ message: "Invalid token" });
    }
};


const cloudinaryImage = async (filename) => {
    try {
        const result = await cloudinary.uploader.upload(filename, {
            folder: "profile_pics"
        });
        return result.secure_url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};


module.exports = { Signup, Signin, getAllUsers, logoutUser, cloudinaryImage, verifyToken };