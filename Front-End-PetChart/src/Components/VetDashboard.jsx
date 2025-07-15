
=======
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContent.jsx";
import { useNavigate } from "react-router-dom";
import PetFunFact from "./PetFunFact.jsx";
import PetOfTheDay from "./PetOfTheDay.jsx";
import UpcomingAppointments from "./UpcomingAppointments.jsx";
import Messages from "./Messages.jsx";
import VetNews from "./VetNews.jsx";
import NearbyEmergencyVets from "./NearbyEmergencyVets.jsx";
import "../styles/Dashboard.css";
import VetUserList from "./messages/VetUserList.jsx";
import VetMessageByUser from './messages/VetMessagebyUser.jsx';


const VeterinarianDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/vets/account", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="vet-dashboard">
      <header className="dashboard-header">
        <h1>
          Dr. {user?.first_name} {user?.last_name}
        </h1>
      </header>

      <div className="vet-quick-actions-banner">
        <button
          className="action-btn"
          onClick={() => navigate("/manage-patients")}
        >
          🐾 Manage Pet Patients
        </button>
        <button className="action-btn" onClick={() => navigate("/dashboard/veterinarian/messages")}>💬 Patient Messages</button>
        <button className="action-btn" onClick={() => navigate("/coming-soon")}>
          📋 View Medical Records
        </button>
        <button
          className="action-btn"
          onClick={() => navigate("/appointments-dashboard")}
        >
          📆 View Appointments
        </button>

      </div>

      <div className="dashboard-content">
        <div className="vet-info-card">
          <h2>Your Practice</h2>
          {dashboardData && (
            <div className="vet-details">
              <img
                src={
                  user.profile_image_url || user.pet_image?.url || defaultImg
                }
                alt="Profile"
                className="profile-img"
              />
              <p>
                <strong>Email:</strong> {dashboardData.email}
              </p>
              <p>
                <strong>Profile:</strong>{" "}
                {dashboardData.profile_image_url ? "Uploaded" : "Not set"}
              </p>
            </div>
          )}
        </div>

        <UpcomingAppointments />

        <Messages />
        
        <PetFunFact />
        
        <PetOfTheDay />

        <VetNews />

        <NearbyEmergencyVets />

      </div>
    </div>
  );
};

export default VeterinarianDashboard;
