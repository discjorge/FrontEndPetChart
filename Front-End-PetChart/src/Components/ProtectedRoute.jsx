import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContent.jsx';

const ProtectedRoute = ({ children, allowedUserTypes = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(user.userType)) {
    const redirectPath = user.userType === 'veterinarian' 
      ? '/dashboard/veterinarian' 
      : '/dashboard/pet-parent';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;