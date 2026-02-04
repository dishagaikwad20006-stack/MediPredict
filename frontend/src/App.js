import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginDialog from './components/LoginDialog';
import Home from './pages/Home';
import Diseases from './pages/Diseases';
import axios from 'axios';

function App(){
  const [mode, setMode] = useState(() => localStorage.getItem('medipredict_mode') || 'light');
  const theme = useMemo(()=> createTheme({ 
    palette:{
      mode, 
      primary:{main:'#2196f3'}, 
      secondary:{main:'#4caf50'},
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e'
      }
    }, 
    shape:{borderRadius:16},
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 600 },
      h5: { fontWeight: 500 }
    }
  }), [mode]);
  useEffect(()=>{ try{ localStorage.setItem('medipredict_mode', mode); }catch(e){} }, [mode]);

  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState(()=>{ try{ return JSON.parse(localStorage.getItem('medipredict_user')) }catch(e){return null} });

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
      <AppBar position="static" elevation={2} sx={{ bgcolor: 'primary.main', background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🩺 MediPredict
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/diseases">Diseases</Button>
          {user ? (
            <>
              <Typography variant="body2" sx={{ mx: 2 }}>Welcome, {user.username}</Typography>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" onClick={()=>setLoginOpen(true)}>Sign In</Button>
          )}
          <IconButton color="inherit" onClick={()=>setMode(mode==='light'?'dark':'light')}>
            {mode==='light'?<Brightness4Icon/>:<Brightness7Icon/>}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ bgcolor: 'background.default', color:'text.primary', minHeight:'100vh', pt: 2 }}>
        <Container maxWidth="lg" sx={{ py:4 }}>
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/diseases" element={<Diseases />} />
            </Routes>
        </Container>
        <LoginDialog open={loginOpen} onClose={()=>setLoginOpen(false)} onLogin={(u)=>setUser(u)} />
      </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;