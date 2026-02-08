import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Stack, Typography, InputAdornment } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import axios from 'axios';

export default function LoginDialog({ open, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      if (isSignup && !email) {
        setLoading(false);
        setError('Email is required to create an account.');
        return;
      }
      if (isSignup) {
        // Attempt registration; assumes backend /api/register/ exists
        await axios.post('/api/register/', { username, email, password });
      }
      const res = await axios.post('/api/token/', { username, password });
      const token = res.data.access;
      localStorage.setItem('medipredict_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const user = { username, email };
      localStorage.setItem('medipredict_user', JSON.stringify(user));
      onLogin(user);
      onClose();
    } catch (e) {
      setError(isSignup ? 'Sign up failed. Please try again.' : 'Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', background: 'linear-gradient(120deg, #0f2027, #2c5364)', color: 'white', py: 3 }}>
        <Stack spacing={0.5} alignItems="center">
          <LockOutlinedIcon sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, letterSpacing: 1.5 }}>{isSignup ? 'Create Account' : 'Welcome Back'}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>{isSignup ? 'Join MediPredict in seconds' : 'Sign in to continue to MediPredict'}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 4, background: 'linear-gradient(135deg, rgba(15,32,39,0.9), rgba(44,83,100,0.92))', color: 'white' }}>
        <Stack spacing={2.5}>
          <TextField
            autoFocus
            label="Username"
            fullWidth
            variant="outlined"
            value={username}
            onChange={e => setUsername(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><PersonOutlineIcon sx={{ color: '#00e6ff' }} /></InputAdornment>) }}
          />
          {isSignup && (
            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={e => setEmail(e.target.value)}
              InputProps={{ startAdornment: (<InputAdornment position="start"><MailOutlineIcon sx={{ color: '#00e6ff' }} /></InputAdornment>) }}
            />
          )}
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#00e6ff' }} /></InputAdornment>) }}
          />
          {error && (
            <Box sx={{ color: '#ffb3b3', fontSize: '0.9rem', textAlign: 'center' }}>{error}</Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, background: '#0f2027' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderColor: '#00e6ff', color: '#00e6ff' }}>
            Cancel
          </Button>
          <Button
            onClick={handleLogin}
            variant="contained"
            disabled={!username || !password || loading || (isSignup && !email)}
            sx={{
              minWidth: 140,
              fontWeight: 700,
              background: 'linear-gradient(120deg, #00e6ff, #0072ff)',
              boxShadow: '0 12px 30px rgba(0, 114, 255, 0.35)',
            }}
          >
            {loading ? (isSignup ? 'Creating...' : 'Signing in...') : (isSignup ? 'Create Account' : 'Sign In')}
          </Button>
        </Box>
        <Box sx={{ width: '100%', textAlign: 'center', mt: 1 }}>
          <Button variant="text" sx={{ color: '#00e6ff' }} onClick={() => { setIsSignup(!isSignup); setError(''); }}>
            {isSignup ? 'Already have an account? Sign in' : 'New here? Create an account'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
