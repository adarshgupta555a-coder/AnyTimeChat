const mongoose = require("mongoose");

const userModel = mongoose.Schema({
    profilePic:{type:String, default: ""},
    username: {type: String, required: true},
    email: {type: String, requires: true, unqiue: true},
    password:{type:String},
    msg:{type:String, default: ""},
    date:{type:Date,default:Date.now}
})

module.exports = mongoose.model("users",userModel);