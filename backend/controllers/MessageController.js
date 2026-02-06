const mongoose = require("mongoose");
const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");
const { cloudinaryImage } = require("./AuthController");
const { io } = require("../lib/socket");

const getRoomId = (a, b) => [a, b].sort().join("_");

const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.receiverid;
    const roomId = getRoomId(req.user._id, receiverId);

    const chatsData = await messageModel
      .find({ roomId })

    res.status(200).json(chatsData);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Room not found" });
  }
};

const getProfiles = async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.user._id);

    const users = await userModel.aggregate([
      {
        $lookup: {
          from: "messages",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ["$senderId", currentUserId] },
                        { $eq: ["$receiverId", "$$userId"] }
                      ]
                    },
                    {
                      $and: [
                        { $eq: ["$senderId", "$$userId"] },
                        { $eq: ["$receiverId", currentUserId] }
                      ]
                    }
                  ]
                }
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
          ],
          as: "lastMessage"
        }
      },
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          password: 0,
          __v: 0
        }
      },
      {
        $sort: { "lastMessage.createdAt": -1 }
      }
    ]);


    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Something went wrong" });
  }
};

// const uploadImage = async (req, res)=>{
//   try {
//       let profileImage = "";

//       profileImage = await cloudinaryImage(req.file.path);
 
//         // 1️⃣ Save message in MongoDB
//           const message = await messageModel.create({
//             roomId,
//             senderId: req.user._id,
//             receiverId: receiverId,
//             text,
//             image,
//             messageType: image ? "image" : "text",
//             status: userSocketMap[receiverId] ? "delivered" : "sent",
//           });
      
//           // 2️⃣ Emit to room (real-time)
//           io.to(roomId).emit("receive-message", {
//             _id: message._id,
//             roomId: message.roomId,
//             senderId: message.senderId,
//             text: message.text,
//             image: message.image,
//             status: message.status,
//             createdAt: message.createdAt,
//           });
//         res.status(200).send({imageUrl: profileImage});
//   } catch (error) {
//     console.log(error)
//   }
// }



const handlemsgWithImg = async (req, res)=>{
  try {
    const {text, receiverId} = req.body;

      let profileImage = "";

      profileImage = await cloudinaryImage(req.file.path);
     const roomId = getRoomId(req.user._id, receiverId);

        // 1️⃣ Save message in MongoDB
          const message = await messageModel.create({
            roomId,
            senderId: req.user._id,
            receiverId: receiverId,
            text,
            image:profileImage,
            messageType: profileImage ? "image" : "text",
            status: receiverId ? "delivered" : "sent",
          });
      
          // 2️⃣ Emit to room (real-time)
          io.to(roomId).emit("receive-message", {
            _id: message._id,
            roomId: message.roomId,
            senderId: message.senderId,
            text: message.text,
            image: message.image,
            status: message.status,
            createdAt: message.createdAt,
          });
        res.status(200).send({imageUrl: profileImage});
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getMessages, getProfiles, handlemsgWithImg };
