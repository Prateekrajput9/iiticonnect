import React, { useState } from "react";
import Chat from "../../components/Chat";

// Dummy user list for selection (replace with real user fetching logic)
const users = [
  { _id: "1", name: "Alice" },
  { _id: "2", name: "Bob" },
];

const currentUser = JSON.parse(localStorage.getItem("user")); // Or get from context

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: 200, borderRight: "1px solid #ccc" }}>
        <h3>Users</h3>
        {users
          .filter((u) => u._id !== currentUser?._id)
          .map((user) => (
            <div
              key={user._id}
              style={{ padding: 8, cursor: "pointer", background: selectedUser?._id === user._id ? "#eee" : "#fff" }}
              onClick={() => setSelectedUser(user)}
            >
              {user.name}
            </div>
          ))}
      </div>
      <div style={{ flex: 1, padding: 16 }}>
        {selectedUser ? (
          <Chat user={currentUser} selectedUser={selectedUser} />
        ) : (
          <div>Select a user to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;