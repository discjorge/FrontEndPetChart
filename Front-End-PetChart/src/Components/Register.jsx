import React, { useState } from 'react';
import VetRegister from './VetRegister';
import PetParentRegister from './PetParentRegister';

export default function Register() {
  const [userType, setUserType] = useState('petparent'); // 'petparent' or 'vet'

  return (
    <div className="page-box">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <button
          type="button"
          className={userType === 'petparent' ? 'vetregister-role-btn vetregister-role-active' : 'vetregister-role-btn vetregister-role-inactive'}
          onClick={() => setUserType('petparent')}
        >
          Pet Parent
          <div className="vetregister-role-desc">I want to track my pet's health</div>
        </button>
        <button
          type="button"
          className={userType === 'vet' ? 'vetregister-role-btn vetregister-role-active' : 'vetregister-role-btn vetregister-role-inactive'}
          onClick={() => setUserType('vet')}
        >
          Veterinarian
          <div className="vetregister-role-desc">I provide veterinary care</div>
        </button>
      </div>
      {userType === 'petparent' ? <PetParentRegister /> : <VetRegister />}
    </div>
  );
}