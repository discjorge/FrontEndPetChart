// contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import React from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));


  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const storedToken = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    
    if (storedToken && storedUserType) {
      try {
        const userData = await fetchUserData(storedToken, storedUserType);
        setUser({ ...userData, userType: storedUserType });
        setToken(storedToken);
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  };

  const fetchUserData = async (authToken, userType) => {
    const endpoint = userType === 'veterinarian' ? '/vets/account' : '/users/account';
    const response = await fetch(`${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    return response.json();
  };

  const login = async (email, password) => {
    try {
      const userTypeResponse = await fetch(
        `/users/check-user-type?email=${encodeURIComponent(email)}`
      );
      const userTypeData = await userTypeResponse.json();

      if (!userTypeData.exists) {
        throw new Error('No account found with this email address.');
      }

      const loginEndpoint = userTypeData.userType === 'veterinarian' 
        ? '/vets/login' 
        : '/users/login';
      const loginResponse = await fetch(`${loginEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const loginResult = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginResult.message || 'Invalid credentials');
      }

      const authToken = loginResult.token;
      const userType = userTypeData.userType;
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('userType', userType);
      
      setToken(authToken);

      const userData = await fetchUserData(authToken, userType);
      setUser({ ...userData, userType });

      return { success: true, userType };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    setToken,
    setUser,
    userType: user?.userType
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};