import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PetParentRegister from './PetParentRegister';
import VetRegister from './VetRegister';
import '../styles/Register.css';
import logo from '../assets/Images/transparent-logo.png';

export default function Register() {
  const [userType, setUserType] = useState('petparent');
  const navigate = useNavigate();

  return (
    <div className="register-page-container">
      <div className="register-card">
        <div className="register-header">
            <div className="logo-icon">
              <img src={logo} alt="PetChart Logo" />
            </div>
          <h1>Join PetChart</h1>
          <h3>Create your account to get started</h3>
        </div>

        <div className="register-toggle-row">
          <button
            type="button"
            className={`register-toggle-btn ${userType === 'petparent' ? 'active' : ''}`}
            onClick={() => setUserType('petparent')}
          >
            Pet Parent
            <div className="register-toggle-desc">I want to track my pet's health</div>
          </button>
          <button
            type="button"
            className={`register-toggle-btn ${userType === 'vet' ? 'active' : ''}`}
            onClick={() => setUserType('vet')}
          >
            Veterinarian
            <div className="register-toggle-desc">I provide veterinary care</div>
          </button>
        </div>

        {/* Your existing conditional rendering */}
        {userType === 'petparent' ? <PetParentRegister /> : <VetRegister />}

        {/* Add login link at bottom */}
        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')} 
              className="link-btn"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}