import { useState, useEffect } from 'react';
import { useAuth } from './AuthContent.jsx';
import defaultImg from '../assets/Images/default.png';
import '../styles/Dashboard.css';

const MyVet = () => {
  const { user, token } = useAuth();
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && token) {
      fetchVets();
    }
  }, [user, token]);

  const fetchVets = async () => {
    try {
      setLoading(true);
      setError('');
      
      const userId = user.id || user.user_id || user._id;
      
      const response = await fetch(`/appointments/user/${userId}/vets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok && response.status !== 304) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch vets: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Vets data:', data);
      
      if (Array.isArray(data)) {
        setVets(data);
      } else {
        setVets([]);
      }
    } catch (err) {
      console.error('Error fetching vets:', err);
      setError('Unable to load vet information');
      setVets([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="my-vet-card">
        <h3>My Vet</h3>
        <div className="loading-container">
          <p>Loading vet information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-vet-card">
        <h3>My Vet</h3>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-vet-card">
      <h3>My Vet</h3>
      {vets.length > 0 ? (
        <div className="vet-list">
          {vets.map((vet) => (
            <div key={vet.vet_id} className="vet-item">
              <div className="vet-avatar">
                <img 
                  src={vet.profile_image_url || defaultImg} 
                  alt={`Dr. ${vet.first_name} ${vet.last_name}`}
                  className="vet-image"
                />
              </div>
              <div className="vet-info">
                <h3 className="vet-name">Dr. {vet.first_name} {vet.last_name}</h3>
                <p className="vet-email">{vet.email}</p>
              </div>
              {/* <div className="vet-actions">
                <button className="action-btn-small">💬 Message</button>
                <button className="action-btn-small">📅 Schedule</button>
              </div> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-vets">
          <p>No vet assigned yet</p>
          <p>Your vet will appear here once you schedule an appointment</p>
        </div>
      )}
    </div>
  );
};

export default MyVet; 