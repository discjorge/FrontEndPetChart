import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContent.jsx';
import '../styles/LoginPage.css'; 
import logo from '../assets/Images/transparent-logo.png';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated()) {
    const userType = localStorage.getItem('userType');
    const redirectPath = userType === 'veterinarian' 
      ? '/dashboard/veterinarian' 
      : '/dashboard/pet-parent';
    return <Navigate to={redirectPath} replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(credentials.email, credentials.password);
      
      const dashboardRoute = result.userType === 'veterinarian' 
        ? '/dashboard/veterinarian' 
        : '/dashboard/pet-parent';
      
      navigate(dashboardRoute, { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-icon">
            <img src={logo} alt="PetChart Logo" />
          </div>
          <h1 className="login-page-h1">Welcome Back!</h1>
          <h3 className="login-page-h3">Sign in to your PetChart account</h3>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <a href="/register">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;