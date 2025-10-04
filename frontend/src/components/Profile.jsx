import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateUserProfile } from '../services/api';
import { IoMale, IoFemale } from 'react-icons/io5';
import UnitSwitch from './UnitSwitch';
import ToggleButtonGroup from './ToggleButtonGroup';
import '../styles/Profile.css';

const genderOptions = [
  { title: 'Male', value: 'male', icon: <IoMale /> },
  { title: 'Female', value: 'female', icon: <IoFemale /> },
];

const activityOptions = [
  { title: 'Sedentary', value: 'sedentary', subtitle: 'Office job' },
  { title: 'Light', value: 'light', subtitle: '1-3 days/wk' },
  { title: 'Moderate', value: 'moderate', subtitle: '3-5 days/wk' },
  { title: 'Active', value: 'active', subtitle: '6-7 days/wk' },
  { title: 'Very Active', value: 'very_active', subtitle: 'Hard labor' },
];

function Profile({ onProfileUpdate }) {
  const [formData, setFormData] = useState({
    date_of_birth: '',
    gender: 'male',
    activity_level: 'sedentary',
  });
  const [heightUnit, setHeightUnit] = useState('ft');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [cm, setCm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        const user = response.data;
        setFormData({
          date_of_birth: user.date_of_birth || '',
          gender: user.gender || 'male',
          activity_level: user.activity_level || 'sedentary',
        });
        if (user.height_cm) {
          const totalInches = user.height_cm / 2.54;
          setFeet(Math.floor(totalInches / 12));
          setInches(Math.round(totalInches % 12));
          setCm(user.height_cm);
        }
      } catch (error) { console.error("Failed to fetch user data", error); }
      finally { setLoading(false); }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let heightInCm;
      if (heightUnit === 'ft') {
        const totalInches = (parseFloat(feet) * 12) + (parseFloat(inches) || 0);
        heightInCm = totalInches * 2.54;
      } else {
        heightInCm = parseFloat(cm);
      }
      const dataToSend = { ...formData, height_cm: heightInCm };
      await updateUserProfile(dataToSend);
      alert('Profile updated successfully!');
      if (onProfileUpdate) onProfileUpdate();
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile.');
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Date of Birth</label>
        <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} required />
      </div>
      <div className="gender-group">
        <label>Gender</label>
        <ToggleButtonGroup
          options={genderOptions}
          selectedValue={formData.gender}
          onSelect={(value) => setFormData({ ...formData, gender: value })}
        />
      </div>
      <div>
        <label>Height</label>
        <div className="input-row">
          {heightUnit === 'ft' ? (
            <div className="height-inputs">
              <input type="number" value={feet} onChange={(e) => setFeet(e.target.value)} placeholder="ft" required />
              <input type="number" value={inches} onChange={(e) => setInches(e.target.value)} placeholder="in" />
            </div>
          ) : (
            <div className="height-inputs">
              <input type="number" value={cm} onChange={(e) => setCm(e.target.value)} placeholder="cm" required />
            </div>
          )}
          <UnitSwitch unit={heightUnit} setUnit={setHeightUnit} options={['ft', 'cm']} />
        </div>
      </div>
      <div>
        <label>Activity Level</label>
        <select 
          name="activity_level" 
          value={formData.activity_level} 
          onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
        >
          {activityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.title} ({option.subtitle})
            </option>
          ))}
        </select>
      </div>
      <button type="submit" style={{ marginTop: '1rem' }}>Save Profile</button>
    </form>
  );
}
export default Profile;