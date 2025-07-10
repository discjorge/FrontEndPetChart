import { useState, useEffect } from "react";
import { useAuth } from "./AuthContent.jsx";
import { useNavigate } from "react-router-dom";

const AppointmentsDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/appointments", {
        headers: {},
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <div>Loading appointments...</div>;

  return (
    <div className="appointments-dashboard">
      <header className="dashboard-header">
        <h1>Appointments</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="appointments-list">
        {appointments.length === 0 ? (
          <p>No appointments scheduled.</p>
        ) : (
          appointments.map((appt) => (
            <div key={appt.id} className="appointment-card">
              <p>
                <strong>Time:</strong> {new Date(appt.time).toLocaleString()}
              </p>
              <p>
                <strong>Reason:</strong> {appt.appointment_reason}
              </p>
              <p>
                <strong>User ID:</strong> {appt.user_id}
              </p>
              <p>
                <strong>Vet ID:</strong> {appt.vet_id}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentsDashboard;
