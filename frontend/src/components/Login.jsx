import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Card } from '@mui/material';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await loginUser(usernameOrEmail, password);
      login(response.data.access_token, response.data.refresh_token);
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Check your credentials.');
    }
  };

  return (
    <Card sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1, textAlign: 'center' }}>
        Welcome Back
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
        Sign in to continue tracking your nutrition
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username or Email"
          variant="outlined"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
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
          Login
        </Button>
      </form>
    </Card>
  );
}

export default Login;