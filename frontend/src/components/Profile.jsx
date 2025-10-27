import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel, ToggleButton, ToggleButtonGroup, CircularProgress, Card } from '@mui/material';
import { toast } from 'react-toastify';
import { getCurrentUser, updateUserProfile } from '../services/api';

const genderOptions = [
  { title: 'Male', value: 'male' },
  { title: 'Female', value: 'female' },
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
      toast.success('Profile updated successfully!');
      if (onProfileUpdate) onProfileUpdate();
    } catch (error) {
      console.error('Failed to update profile', error);
      toast.error('Failed to update profile.');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;

  return (
    <Card sx={{ 
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)'
    }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <TextField
          fullWidth
          type="date"
          label="Date of Birth"
          value={formData.date_of_birth}
          onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
          required
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />
        
        <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600 }}>Gender</Typography>
        <ToggleButtonGroup
          value={formData.gender}
          exclusive
          onChange={(e, value) => value && setFormData({ ...formData, gender: value })}
          fullWidth
          sx={{ mb: 3, display: 'flex', gap: 0.5, '& .MuiToggleButton-root': { 
            flex: 1,
            borderRadius: 2,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600
          } }}
        >
          {genderOptions.map(option => (
            <ToggleButton key={option.value} value={option.value}>
              {option.title}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {heightUnit === 'ft' ? (
              <>
                <TextField
                  fullWidth type="number" label="Feet" value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  required sx={{ flex: 1 }}
                />
                <TextField
                  fullWidth type="number" label="Inches" value={inches}
                  onChange={(e) => setInches(e.target.value)} required sx={{ flex: 1 }}
                />
              </>
            ) : (
              <TextField
                fullWidth
                type="number"
                label="Height (cm)"
                value={cm}
                onChange={(e) => setCm(e.target.value)}
                required
              />
            )}
          </Box>
          <ToggleButtonGroup
            value={heightUnit}
            exclusive
            onChange={(e, value) => value && setHeightUnit(value)}
            fullWidth
            sx={{ display: 'flex', gap: 0.5, '& .MuiToggleButton-root': { 
              flex: 1,
              borderRadius: 2,
              py: 1,
              textTransform: 'none',
              fontWeight: 600
            } }}
          >
            <ToggleButton value="ft">ft</ToggleButton>
            <ToggleButton value="cm">cm</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Activity Level</InputLabel>
          <Select
            value={formData.activity_level}
            onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
            label="Activity Level"
          >
            {activityOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.title} ({option.subtitle})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          size="large"
          sx={{ 
            py: 1.5,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          Save Profile
        </Button>
      </Box>
    </Card>
  );
}
export default Profile;