import express from "express";
import { getMessages, sendMessage } from "../controllers/chat.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get chat history between two users
router.get("/:userId", verifyToken, getMessages);

// Send a new message
router.post("/", verifyToken, sendMessage);

export default router;