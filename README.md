# MERN Chat Application

This is a simple full-stack chat application built with the MERN stack and Socket.IO.

## Tech Stack

• MongoDB & Mongoose – database
• Express.js & Node.js – REST API and Socket.IO server
• React (Vite) – client
• Socket.IO – real-time messaging
• JWT & bcrypt – authentication

## Folder Structure

```
.
├── server        # Backend API & Socket.IO server
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   └── routes
│   └── package.json
└── client        # Frontend (React)
    ├── src
    │   ├── components
    │   ├── context
    │   └── ...
    └── package.json
```

## Getting Started

1. Install dependencies

```bash
# Root folder
cd server && npm install
cd ../client && npm install
```

2. Create environment file for server

```bash
cp server/.env.example server/.env
# then edit values if needed
```

3. Run development servers (in separate terminals)

```bash
# Server
cd server && npm run dev

# Client
cd client && npm run dev
```

4. Open the app

Navigate to `http://localhost:5173` in your browser.


