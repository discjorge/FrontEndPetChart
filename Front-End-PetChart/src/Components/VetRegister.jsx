import React, { useState } from 'react';
import '../styles/VetRegister.css';

export default function VetRegister() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    profile_image: null,
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
      console.log('Sending form data:', Object.fromEntries(formData));
      
      const res = await fetch('/vets/register', {
        method: 'POST',
        body: formData,
      });
      
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Server error response:', errorText);
        setMessage(`Registration failed: ${res.status} - ${errorText}`);
        return;
      }
      
      const data = await res.json();
      setMessage('Registration successful!');
    } catch (err) {
      console.error('Fetch error:', err);
      setMessage(`An error occurred: ${err.message}`);
    }
  };

  return (
    <div className="vetregister-page-box">
      <form className="vetregister-form" onSubmit={handleSubmit}>
        <div className="vetregister-field">
          <label htmlFor="first_name">First Name</label>
          <input type="text" id="first_name" name="first_name" value={form.firstName} onChange={handleChange} required />
        </div>
        <div className="vetregister-field">
          <label htmlFor="last_name">Last Name</label>
          <input type="text" id="last_name" name="last_name" value={form.lastName} onChange={handleChange} required />
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
          <label htmlFor="profile_image">Profile Image</label>
          <input type="file" id="profile_image" name="profile_image" accept="image/*" onChange={handleChange} />
        </div>
        <button type="submit" className="vetregister-submit-btn">Create PetChart Account</button>
        {message && <div className="vetregister-message">{message}</div>}
      </form>
    </div>
  );
} 