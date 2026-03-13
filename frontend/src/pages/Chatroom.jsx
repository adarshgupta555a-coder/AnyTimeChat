import { useEffect, useRef, useState } from 'react';
// import { jwtDecode } from "jwt-decode"
// import { socket } from './socket';
import { useSocketStore } from '../stores/socketStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/AuthStore';
import { getVerifyUser } from '../utils/getVerifyUser';
import ChatProfile from '../components/ChatProfiles';
import { getAllprofiles } from '../utils/getAllprofiles';
import ChatMessage from '../components/ChatMessages';


export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChats] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [chatProfile, setchatProfile] = useState(null);
  const [OnlineUsers, setOnlineUsers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pathImage, setPathImage] = useState(null);   // URL
  const [typingUsers, setTypingUsers] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null)
  const navigate = useNavigate()
  // const decodedPayload = jwtDecode(localStorage.getItem("token"));
  // console.log(decodedPayload);
  const chatRef = useRef(null);
  const { user, setAuth } = useAuthStore();
  const { socket, loading, connectSocket } = useSocketStore()
  const backend_url = import.meta.env.VITE_BACKEND_URL;



  // Mock data for chats

  // Mock messages
  useEffect(() => {
    if (!selectedChat?._id) return;
    getMessages(selectedChat?._id)
    socket.emit("join-chat", {
      receiverId: selectedChat._id,
    });


  }, [selectedChat]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Effect 1 - sirf auth aur socket connect karo
  useEffect(() => {
    getVerifyUser().then((data) => {
      setAuth(data)
      connectSocket()
    })
    // getAllprofiles().then((data) => {
    //   setchatProfile(data)
    //   if (data.message === "Please login first") {
    //     navigate("/signin");
    //   }
    // }).catch(err => console.log(err))
  }, [])

  // Effect 2 - jab socket ready ho TAB listeners lagao
  useEffect(() => {
    if (!socket) return  // socket nahi hai toh ruko

    socket.on("receive-message", (msg) => {
      console.log("Incoming:", msg)
      if (msg.image !== "" && msg.senderId == user?._id) return
      setChats((prev) => [...prev, msg])
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight
      }
    })

    socket.on("online-user", (data) => {
      setOnlineUsers(data.usersStatus || [])
      getAllprofiles().then((data) => {
        setchatProfile(data)
        if (data.message === "Please login first") {
          navigate("/signin");
        }
      }).catch(err => console.log(err))
    })

    socket.on("offline-user", (data) => {
      setOnlineUsers((prev = []) =>
        prev.filter((id) => id !== data.userId)
      )
    })

    socket.on("user-typing", (data) => {

      setTypingUsers(data.userId)

    })

    socket.on("user-stop-typing", (data) => {
      console.log("ssss")
      setTypingUsers(null)

    })

    return () => {
      socket.off("receive-message")
      socket.off("online-user")  // ✅ Yeh bhi cleanup karo
      socket.off("offline-user");
      socket.off("user-typing")
      socket.off("user-stop-typing")
    }
  }, [socket])  // ← socket badla (null → connected) toh yeh chale

  const getMessages = (receiverId) => {
    fetch(`${backend_url}/chatroom/${receiverId}`, {
      method: "GET",
      credentials: "include"
    }).then(res => res.json())
      .then(data => {
        console.log(data)
        setChats(data);
      });
  }


  function getCurrentTimeHHMMSS() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  const sendMessage = async () => {
    if (!pathImage) {
      return;
    }
    const formData = new FormData();
    formData.append("text", messageInput);
    formData.append("receiverId", selectedChat._id);
    formData.append("image", pathImage);
    const senderData = {
      roomId: user._id + selectedChat._id,
      senderId: user._id,
      text: messageInput,
      image: URL.createObjectURL(pathImage),
      status: "sent",
      createdAt: getCurrentTimeHHMMSS(),
    }

    setChats((prev) => [...prev, senderData]);
    setMessageInput("");
    setSelectedImage(null);
    const res = await fetch(`${backend_url}/chatroom/imagesend`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    console.log(data);

  };


  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && selectedChat && pathImage) {
      sendMessage()
    }

    if (messageInput.trim() && selectedChat && !pathImage) {
      // console.log('Sending message:', messageInput);

      const receiverId = selectedChat._id;
      socket.emit("send-message", {
        receiverId,
        text: messageInput,
        image: ""
      });
      setMessageInput("")
    }
  };

  const onTypingMessage = (val) => {

    setMessageInput(val)

    if (val.trim() !== "") {
      socket.emit("typing", { receiverId: selectedChat._id })
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {

      socket.emit("stop-typing", {
        receiverId: selectedChat._id
      })

    }, 2000)

  }

  function setDate(date) {
    const time = new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    return time;
  }

  if (loading) {
    return (<p>Loading...</p>)
  }

  return (
    <>{!loading && (<div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
          <div className="relative">
            <img
              src={user?.profilePic}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setShowUserMenu(!showUserMenu)}
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-indigo-600 border-2 border-white rounded-full"></div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-gray-800 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-3 py-2 bg-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Search or start new chat"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600 transition"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {(chatProfile?.filter(pr => pr._id != user?._id))?.map((chat) => (
            <ChatProfile key={chat._id} setchatProfile={setchatProfile} chat={chat} setSelectedChat={setSelectedChat} selectedChat={selectedChat} OnlineUsers={OnlineUsers} chatMessages={chatMessages} setDate={setDate} />
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={selectedChat?.profilePic}
                    alt={selectedChat?.username}
                    className="w-10 h-10 rounded-full"
                  />
                  {OnlineUsers?.length > 0 && OnlineUsers.includes(selectedChat._id) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-indigo-600 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedChat?.username}</h2>
                  <p className="text-xs text-gray-500">
                    {typingUsers === selectedChat._id ? "typing..." : OnlineUsers?.length > 0 && OnlineUsers.includes(selectedChat._id) ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-800 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-gray-800 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              ref={chatRef}

              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundColor: '#efeae2'
              }}
            >
              {chatMessages?.length > 0 && chatMessages?.map((message, index) => (
                <ChatMessage key={index} message={message} user={user} setDate={setDate} />
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-800 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="text-gray-600 hover:text-gray-800 transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPathImage(file)
                      setSelectedImage(URL.createObjectURL(file));
                    }
                  }}
                />


                {selectedImage && (
                  <div className="relative mb-2">
                    <img
                      src={selectedImage}
                      alt="preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />

                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => onTypingMessage(e.target.value)}
                  placeholder="Type a message"
                  className="flex-1 px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                />

                <button
                  type="submit"
                  className="bg-indigo-600 text-white p-2 rounded-full hover:bg-green-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          // Empty State
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Chat</h2>
              <p className="text-gray-600">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>)}</>
  );
}