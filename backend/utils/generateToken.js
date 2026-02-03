const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_TOKEN,  
        { expiresIn: "1h" }
    );
}   

module.exports = generateToken;