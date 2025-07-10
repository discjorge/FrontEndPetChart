import { useState, useEffect } from 'react';
import { useAuth } from './AuthContent.jsx';
import '../styles/Dashboard.css';

const UpcomingAppointments = () => {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && token) {
      fetchAppointments();
    }
  }, [user, token]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const endpoint = user.userType === 'veterinarian' 
        ? `/vet/${user.id}` 
        : `/user/${user.id}`;
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const data = await response.json();
      
      if (data.appointments && Array.isArray(data.appointments)) {
        setAppointments(data.appointments);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Unable to load appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="appointments-card">
      <h3>Upcoming Appointments</h3>
      {loading ? (
        <p className="appointments-loading">Loading appointments...</p>
      ) : error ? (
        <p className="appointments-error">{error}</p>
      ) : appointments.length > 0 ? (
        <div className="appointments-list">
          {appointments.map((appointment, index) => (
            <div key={index} className="appointment-item">
              <div className="appointment-date">
                📅 {formatDate(appointment.date)}
              </div>
              <div className="appointment-details">
                <strong>{appointment.title || 'Appointment'}</strong>
                {appointment.description && (
                  <p>{appointment.description}</p>
                )}
                {appointment.petName && (
                  <p>Pet: {appointment.petName}</p>
                )}
                {appointment.ownerName && (
                  <p>Owner: {appointment.ownerName}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-appointments">No upcoming appointments, book one today!</p>
      )}
    </div>
  );
};

export default UpcomingAppointments; 