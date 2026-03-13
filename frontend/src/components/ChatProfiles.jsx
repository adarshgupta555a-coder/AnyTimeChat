import React, { useEffect } from 'react'
import { getAllprofiles } from '../utils/getAllprofiles'
import { useNavigate } from 'react-router-dom'

const ChatProfile = ({ chat, setchatProfile, setSelectedChat, selectedChat, OnlineUsers, chatMessages, setDate }) => {
    const navigate = useNavigate();
   
    useEffect(() => {
        getAllprofiles().then((data) => {
            setchatProfile(data)
            if (data.message === "Please login first") {
                navigate("/signin");
            }
        }).catch(err => console.log(err))
    }, [])

    return (
        <div
            onClick={() => setSelectedChat(chat)}
            className={`px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer transition ${selectedChat?._id === chat?._id ? 'bg-gray-100' : ''
                }`}
        >
            <div className="relative flex-shrink-0">
                <img
                    src={chat?.profilePic}
                    alt={chat?.username}
                    className="w-12 h-12 rounded-full"
                />
                {OnlineUsers?.length > 0 && OnlineUsers.includes(chat._id) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-indigo-600 border-2 border-white rounded-full"></div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">{chat.username}</h3>
                    <span className="text-xs text-gray-500 ml-2">{chatMessages?.findLast((u) => u?.senderId === chat._id)?.createdAt && setDate(chatMessages?.findLast((u) => u?.senderId === chat._id)?.createdAt) || setDate(chat?.lastMessage?.createdAt) || "5:30"}</span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{chatMessages?.findLast((u) => u?.senderId === chat._id)?.text || chat?.lastMessage?.text || "hey there I am chating..."}</p>

                </div>
            </div>
        </div>
    )
}

export default ChatProfile
