import { useState, useEffect } from 'react';
import { useAuth } from './AuthContent.jsx';
import { useNavigate } from 'react-router-dom';
import defaultImg from '../assets/Images/default.png';
import '../styles/Dashboard.css';

const ManagePatients = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && token) {
      fetchPatients();
    }
  }, [user, token]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');
    
      // For veterinarians, we need the vet_id specifically otherwise it'll pull user.id
      const vetId = user.vet_id || user.id || user.user_id || user._id;      

      const url = `/appointments/vets/${vetId}/patients`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
           
      if (!response.ok && response.status !== 304) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch patients: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setPatients(data);
      } else {
        setPatients([]);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Unable to load patients');
      setPatients([]);
    } finally {
      setLoading(false);
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
        <h1>Manage Pet Patients</h1>
        <p>Your current patient roster</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <p>Loading patients...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
        </div>
      ) : patients.length > 0 ? (
        <div className="patients-grid">
          {patients.map((patient) => (
            <div key={patient.user_id} className="patient-card">
              <div className="patient-image-container">
                <img 
                  src={patient.pet_image_url || defaultImg} 
                  alt={`${patient.pet_name}`}
                  className="patient-image"
                />
              </div>
              <div className="patient-info">
                <h3 className="pet-name">{patient.pet_name}</h3>
                <p className="owner-name">Owner: {patient.owner_name}</p>
                <p className="pet-details">
                  <span className="animal">{patient.animal}</span> • <span className="breed">{patient.breed}</span>
                </p>
                <p className="email">{patient.email}</p>
              </div>
              <div className="patient-actions">
                <button className="action-btn-small" onClick={() => navigate('/coming-soon')}>📋 View Records</button>
                <button className="action-btn-small">💬 Message</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-patients">
          <p>No patients found</p>
          <p>Patients will appear here once they register with your practice</p>
        </div>
      )}
    </div>
  );
};

export default ManagePatients; 