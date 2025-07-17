import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContent.jsx";
import MessageBubble from "./MessageBubble.jsx";
import "../../styles/VetMessages.css";
import { useNavigate } from "react-router-dom";

export default function VetMessageByUser() {
  const { userID } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [ownerName, setOwnerName] = useState("");

  //Get Messages and set it to state
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/messages/vet/user/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Couldn't fetch messages", error);
      }
    }

    fetchMessages();
  }, [token, userID]);

  // Get owner name to display at top and set to state
  useEffect(() => {
    async function fetchOwnerName() {
      try {
        const res = await fetch(`/users/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const petOwner = await res.json();
        setOwnerName(petOwner.owner_name);
      } catch (error) {
        console.error("Couldn't fetch owner name", error);
      }
    }

    fetchOwnerName();
  }, [token, userID]);

  // submit handler to POST message and add the message to messages state to display right
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/messages/vet", {
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
      setMessages((prev) => [...prev, postedMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

   const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="message-container">
      <h2>Messages with {ownerName}</h2>
              <button onClick={handleGoBack} className="back-btn">
          ← Back to Message Center
          </button>
      <div className="message-thread">
        {messages.length === 0 ? (
          <p>You have no messages with this user.</p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isSentByCurrentUser={msg.sender === "vet"}
            />
          ))
        )}
      </div>

      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          required
        />
        <button type="submit" disabled={!newMessage}>
          Send
        </button>
      </form>
    </div>
  );
}
