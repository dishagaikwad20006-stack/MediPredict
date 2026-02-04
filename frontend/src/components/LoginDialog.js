import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function LoginDialog({ open, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('/api/token/', { username, password });
      const token = res.data.access;
      localStorage.setItem('medipredict_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const user = { username, email };
      localStorage.setItem('medipredict_user', JSON.stringify(user));
      onLogin(user);
      onClose();
    } catch (e) {
      alert('Invalid credentials');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        Sign In to MediPredict
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <TextField
          autoFocus
          margin="dense"
          label="Username"
          fullWidth
          variant="outlined"
          value={username}
          onChange={e => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={e => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button onClick={handleLogin} variant="contained" disabled={!username || !password}>
          Sign In
        </Button>
      </DialogActions>
    </Dialog>
  );
}
