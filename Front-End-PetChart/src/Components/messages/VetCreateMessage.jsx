import { useState, useEffect } from "react";
import { useAuth } from "../AuthContent.jsx";
import { useNavigate } from "react-router-dom";

export default function UserCreateMessage() {
  const { user, token } = useAuth();
  const [vetId, setVetId] = useState(null);
  const [note, setNote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVetId = async () => {
    try {
      const response = await fetch(`/appointments/user/${user.id}/vets`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data?.vet_id) {
        setVetId(data.vet_id);
      }
    } catch (error) {
      console.error("Failed to fetch vet ID:", error);
    }
  };

  if (user && token) {
    fetchVetId();
  }
}, [user, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!note || !vetId) return;

    try {
      const res = await fetch("/messages", {
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

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();
      console.log("Message sent:", data);
      navigate("/dashboard/pet-parent");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="create-message-form">
      <h2>Message Your Vet</h2>
      {vetId ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type your message..."
            rows={5}
            required
          />
          <br />
          <button type="submit">Send Message</button>
        </form>
      ) : (
        <p>You don't have a vet assigned yet.. Schedule an appointment first!</p>
      )}
    </div>
  );
}