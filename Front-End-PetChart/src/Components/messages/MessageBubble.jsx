import React from 'react';
import "../../styles/MessageBubbles.css"

export default function MessageBubble({ message, isSentByCurrentUser }) {
  return (
    <div className={`message-bubble ${isSentByCurrentUser ? 'sent' : 'received'}`}>
      <p>{message.note}</p>
      <span className="message-time">
        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}