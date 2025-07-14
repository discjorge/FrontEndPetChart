import { useState, useEffect } from "react";
import { useAuth } from "./AuthContent.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const AppointmentsDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    vet_id: "",
    time: "",
    appointment_reason: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/appointments/user/" + user.userId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setAppointments(data || []);
    } catch (error) {
      console.error("Failed to load appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/appointments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.userId,
          vet_id: parseInt(form.vet_id),
          time: form.time,
          appointment_reason: form.appointment_reason,
        }),
      });

      if (!response.ok) throw new Error("Failed to add appointment");
      await fetchAppointments();
      setForm({ vet_id: "", time: "", appointment_reason: "" });
    } catch (err) {
      console.error("Error adding appointment:", err);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete appointment");
      await fetchAppointments();
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-card">
      <header className="dashboard-header">
        <h1>Appointments</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <form className="appointment-form" onSubmit={handleAddAppointment}>
        <input
          type="number"
          placeholder="Vet ID"
          value={form.vet_id}
          onChange={(e) => setForm({ ...form, vet_id: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Reason"
          value={form.appointment_reason}
          onChange={(e) =>
            setForm({ ...form, appointment_reason: e.target.value })
          }
          required
        />
        <button type="submit">Add Appointment</button>
      </form>

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments scheduled.</p>
      ) : (
        <div className="appointments-list">
          {appointments.map((appt) => (
            <div key={appt.id} className="appointment-card">
              <p>
                <strong>Time:</strong> {new Date(appt.time).toLocaleString()}
              </p>
              <p>
                <strong>Reason:</strong> {appt.appointment_reason}
              </p>
              <p>
                <strong>Vet ID:</strong> {appt.vet_id}
              </p>
              <button
                onClick={() => handleDeleteAppointment(appt.id)}
                className="delete-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsDashboard;
