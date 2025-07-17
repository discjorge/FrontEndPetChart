import { useState, useEffect } from 'react';
import { useAuth } from './AuthContent.jsx';
import { useNavigate } from 'react-router-dom';
import defaultImg from '../assets/Images/default.png';
import PetFunFact from './PetFunFact.jsx';
import PetOfTheDay from './PetOfTheDay.jsx';
import UpcomingAppointments from './UpcomingAppointments.jsx';
import Messages from './Messages.jsx';
import MyVet from './MyVet.jsx';
import '../styles/Dashboard.css';


const PetParentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (retryCount = 0) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/users/account', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
            
      if (response.ok) {
        const data = await response.json();
        console.log('Account data received:', data);
        setDashboardData(data);
      } else if (response.status === 404 && retryCount < 3) {
        // Retry for 404 errors (account might not be ready yet)
        console.log(`Account not ready, retrying in 2 seconds... (attempt ${retryCount + 1}/3)`);
        setTimeout(() => {
          loadDashboardData(retryCount + 1);
        }, 2000);
        return; // Don't set loading to false yet
      } else {
        const errorText = await response.text();
        console.error('Account fetch failed:', response.status, errorText);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="pet-parent-dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user?.owner_name}! 🐾</h1>
      </header>
      
      <div className="quick-actions-banner">
        <button className="action-btn">📅 Schedule Appointment</button>
        <button className="action-btn" onClick={()=> navigate("messages")}>💬 Message Your Vet</button>
        <button className="action-btn" onClick={() => navigate('/coming-soon')}>📋 View Medical Records</button>
      </div>
      
      <div className="dashboard-content">
        <div className="pet-info-card">
          <h2>Your Pet</h2>
          {dashboardData && (
            <div className="pet-details">
              <img
                src={
                  dashboardData.pet_image_url
                    ? `${dashboardData.pet_image_url}`
                    : defaultImg
                }
                alt={`${dashboardData.pet_name}`}
                className="pet-image"
              />
              <h3>{dashboardData.pet_name}</h3>
            </div>
          )}
        </div>

        <UpcomingAppointments />

        <Messages />

        <PetFunFact />
        
        <MyVet />
                
        <PetOfTheDay />
        
      </div>
    </div>
  );
};

export default PetParentDashboard;