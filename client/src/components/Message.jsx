import React from "react";

const Message = ({ message, isOwn }) => (
  <div style={{ textAlign: isOwn ? "right" : "left", margin: "4px 0" }}>
    <span style={{ background: isOwn ? "#DCF8C6" : "#FFF", padding: 8, borderRadius: 8, display: "inline-block" }}>
      {message}
    </span>
  </div>
);

export default Message;