import React, { useState } from 'react';
import '../styles/PetParentRegister.css';

export default function PetParentRegister() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    address: '',
    petName: '',
    species: '',
    breed: '',
    petPhoto: null,
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    try {
      const res = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful!');
      } else {
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setMessage('An error occurred.');
    }
  };

  return (
    <div className="petparentregister-page-box">
      <form className="petparentregister-form" onSubmit={handleSubmit}>
        <div className="petparentregister-field">
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required />
        </div>
        <div className="petparentregister-field">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="petparentregister-field">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div className="petparentregister-field">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" value={form.address} onChange={handleChange} required />
        </div>
        <div className="petparentregister-field">
          <label htmlFor="petName">Pet's Name</label>
          <input type="text" id="petName" name="petName" value={form.petName} onChange={handleChange} required />
        </div>
        <div className="petparentregister-field">
          <label htmlFor="species">Species</label>
          <input type="text" id="species" name="species" value={form.species} onChange={handleChange} required />
        </div>
        <div className="petparentregister-field">
          <label htmlFor="breed">Breed</label>
          <input type="text" id="breed" name="breed" value={form.breed} onChange={handleChange} required />
        </div>
        <div className="petparentregister-field">
          <label htmlFor="petPhoto">Pet's Photo</label>
          <input type="file" id="petPhoto" name="petPhoto" accept="image/*" onChange={handleChange} />
        </div>
        <button type="submit" className="petparentregister-submit-btn">Create PetChart Account</button>
        {message && <div className="petparentregister-message">{message}</div>}
      </form>
    </div>
  );
} 