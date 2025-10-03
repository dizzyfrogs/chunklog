import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateUserProfile } from '../services/api';

function Profile({ onProfileUpdate }) {
  const [formData, setFormData] = useState({
    date_of_birth: '',
    gender: 'male',
    height_cm: '',
    activity_level: 'sedentary',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        setFormData({
          date_of_birth: response.data.date_of_birth || '',
          gender: response.data.gender || 'male',
          height_cm: response.data.height_cm || '',
          activity_level: response.data.activity_level || 'sedentary',
        });
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        height_cm: parseFloat(formData.height_cm),
      };
      await updateUserProfile(dataToSend);
      alert('Profile updated successfully!');
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile.');
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h4>Your Profile</h4>
      <div>
        <label>Date of Birth:</label>
        <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
      </div>
      <div>
        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div>
        <label>Height (in cm):</label>
        <input type="number" name="height_cm" value={formData.height_cm} onChange={handleChange} placeholder="e.g., 180" required />
      </div>
      <div>
        <label>Activity Level:</label>
        <select name="activity_level" value={formData.activity_level} onChange={handleChange}>
          <option value="sedentary">Sedentary (little or no exercise)</option>
          <option value="light">Light (1-3 days/week)</option>
          <option value="moderate">Moderate (3-5 days/week)</option>
          <option value="active">Active (6-7 days/week)</option>
          <option value="very_active">Very Active (very hard exercise & physical job)</option>
        </select>
      </div>
      <button type="submit">Save Profile</button>
    </form>
  );
}

export default Profile;