import React from "react";
import "../../styles/MessageBubbles.css";

export default function MessageBubble({ message, isSentByCurrentUser }) {
  const messageTime = message.created_at
    ? new Date(message.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className={`message-bubble ${isSentByCurrentUser ? "sent" : "received"}`}>
      <p>{message.note}</p>
      <span className="message-time">{messageTime}</span>
    </div>
  );
}