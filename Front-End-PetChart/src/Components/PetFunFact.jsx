import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const PetFunFact = () => {
  const [fact, setFact] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFunFact();
  }, []);

  const fetchFunFact = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('https://dogapi.dog/api/v2/facts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch fun fact');
      }
      
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        setFact(data.data[0].attributes.body);
      } else {
        setFact('Dogs are amazing companions that bring joy to our lives!');
      }
    } catch (err) {
      console.error('Error fetching fun fact:', err);
      setError('Unable to load fun fact');
      setFact('Dogs are amazing companions that bring joy to our lives!');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchFunFact();
  };

  return (
    <div className="fun-fact-card">
      <h3>❕ Pet Fun Fact of the Day</h3>
      {loading ? (
        <p className="fun-fact-loading">Loading fun fact...</p>
      ) : (
        <>
          <p className="fun-fact-text">{fact}</p>
          <button onClick={handleRefresh} className="fun-fact-refresh-btn">
            Want a New Fact?
          </button>
        </>
      )}
      {error && <p className="fun-fact-error">{error}</p>}
    </div>
  );
};

export default PetFunFact; 