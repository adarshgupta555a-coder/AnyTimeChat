const userModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const isLoggedin = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
            console.log(req.cookies)

        if (!token) {
            return res.status(401).send({ message: "Please login first" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);

        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).send({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {

       return res.status(401).send({ message: "Invalid token" });
    }
};


module.exports = isLoggedin;