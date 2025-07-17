import React, { useState, useEffect } from 'react';
import '../Styles/VetNews.css';

const NearbyEmergencyVets = () => {
  const [emergencyVets, setEmergencyVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const city = 'Los Angeles'; 

  const findVetsInArea = async (searchCity = "Los Angeles") => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=animal+hospital+${searchCity}` +
        `&format=json&limit=5`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch emergency vets');
      }
      
      return await response.json();
    } catch (err) {
      throw new Error('Failed to fetch emergency vets');
    }
  };

  useEffect(() => {
    const fetchEmergencyVets = async () => {
      try {
        setLoading(true);
        const data = await findVetsInArea(city);
        setEmergencyVets(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching emergency vets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyVets();
  }, []);

  const getDirectionsUrl = (lat, lon, displayName) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&query=${encodeURIComponent(displayName)}`;
  };

  if (loading) {
    return (
      <div className="vet-news-card">
        <div className="vet-news-header">
          <h3>🚨 Emergency Vets Nearby</h3>
        </div>
        <div className="vet-news-content">
          <div className="loading">Finding emergency veterinary hospitals...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vet-news-card">
        <div className="vet-news-header">
          <h3>🚨 Emergency Vets Nearby</h3>
        </div>
        <div className="vet-news-content">
          <div className="error">Unable to find emergency vets: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="vet-news-card">
      <div className="vet-news-header">
        <h3>🚨 Emergency Vets Nearby</h3>
      </div>
      <div className="vet-news-content">
        {emergencyVets.length === 0 ? (
          <div className="no-news">No emergency veterinary hospitals found in {city}.</div>
        ) : (
          <div className="news-list">
            {emergencyVets.map((vet, index) => (
              <div key={index} className="news-item">
                <div className="news-title">
                  <span className="news-link emergency-vet-title">
                    {vet.display_name.split(',')[0]}
                  </span>
                </div>
                <div className="news-description">
                  {vet.display_name.split(',').slice(1, 3).join(', ')}
                </div>
                <div className="news-date emergency-vet-date">
                  <span>24/7 Emergency Care</span>
                  <a 
                    href={getDirectionsUrl(vet.lat, vet.lon, vet.display_name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="emergency-vet-link"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyEmergencyVets; 