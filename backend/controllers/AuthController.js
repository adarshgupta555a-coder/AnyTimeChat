const userModel = require("../models/userModel");
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');


const Signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userCheck = await userModel.findOne({ email: email });
        if (userCheck) return res.status(400).send({ message: "this email is already exists." });

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            username,
            email,
            password: hashPassword
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
        const { email, password } = req.body;
        const userCheck = await userModel.findOne({ email: email });
        if (!userCheck) {
            return res.status(400).send({ message: "email Id and password is invalid." })
        }

        const MatchPassword = await bcrypt.compare(password, userCheck.password);
        if (!MatchPassword) {
            return res.status(400).send({ message: "email Id and password is invalid." })
        }

        const token = generateToken(userCheck);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,      // localhost ke liye FALSE
            sameSite: "lax"
        });

        res.status(200).send({ message: "Signin Successfully" })
    } catch (error) {
        console.log(error)
    }
}



const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.status(200).send(users)
        console.log(req.cookies.token);
        console.log(req.user)
    } catch (error) {
        console.log(error)
    }
}

const logoutUser = async (req, res) => {
    res.cookie("token", "");
    res.redirect('/');
}

module.exports = { Signup, Signin, getAllUsers, logoutUser };