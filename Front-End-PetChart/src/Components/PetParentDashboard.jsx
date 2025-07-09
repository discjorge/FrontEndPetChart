import { useState, useEffect } from 'react';
import { useAuth } from './AuthContent.jsx';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar.jsx';

const PetParentDashboard = () => {
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
      const response = await fetch('/users/account', {
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
    <div className="pet-parent-dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {user?.owner_name}! 🐾</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>
      
      <div className="dashboard-content">
        <div className="pet-info-card">
          <h2>Your Pet</h2>
          {dashboardData && (
            <div className="pet-details">
              <h3>{dashboardData.pet_name}</h3>
              <p><strong>Breed:</strong> {dashboardData.breed}</p>
              <p><strong>Animal:</strong> {dashboardData.animal}</p>
              <p><strong>Address:</strong> {dashboardData.address}</p>
            </div>
          )}
        </div>
        
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <button className="action-btn">📅 Schedule Appointment</button>
          <button className="action-btn">💬 Message Your Vet</button>
          <button className="action-btn">📋 View Medical Records</button>
        </div>
      </div>
    </div>
  );
};

export default PetParentDashboard;