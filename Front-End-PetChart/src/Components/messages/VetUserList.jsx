import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContent.jsx";
import "../../styles/VetMessages.css";

export default function VetUserList() {
  const [users, setUsers] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/messages/vet/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleUserClick = (userId) => {
    navigate(`/dashboard/veterinarian/messages/${userId}`);
  };

     const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="vet-user-list">
      <h2>Welcome to the Message Center</h2>
      <button onClick={handleGoBack} className="back-btn">
          ← Back to Dashboard
          </button>

      {users.length === 0 ? (
        <p>You have no messages.</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li
              key={user.id}
              className="user-item"
              onClick={() => handleUserClick(user.id)}
            >
              <strong>{user.owner_name}</strong>
              <br />
              <span className="pet-name">Pet: {user.pet_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
