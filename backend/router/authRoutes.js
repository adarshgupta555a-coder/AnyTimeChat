const express = require("express")
const router = express.Router();
const {Signup, getAllUsers, Signin} = require("../controllers/AuthController");
const isLoggedin = require("../middleware/isLoggined");


router.get("/",isLoggedin,getAllUsers);
router.post("/signup",Signup);
router.post("/signin",Signin);

module.exports = router;