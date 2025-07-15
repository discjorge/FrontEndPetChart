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
      console.log('UpcomingAppointments: User and token available, fetching appointments');
      fetchAppointments();
    } else {
      console.log('UpcomingAppointments: Missing user or token', { user: !!user, token: !!token });
    }
  }, [user, token]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const userId = user.id || user.user_id || user._id;
      const vetId = user.vet_id || user.id || user.user_id || user._id;
      
      if (!userId && !vetId) {
        throw new Error('No user ID found in user object');
      }
      
      const endpoint = user.userType === 'veterinarian' 
        ? `/appointments/vets/${vetId}` 
        : `/appointments/user/${userId}`;
      
      console.log('Fetching appointments from:', endpoint);
      console.log('User data:', user);
      console.log('User type:', user.userType);
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Appointments data:', data);
      
      if (Array.isArray(data)) {
        setAppointments(data);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(`Unable to load appointments: ${err.message}`);
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
            <div key={appointment.id || index} className="appointment-item">
              <div className="appointment-date">
                📅 {formatDate(appointment.time)}
              </div>
              <div className="appointment-details">
                <strong>{appointment.appointment_reason || 'Appointment'}</strong>
                {appointment.appointment_reason && (
                  <p>Reason: {appointment.appointment_reason}</p>
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