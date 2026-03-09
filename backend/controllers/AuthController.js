const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const cloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");


const Signup = async (req, res) => {
    try {
        const { username, email, password, profilepic, subscribe } = req.body;
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
        res.cookie("token", token);
        res.status(200).send({ message: "Signup Successfully." })
    } catch (error) {
        console.log(error)
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
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).send({ message: "Signin Successfully", token: token })
    } catch (error) {
        console.log("hi error")
        console.log(error)
    }
}



const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).send(users)
        // console.log(req.cookies.token);
        // console.log(req.user)
    } catch (error) {
        console.log(error)
    }
}

const logoutUser = async (req, res) => {
    res.cookie("token", "");
    res.redirect('/');
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