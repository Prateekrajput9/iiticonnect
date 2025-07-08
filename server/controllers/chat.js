import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

/* GET CONVERSATIONS */
export const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate({
        path: "participants",
        select: "firstName lastName picturePath",
      })
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "firstName lastName",
        },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* CREATE OR GET CONVERSATION */
export const createOrGetConversation = async (req, res) => {
  try {
    const { userId, otherUserId } = req.body;

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    }).populate({
      path: "participants",
      select: "firstName lastName picturePath",
    });

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: [userId, otherUserId],
      });
      await conversation.save();
      
      // Populate the conversation
      conversation = await Conversation.findById(conversation._id).populate({
        path: "participants",
        select: "firstName lastName picturePath",
      });
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* GET MESSAGES */
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({ conversation: conversationId })
      .populate({
        path: "sender",
        select: "firstName lastName picturePath",
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.status(200).json(messages.reverse());
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* SEND MESSAGE */
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content, messageType = "text" } = req.body;

    // Create new message
    const message = new Message({
      conversation: conversationId,
      sender: senderId,
      content,
      messageType,
      readBy: [{ user: senderId }],
    });

    await message.save();

    // Update conversation's last message and timestamp
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: Date.now(),
    });

    // Populate the message
    const populatedMessage = await Message.findById(message._id).populate({
      path: "sender",
      select: "firstName lastName picturePath",
    });

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* MARK MESSAGES AS READ */
export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId, userId } = req.body;

    await Message.updateMany(
      {
        conversation: conversationId,
        "readBy.user": { $ne: userId },
      },
      {
        $push: {
          readBy: {
            user: userId,
            readAt: new Date(),
          },
        },
      }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* DELETE MESSAGE */
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};