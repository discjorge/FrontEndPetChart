import { useState, useEffect } from "react";
import { useAuth } from "./AuthContent.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const AppointmentsDashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    user_id: "",
    time: "",
    appointment_reason: "",
  });

  useEffect(() => {
    if (user && token) {
      fetchAppointments();
      if (user.userType === "veterinarian") {
        fetchPatients();
      }
    }
  }, [user, token]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const id = user.id || user.user_id || user._id || user.userId;
      const endpoint =
        user.userType === "veterinarian"
          ? `http://localhost:3000/appointments/vets/${id}`
          : `http://localhost:3000/appointments/user/${id}`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Fetch failed:", response.status, errText);
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        setError("Unexpected data format.");
        return;
      }

      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Unable to load appointments.");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const vetId = user.id || user.vet_id;
      const response = await fetch(
        `http://localhost:3000/appointments/vets/${vetId}/patients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch patients");
      const data = await response.json();
      setPatients(data || []);
    } catch (err) {
      console.error("Error fetching patients:", err);
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
          user_id: parseInt(form.user_id),
          vet_id: user.id || user.vet_id,
          time: form.time,
          appointment_reason: form.appointment_reason,
        }),
      });

      if (!response.ok) throw new Error("Failed to add appointment");
      await fetchAppointments();
      setForm({ user_id: "", time: "", appointment_reason: "" });
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
        <h1>
          Appointments for Dr. {user?.first_name} {user?.last_name}
        </h1>
      </header>

      <div className="vet-quick-actions-banner">
        <button
          className="action-btn"
          onClick={() => navigate("/manage-patients")}
        >
          🐾 Manage Pet Patients
        </button>
        <button className="action-btn">📝 Create Patient Message</button>
        <button className="action-btn" onClick={() => navigate("/coming-soon")}>
          📋 View Medical Records
        </button>
      </div>

      {user.userType === "veterinarian" && (
        <form className="appointment-form" onSubmit={handleAddAppointment}>
          <select
            value={form.user_id}
            onChange={(e) => setForm({ ...form, user_id: e.target.value })}
            required
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.user_id} value={patient.user_id}>
                {patient.pet_name} (ID: {patient.user_id})
              </option>
            ))}
          </select>
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
          <button className="appointment-button" type="submit">
            Add Appointment
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <p className="appointments-error">{error}</p>
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
                <strong>Patient:</strong>{" "}
                {patients.find((p) => p.user_id === appt.user_id)?.pet_name ||
                  `ID: ${appt.user_id}`}
              </p>
              {user.userType === "veterinarian" && (
                <button
                  onClick={() => handleDeleteAppointment(appt.id)}
                  className="delete-btn appointment-button"
                >
                  Remove Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsDashboard;
