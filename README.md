# MERN Chat Application

A full-stack chat application built with the MERN stack:
- **MongoDB** for the database
- **Express.js** and **Node.js** for backend APIs
- **React** for the frontend
- **Socket.IO** for real-time chat
- **JWT** and **bcrypt** for user authentication

## Getting Started

### Backend (server)
1. `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file with your MongoDB URI and JWT secret:
   ```
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server: `npm start`

### Frontend (client)
1. `cd client`
2. Install dependencies: `npm install`
3. Create a `.env` file with the backend URL (already set to `http://localhost:6001` by default):
   ```
   REACT_APP_SERVER_URL=http://localhost:6001
   ```
4. Start the React app: `npm start`

## Features
- User registration and login with JWT authentication
- Real-time chat between users using Socket.IO
- Secure password storage with bcrypt
- MongoDB for storing users and messages

---


