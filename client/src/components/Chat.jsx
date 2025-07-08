import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io(process.env.REACT_APP_SERVER_URL || "http://localhost:6001");

const Chat = ({ user, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }
  }, [user]);

  useEffect(() => {
    if (selectedUser?._id && user?._id) {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL || "http://localhost:6001"}/chat/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setMessages(res.data));
    }
  }, [selectedUser, user]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, { sender: msg.sender, message: msg.message }]);
    });
    return () => socket.off("receiveMessage");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg = {
      sender: user._id,
      receiver: selectedUser._id,
      message: newMessage,
    };
    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    await axios.post(
      `${process.env.REACT_APP_SERVER_URL || "http://localhost:6001"}/chat`,
      { receiver: selectedUser._id, message: newMessage },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, height: 400, overflowY: "auto" }}>
      <div style={{ height: 340, overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === user._id ? "right" : "left" }}>
            <span>{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", marginTop: 8 }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flex: 1, marginRight: 8 }}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;