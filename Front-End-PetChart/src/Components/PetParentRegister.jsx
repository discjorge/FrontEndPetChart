import React, { useState } from 'react';
import '../styles/PetParentRegister.css';

export default function PetParentRegister() {
  const [form, setForm] = useState({
    owner_name: '',
    email: '',
    password: '',
    address: '',
    pet_name: '',
    animal: '',
    breed: '',
    pet_image: null, 
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
      
      const res = await fetch("/users/register", {
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
    <div className="petparentregister-page-box">
      <form className="petparentregister-form" onSubmit={handleSubmit}>
        <div className="petparentregister-field">
          <label htmlFor="owner_name">Full Name</label>
          <input type="text" id="owner_name" name="owner_name" value={form.owner_name} onChange={handleChange} required />
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
          <label htmlFor="pet_name">Pet's Name</label>
          <input type="text" id="pet_name" name="pet_name" value={form.pet_name} onChange={handleChange} required />
        </div>
        <div className="petparentregister-field">
          <label htmlFor="animal">Species</label>
          <input type="text" id="animal" name="animal" value={form.animal} onChange={handleChange} required />
        </div>
        <div className="petparentregister-field">
          <label htmlFor="breed">Breed</label>
          <input type="text" id="breed" name="breed" value={form.breed} onChange={handleChange} required />
        </div>
        <div className="petparentregister-field">
          <label htmlFor="pet_image">Pet's Photo</label>
          <input type="file" id="pet_image" name="pet_image" accept="image/*" onChange={handleChange} />
        </div>
        <button type="submit" className="petparentregister-submit-btn">Create PetChart Account</button>
        {message && <div className="petparentregister-message">{message}</div>}
      </form>
    </div>
  );
} 