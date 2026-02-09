import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import LoginPage from './pages/LoginPage';
import Hospitals from './pages/Hospitals';
import axios from 'axios';

function App(){
  const theme = useMemo(()=> createTheme({ 
    palette:{
      mode: 'dark',
      primary:{main:'#2196f3'}, 
      secondary:{main:'#4caf50'},
      background: {
        default: '#121212',
        paper: '#1e1e1e'
      }
    }, 
    shape:{borderRadius:16},
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 600 },
      h5: { fontWeight: 500 }
    }
  }), []);

  const [user, setUser] = useState(()=>{ try{ return JSON.parse(localStorage.getItem('medipredict_user')) }catch(e){return null} });
  const isAuthenticated = !!user;

  useEffect(() => {
    const token = localStorage.getItem('medipredict_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleLogout = ()=>{ localStorage.removeItem('medipredict_user'); localStorage.removeItem('medipredict_token'); delete axios.defaults.headers.common['Authorization']; setUser(null); };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {isAuthenticated && (
          <AppBar position="static" elevation={2} sx={{ bgcolor: 'primary.main', background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                🩺 MediPredict
              </Typography>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/hospitals">Hospitals</Button>
              <Button color="inherit" component={Link} to="/about">About</Button>
              <Typography variant="body2" sx={{ mx: 2 }}>Welcome, {user?.username}</Typography>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Toolbar>
          </AppBar>
        )}
        <Box sx={{ bgcolor: 'background.default', color:'text.primary', minHeight:'100vh', pt: 2 }}>
          <Container maxWidth="lg" sx={{ py:4 }}>
              <Routes>
                <Route path="/login" element={<LoginPage onLogin={(u)=>setUser(u)} />} />
                <Route path="/" element={isAuthenticated ? <Home user={user} /> : <Navigate to="/login" replace />} />
                <Route path="/hospitals" element={isAuthenticated ? <Hospitals /> : <Navigate to="/login" replace />} />
                <Route path="/about" element={isAuthenticated ? <About /> : <Navigate to="/login" replace />} />
              </Routes>
          </Container>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;