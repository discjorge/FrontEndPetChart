import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContent.jsx";
import MessageBubble from "./MessageBubble.jsx";
import "../../styles/VetMessages.css";

export default function VetMessageByUser() {
  const { userID } = useParams();
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/vet/user/${userID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch messages");

        const data = await res.json();
        setMessages(data);

      } catch (err) {
        console.error("Couldn't fetch messages", err);
      }
    };

    if (token && userID) {
      fetchMessages();
    }
  }, [token, userID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/messages/vet", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userID,
          note: newMessage,
        }),
      });


      const postedMessage = await res.json();
      setMessages([postedMessage, ...messages]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="message-container">
      <h2>Messages with {ownerName}</h2>

      <div className="message-thread">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isSentByVet={msg.vet_id === user.id}
          />
        ))}
      </div>

      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}