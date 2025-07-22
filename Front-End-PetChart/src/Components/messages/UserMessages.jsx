import { useState, useEffect } from "react";
import { useAuth } from "../AuthContent.jsx";
import MessageBubble from "./MessageBubble.jsx";
import "../../styles/PetParentMessages.css";
import { useNavigate } from "react-router-dom";

export default function UserMessages() {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [note, setNote] = useState("");
  const [vetId, setVetId] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/messages/user/thread", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [token]);

  useEffect(() => {
    const fetchVetId = async () => {
      try {
        const res = await fetch(`/appointments/user/${user.id}/vets`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.length > 0) {
          setVetId(data[0].vet_id);
        }
      } catch (error) {
        console.error("Error fetching vet ID:", error);
      }
    };

    fetchVetId();
  }, [user, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/messages/user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          vet_id: vetId,
          note,
        }),
      });
      const newMessage = await res.json();
      setMessages((prev) => [...prev, newMessage]);
      setNote("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

   const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="message-page">
              <button onClick={handleGoBack} className="back-btn">
          ← Back to Dashboard
          </button>
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
                isSentByCurrentUser={msg.sender === "user"}
              />
            ))}
          </div>
        )}

        <div className="create-message-form">
          {vetId ? (
            <form onSubmit={handleSubmit}>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                required
              />
              <br />
              <button type="submit" disabled={!note}>
                Send
              </button>
            </form>
          ) : (
            <p>
              You don't have a vet assigned yet. Schedule an appointment first!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
