const express = require("express")
const router = express.Router();
const {Signup, getAllUsers, Signin} = require("../controllers/AuthController");

router.get("/",getAllUsers);
router.post("/signup",Signup);
router.post("/signin",Signin);

module.exports = router;