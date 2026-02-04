const express = require("express")
const router = express.Router();
const {Signup, getAllUsers, Signin} = require("../controllers/AuthController");
const isLoggedin = require("../middleware/isLoggined");
const upload = require("../middleware/multer");


router.get("/",isLoggedin,getAllUsers);
router.post("/signup",upload.single("image"),Signup);
router.post("/signin",Signin);

module.exports = router;