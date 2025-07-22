import { useState, useEffect } from "react";
import { useAuth } from "./AuthContent.jsx";
import "../styles/Dashboard.css";

const Messages = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && token) {
      fetchMessages();
    }
  }, [user, token]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const endpoint =
        user.userType === "veterinarian" ? "/messages/vet" : "/messages/user";

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }

        if (
          response.status === 404 &&
          (errorData.message?.toLowerCase().includes("no messages") ||
            (typeof errorData === "string" &&
              errorData.toLowerCase().includes("no messages")))
        ) {
          console.log(
            "Messages component - No messages found, setting empty array"
          );
          setMessages([]);
          return;
        }

        throw new Error(
          `Failed to fetch messages: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      let messagesArray = [];

      if (data.messages && Array.isArray(data.messages)) {
        messagesArray = data.messages;
      } else if (Array.isArray(data)) {
        messagesArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        messagesArray = data.data;
      } else if (data.message && Array.isArray(data.message)) {
        messagesArray = data.message;
      }

      setMessages(messagesArray);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Unable to load messages");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "No content";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="messages-card">
      <h3>Messages</h3>
      {loading ? (
        <p className="messages-loading">Loading messages...</p>
      ) : error ? (
        <p className="messages-error">{error}</p>
      ) : messages.length > 0 ? (
        <div className="messages-list">
          {messages.slice(0, 5).map((message) => {
            const senderName =
              user.userType === "veterinarian"
                ? message.user_name || `User ${message.user_id}`
                : "Dr." && message.vet_last_name
                ? `Dr. ${message.vet_last_name}`
                : `Vet ${message.vet_id}`;

            return (
              <div key={message.id} className="message-item">
                <div className="message-header">
                  <span className="message-sender">{senderName}</span>
                  <span className="message-date">
                    {formatDate(message.created_at)}
                  </span>
                </div>
                <div className="message-subject">
                  {message.pet_name
                    ? `Pet Name: ${message.pet_name}`
                    : message.sender === "vet"
                    ? "Vet:"
                    : "You:"}
                </div>
                <div className="message-preview">
                  {truncateText(
                    message.note ||
                      message.content ||
                      message.body ||
                      message.message ||
                      message.text
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="no-messages">No messages yet</p>
      )}
    </div>
  );
};

export default Messages;
