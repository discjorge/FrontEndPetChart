import { useState, useEffect } from "react";
import { useAuth } from "./AuthContent.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const AppointmentsDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    user_id: "",
    time: "",
    appointment_reason: "",
  });

  // Redirect non-vets immediately
  useEffect(() => {
    if (user && token) {
      if (user.userType !== "veterinarian") {
        navigate("/"); // or whatever route your non-vets should go
      } else {
        fetchAppointments();
        fetchUsers();
      }
    }
  }, [user, token]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const vetId = user.id || user.user_id;
      const response = await fetch(`/appointments/vets/${vetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok && response.status !== 304) {
        const text = await response.text();
        throw new Error(`Failed: ${response.status} ${text}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Unexpected response format");
      setAppointments(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to load users");
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      const vetId = user.id || user.user_id;
      const response = await fetch("/appointments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(form.user_id),
          vet_id: vetId,
          time: form.time,
          appointment_reason: form.appointment_reason,
        }),
      });
      if (!response.ok) throw new Error("Failed to create");
      await fetchAppointments();
      setForm({ user_id: "", time: "", appointment_reason: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      const response = await fetch(`/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok && response.status !== 304) {
        const text = await response.text();
        throw new Error(`Failed delete: ${response.status} ${text}`);
      }
      await fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoBack = () => navigate(-1);

  // While redirect logic handles non-vets, you can still guard render:
  if (!user || user.userType !== "veterinarian") {
    return null; // or a loading state while redirecting
  }

  return (
    <div className="manage-patients-container">
      <div className="manage-patients-header">
        <button onClick={handleGoBack} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>
          Appointments for Dr. {user.first_name} {user.last_name}
        </h1>
        <p>Manage your appointment schedule</p>
      </div>

      <div className="appt-dashboard-content">
        <div className="appointments-card">
          <h3>📅 Schedule New Appointment</h3>
          <form className="appointment-form" onSubmit={handleAddAppointment}>
            <div className="form-group">
              <label htmlFor="patient-select">Select Pet Patient*</label>
              <select
                id="patient-select"
                value={form.user_id}
                onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                required
              >
                <option value="">Choose a patient...</option>
                {users.map((u) => (
                  <option key={u.id || u.user_id} value={u.id || u.user_id}>
                    {u.pet_name} (Owner: {u.owner_name})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="appointment-time">Date & Time*</label>
              <input
                id="appointment-time"
                type="datetime-local"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="appointment-reason">Reason for Visit*</label>
              <input
                id="appointment-reason"
                type="text"
                placeholder="Ex., Annual checkup, Vaccines..."
                value={form.appointment_reason}
                onChange={(e) =>
                  setForm({ ...form, appointment_reason: e.target.value })
                }
                required
              />
            </div>

            <button className="action-btn" type="submit">
              Schedule Appointment
            </button>
          </form>
        </div>

        <div className="appointments-card">
          <h3>Current Appointments</h3>
          {loading ? (
            <p className="appointments-loading">Loading appointments...</p>
          ) : error ? (
            <p className="appointments-error">{error}</p>
          ) : appointments.length === 0 ? (
            <p className="no-appointments">No appointments scheduled</p>
          ) : (
            <div className="appointments-list">
              {appointments.map((appt) => (
                <div key={appt.id} className="appointment-item">
                  <div className="appointment-date">
                    📅{" "}
                    {new Date(appt.time).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="appointment-details">
                    <strong>{appt.appointment_reason || "Appointment"}</strong>
                    <p>Patient ID: {appt.user_id}</p>
                    <button
                      onClick={() => handleDeleteAppointment(appt.id)}
                      className="action-btn-small"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsDashboard;
