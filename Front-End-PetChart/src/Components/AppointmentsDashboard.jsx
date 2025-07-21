import { useState, useEffect } from "react";
import { useAuth } from "./AuthContent.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const AppointmentsDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    time: "",
    appointment_reason: "",
  });

  useEffect(() => {
    if (user && token) {
      fetchAppointments();
      if (user.userType === "veterinarian") {
        fetchUsers();
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
          ? `/appointments/vets/${id}`
          : `/appointments/user/${id}`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok && response.status !== 304) {
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

  // const fetchPatients = async () => {
  //   try {
  //     const vetId = user.id || user.vet_id;
  //     const response = await fetch(
  //       `/appointments/vets/${vetId}/patients`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (!response.ok) throw new Error("Failed to fetch patients");
  //     const data = await response.json();
  //     setPatients(data || []);
  //   } catch (err) {
  //     console.error("Error fetching patients:", err);
  //   }
  // };
  const fetchUsers = async () => {
    try {
      const response = await fetch(`/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUsers(data || []);
    } catch (err) {
      console.error("whhops", err);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/appointments", {
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
      const response = await fetch(`/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok && response.status !== 304) {
        const errorText = await response.text();
        console.error("Delete failed:", response.status, errorText);
        throw new Error("Failed to delete appointment");
      }

      await fetchAppointments();
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="manage-patients-container">
      <div className="manage-patients-header">
        <button onClick={handleGoBack} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>
          Appointments for Dr. {user?.first_name} {user?.last_name}
        </h1>
        <p>Manage your appointment schedule</p>
      </div>

      <div className="appt-dashboard-content">
        {user.userType === "veterinarian" && (
          <div className="appointments-card">
            <h3>📅 Schedule New Appointment</h3>
            <form className="appointment-form" onSubmit={handleAddAppointment}>
              <div className="form-group">
                <label htmlFor="patient-select">Select Pet Patient*</label>
                <select
                  id="patient-select"
                  value={form.user_id}
                  onChange={(e) =>
                    setForm({ ...form, user_id: e.target.value })
                  }
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
        )}

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
                    {new Date(appt.time).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="appointment-details">
                    <strong>{appt.appointment_reason || "Appointment"}</strong>
                    <p>
                      Patient:{" "}
                      {patients.find((p) => p.user_id === appt.user_id)
                        ?.pet_name || `ID: ${appt.user_id}`}
                    </p>
                    {user.userType === "veterinarian" && (
                      <button
                        onClick={() => handleDeleteAppointment(appt.id)}
                        className="action-btn-small"
                      >
                        Cancel Appointment
                      </button>
                    )}
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
