import { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const PetOfTheDay = () => {
  const [dogImage, setDogImage] = useState('');
  const [dogName, setDogName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const dogNames = [
    'Buddy', 'Max', 'Charlie', 'Cooper', 'Rocky', 'Bear', 'Duke', 'Teddy',
    'Tucker', 'Oliver', 'Bentley', 'Milo', 'Winston', 'Murphy', 'Loki',
    'Bella', 'Luna', 'Lucy', 'Daisy', 'Sadie', 'Molly', 'Bailey', 'Sophie',
    'Chloe', 'Lola', 'Zoe', 'Ruby', 'Penny', 'Nova', 'Stella', 'Willow',
    'Atlas', 'Zeus', 'Apollo', 'Thor', 'Shadow', 'Rex', 'Bruno', 'Jax',
    'Finn', 'Riley', 'Harley', 'Gunner', 'Axel', 'Koda', 'Scout', 'Bandit'
  ];

  useEffect(() => {
    fetchRandomDog();
  }, []);

  const fetchRandomDog = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dog image');
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.message) {
        setDogImage(data.message);
        const randomName = dogNames[Math.floor(Math.random() * dogNames.length)];
        setDogName(randomName);
      } else {
        throw new Error('Invalid response from dog API');
      }
    } catch (err) {
      console.error('Error fetching random dog:', err);
      setError('Unable to load pet of the day');
      setDogName('Buddy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pet-of-day-card">
      <h3>Pet of the Day</h3>
      {loading ? (
        <div className="pet-of-day-loading">
          <p>Loading adorable pet...</p>
        </div>
      ) : (
        <>
          <div className="pet-of-day-image-container">
            <img 
              src={dogImage} 
              alt={`${dogName}, Pet of the Day`}
              className="pet-of-day-image"
            />
          </div>
          <p className="pet-of-day-name">Meet {dogName}!</p>
        </>
      )}
      {error && <p className="pet-of-day-error">{error}</p>}
    </div>
  );
};

export default PetOfTheDay; 