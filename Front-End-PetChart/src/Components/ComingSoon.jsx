import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const ComingSoon = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="coming-soon-container">
      <div className="coming-soon-card">
        <h1>Coming Soon!</h1>
        <h2>Medical Records Hub</h2>
        
        <div className="coming-soon-message">
          <p>🐾 <strong>Paws</strong> for a moment! Our team of coding cats and debugging dogs are working their tails off to bring you the most paw-some medical records system ever!</p>
          
          <p>Soon you'll be able to:</p>
          <ul>
            <li>View your pet's complete medical history</li>
            <li>Track vaccinations and medications</li>
            <li>Access lab results and test reports</li>
            <li>See treatment plans and follow-ups</li>
            <li>Store and view X-rays and photos</li>
          </ul>
          
          <p>🎉 We're making sure everything is <em>purr-fect</em> before launch!</p>
        </div>
        <button onClick={handleGoBack} className="coming-soon-btn">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ComingSoon; 