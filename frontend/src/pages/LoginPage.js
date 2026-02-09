import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginDialog from '../components/LoginDialog';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const handleLogin = (user) => {
    if (onLogin) {
      onLogin(user);
    }
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', background: 'radial-gradient(circle at 20% 20%, rgba(0, 230, 255, 0.08), transparent 25%), radial-gradient(circle at 80% 0%, rgba(33, 203, 243, 0.08), transparent 25%)', p: 2 }}>
      <Stack spacing={1.5} alignItems="center" sx={{ position: 'absolute', top: 64, width: '100%' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#00e6ff', textShadow: '0 4px 24px rgba(0,230,255,0.25)' }}>
          MediPredict
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Sign in to get started
        </Typography>
      </Stack>
      <LoginDialog open onClose={() => {}} onLogin={handleLogin} />
    </Box>
  );
}
