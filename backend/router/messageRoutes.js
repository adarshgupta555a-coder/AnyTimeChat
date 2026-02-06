const express = require("express");
const router = express.Router();
const {getMessages, getProfiles, handlemsgWithImg} = require("../controllers/MessageController");
const isLoggedin = require("../middleware/isLoggined");
const upload = require("../middleware/multer");

router.get("/profiles", isLoggedin, getProfiles);
// router.post("/upload",upload.single("image"),uploadImage);
router.post("/imagesend",upload.single("image"),isLoggedin,handlemsgWithImg);
router.get("/:receiverid", isLoggedin, getMessages);


module.exports = router;