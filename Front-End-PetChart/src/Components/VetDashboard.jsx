import { useState, useEffect } from 'react';
import { useAuth } from './AuthContent.jsx';
import { useNavigate } from 'react-router-dom';

const VeterinarianDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/vets/account', {
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="vet-dashboard">
      <header className="dashboard-header">
        <h1>Dr. {user?.first_name} {user?.last_name} 👩‍⚕️</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      
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
        
        <div className="clinical-tools">
          <h3>Clinical Tools</h3>
          <button className="action-btn">🏥 Manage Patients</button>
          <button className="action-btn">📝 Create Clinical Notes</button>
          <button className="action-btn">📅 View Schedule</button>
          <button className="action-btn">💬 Patient Messages</button>
        </div>
      </div>
    </div>
  );
};

export default VeterinarianDashboard;