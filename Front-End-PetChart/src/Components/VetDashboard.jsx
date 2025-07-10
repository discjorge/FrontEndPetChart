import { useState, useEffect } from 'react';
import { useAuth } from './AuthContent.jsx';
import PetFunFact from './PetFunFact.jsx';
import PetOfTheDay from './PetOfTheDay.jsx';
import UpcomingAppointments from './UpcomingAppointments.jsx';
import Messages from './Messages.jsx';
import '../styles/Dashboard.css';

const VeterinarianDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/vets/account', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="vet-dashboard">
      <header className="dashboard-header">
        <h1>Dr. {user?.first_name} {user?.last_name}</h1>
      </header>
      
      <div className="quick-actions-banner">
        <button className="action-btn">🏥 Manage Patients</button>
        <button className="action-btn">📝 Create Clinical Notes</button>
        <button className="action-btn">📅 View Schedule</button>
        <button className="action-btn">💬 Patient Messages</button>
      </div>
      
      <div className="dashboard-content">
        <div className="vet-info-card">
          <h2>Your Practice</h2>
          {dashboardData && (
            <div className="vet-details">
              <p><strong>Email:</strong> {dashboardData.email}</p>
              <p><strong>Profile:</strong> {dashboardData.profile_image_url ? 'Uploaded' : 'Not set'}</p>
            </div>
          )}
        </div>
        
        <PetFunFact />
        
        <PetOfTheDay />
        
        <UpcomingAppointments />
        
        <Messages />
      </div>
    </div>
  );
};

export default VeterinarianDashboard;