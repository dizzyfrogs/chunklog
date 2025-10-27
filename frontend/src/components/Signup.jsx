import React, { useState } from 'react';
import { TextField, Button, Box, Alert, Card, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { signupUser } from '../services/api';

function Signup({ onSignupSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signupUser({ username, email, password });
      toast.success('Signup successful! Please log in.');
      onSignupSuccess();
    } catch (err) {
      console.error('Signup failed:', err.response?.data?.detail);
      setError(err.response?.data?.detail || 'An unknown error occurred.');
    }
  };

  return (
    <Card sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1, textAlign: 'center' }}>
        Create Account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
        Start tracking your nutrition today
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 3 }}
        />
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
          Sign Up
        </Button>
      </form>
    </Card>
  );
}

export default Signup;