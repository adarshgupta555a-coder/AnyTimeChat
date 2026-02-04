const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_CONNECTION).then((res)=>{
    console.log("Mongodb is connected.")
}).catch((err)=>{
    console.log(err)
});

module.exports = mongoose.connection;