# AnyTimeChat

A real-time chat application built with React, Node.js, and Socket.io that enables instant messaging between users with features like online status tracking, message delivery status, and image sharing.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using Socket.io
- **User Authentication**: Secure signup and signin with JWT tokens
- **Online Status**: Track which users are currently online
- **Message Status**: See sent, delivered, and seen status for messages
- **Image Sharing**: Send and receive images in chat
- **Profile Pictures**: User avatar support
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time client communication
- **JWT Decode** - Token handling on client side

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Socket.io** - Real-time server communication
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Cloudinary** - Image storage and processing
- **Multer** - File upload handling
- **Cookie Parser** - Cookie management

## 📁 Project Structure

```
anytimechat/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── lib/            # Socket.io configuration
│   ├── middleware/     # Custom middleware
│   ├── models/         # MongoDB models
│   ├── router/         # API routes
│   ├── utils/          # Utility functions
│   ├── app.js          # Main server file
│   └── package.json    # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/      # React components/pages
│   │   ├── assets/     # Static assets
│   │   ├── App.jsx     # Main App component
│   │   └── main.jsx    # Entry point
│   ├── public/         # Public files
│   └── package.json    # Frontend dependencies
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd anytimechat
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Setup

1. **Backend Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_TOKEN=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

2. **Frontend Environment Variables**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:3000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 📱 Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Sign In**: Log in with your credentials
3. **Start Chatting**: Select a user and begin real-time messaging
4. **Share Images**: Upload and send images in conversations
5. **Track Status**: See when messages are delivered and when users are online

## 🔧 API Endpoints

### Authentication
- `POST /users/signup` - Register a new user
- `POST /users/signin` - Authenticate user and get token

### Messages
- `GET /chatroom/messages/:userId` - Get chat history with a user
- `POST /chatroom/upload` - Upload image to Cloudinary

## 🔄 Real-time Events

### Client to Server
- `join-chat` - Join a chat room
- `send-message` - Send a message to a user

### Server to Client
- `receive-message` - Receive a new message
- `online-user` - Update online user status

## 🗄 Database Schema

### User Model
```javascript
{
  profilePic: String,
  username: String (required),
  email: String (required, unique),
  password: String,
  active: Boolean (default: false),
  date: Date (default: Date.now)
}
```

### Message Model
```javascript
{
  roomId: String (required),
  senderId: ObjectId (ref: 'User'),
  receiverId: ObjectId (ref: 'User'),
  text: String,
  image: String,
  messageType: String (enum: ['text', 'image']),
  status: String (enum: ['sent', 'delivered', 'seen']),
  timestamps: true
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Issues

If you encounter any issues or have suggestions, please open an issue on the repository.

## 🔮 Future Enhancements

- [ ] Group chat functionality
- [ ] Message reactions
- [ ] Voice/video calling
- [ ] Message search
- [ ] Dark mode
- [ ] Mobile app
- [ ] End-to-end encryption
- [ ] Message editing and deletion
- [ ] Typing indicators
- [ ] File sharing (documents, videos)
- [ ] Push notifications

---

**Built with ❤️ using modern web technologies**