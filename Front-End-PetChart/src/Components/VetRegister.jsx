import React, { useState } from 'react';
import '../styles/VetRegister.css';

export default function VetRegister() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profileImage: null,
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
      const res = await fetch('http://localhost:3000/vets/register', {
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
    <div className="vetregister-page-box">
      <form className="vetregister-form" onSubmit={handleSubmit}>
        <div className="vetregister-field">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
        </div>
        <div className="vetregister-field">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
        <div className="vetregister-field">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="vetregister-field">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div className="vetregister-field">
          <label htmlFor="profileImage">Profile Image</label>
          <input type="file" id="profileImage" name="profileImage" accept="image/*" onChange={handleChange} />
        </div>
        <button type="submit" className="vetregister-submit-btn">Create PetChart Account</button>
        {message && <div className="vetregister-message">{message}</div>}
      </form>
    </div>
  );
} 