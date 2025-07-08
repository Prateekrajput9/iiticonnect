import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { Box, Typography, TextField, Button, List, ListItem } from "@mui/material";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:6001";

const ChatWidget = ({ recipientId, recipientName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    if (!token) return;
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
    });
    socketRef.current.on("receive_message", (message) => {
      if (
        (message.sender === user._id && message.recipient === recipientId) ||
        (message.sender === recipientId && message.recipient === user._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [token, recipientId, user._id]);

  useEffect(() => {
    // Fetch chat history
    const fetchMessages = async () => {
      if (!token || !recipientId) return;
      const res = await fetch(`/chat/${recipientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data);
    };
    fetchMessages();
  }, [token, recipientId]);

  const handleSend = () => {
    if (input.trim() && socketRef.current) {
      socketRef.current.emit("send_message", {
        recipient: recipientId,
        content: input,
      });
      setInput("");
    }
  };

  return (
    <Box border={1} borderRadius={2} p={2} width={350} bgcolor="#fff">
      <Typography variant="h6" gutterBottom>
        Chat with {recipientName}
      </Typography>
      <List sx={{ maxHeight: 300, overflowY: "auto" }}>
        {messages.map((msg) => (
          <ListItem key={msg._id} sx={{ justifyContent: msg.sender === user._id ? "flex-end" : "flex-start" }}>
            <Box bgcolor={msg.sender === user._id ? "#e0f7fa" : "#f1f8e9"} px={2} py={1} borderRadius={2}>
              <Typography variant="body2">{msg.content}</Typography>
            </Box>
          </ListItem>
        ))}
      </List>
      <Box display="flex" mt={2}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          size="small"
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} variant="contained" sx={{ ml: 1 }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatWidget;