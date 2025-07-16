import { useState, useEffect } from "react";
import { useAuth } from "../AuthContent.jsx";
import MessageBubble from "./MessageBubble.jsx";
import "../../styles/PetParentMessages.css"

export default function UserMessages() {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch("messages/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    }

    if (token) fetchMessages();
  }, [token]);

return (
  <div className="message-page">
    <div className="user-messages-container">
      <h2 className="chat-title">Your Messages</h2>
      {messages.length === 0 ? (
        <p className="empty-message">No messages yet</p>
      ) : (
        <div className="messages-thread">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isSentByCurrentUser={msg.user_id === user.id}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);
}