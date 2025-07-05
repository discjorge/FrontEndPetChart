import React, { useState } from 'react';
import PetParentRegister from './PetParentRegister';
import VetRegister from './VetRegister';
import '../styles/Register.css';

export default function Register() {
  const [userType, setUserType] = useState('petparent');

  return (
    <div className="register-page-container">
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
      {userType === 'petparent' ? <PetParentRegister /> : <VetRegister />}
    </div>
  );
}