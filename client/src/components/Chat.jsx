import React, { useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext.jsx';

const socket = io('http://localhost:5000');

const Chat = () => {
  const { user, logout } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit('chatMessage', { userId: user.id, content: input });
    setInput('');
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Chat Room</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <div
        style={{
          border: '1px solid #ccc',
          height: '400px',
          overflowY: 'auto',
          padding: '1rem',
          marginBottom: '1rem',
        }}
      >
        {messages.map((msg) => (
          <div key={msg._id} style={{ marginBottom: '0.5rem' }}>
            <strong>{msg.sender === user.id ? 'Me' : msg.sender}:</strong> {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex' }}>
        <input
          style={{ flex: 1, marginRight: '0.5rem' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;