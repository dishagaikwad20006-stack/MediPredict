import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import { LockOutlined, WbSunny, Nightlight, Logout, Person, History, Science } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SYMPTOMS = ['Fever', 'Cough', 'Headache', 'Chest Pain', 'Rash'];

function LoginSignup({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!username || !password) {
      toast.error('Please enter username and password');
      setLoading(false);
      return;
    }
    if (isSignup) {
      // Signup
      const res = await fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Signup successful! Please log in.');
        setIsSignup(false);
      } else {
        toast.error(data.error || 'Signup failed');
      }
    } else {
      // Login
      const res = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.access) {
        toast.success('Login successful!');
        onLogin({ username, token: data.access });
      } else {
        toast.error(data.detail || 'Login failed');
      }
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Typography>
          <Box component="form" onSubmit={handleAuth} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              autoFocus
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 1 }}
              disabled={loading}
            >
              {loading ? (isSignup ? 'Signing up...' : 'Signing in...') : (isSignup ? 'Sign Up' : 'Sign In')}
            </Button>
            <Button
              fullWidth
              color="secondary"
              sx={{ mb: 1 }}
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Already have an account? Sign In' : 'New here? Sign Up'}
            </Button>
          </Box>
        </Box>
      </Paper>
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar theme="colored" />
    </Container>
  );
}

function Dashboard({ user, onLogout, darkMode, onThemeToggle }) {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleChange = (symptom) => {
    setSelected((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('http://localhost:8000/api/predict/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ symptoms: selected }),
      });
      const data = await res.json();
      setResult(data.disease || data.error || 'No result');
      setHistory([{ symptoms: [...selected], disease: data.disease || data.error || 'No result', date: new Date().toLocaleString() }, ...history]);
      toast.success('Prediction complete!');
    } catch (err) {
      setResult('Error connecting to backend');
      toast.error('Error connecting to backend');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: darkMode ? 'background.default' : '#f7faff' }}>
      <AppBar position="static" color="primary" elevation={3}>
        <Toolbar>
          <Science sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MediPredict
          </Typography>
          <IconButton color="inherit" onClick={onThemeToggle} title="Toggle theme">
            {darkMode ? <WbSunny /> : <Nightlight />}
          </IconButton>
          <IconButton color="inherit" onClick={onLogout} title="Logout">
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>Disease Detection</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {SYMPTOMS.map((symptom) => (
                <Button
                  key={symptom}
                  variant={selected.includes(symptom) ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => handleChange(symptom)}
                  sx={{ minWidth: 120 }}
                >
                  {symptom}
                </Button>
              ))}
            </Box>
            <Button type="submit" variant="contained" color="secondary" disabled={loading}>
              {loading ? 'Predicting...' : 'Predict Disease'}
            </Button>
          </Box>
          {result && (
            <Paper elevation={2} sx={{ p: 2, mb: 2, borderLeft: '5px solid #1976d2' }}>
              <Typography variant="h6">Prediction Result</Typography>
              <Typography>{result}</Typography>
            </Paper>
          )}
          {history.length > 0 && (
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>History</Typography>
              <List>
                {history.map((item, idx) => (
                  <ListItem key={idx}>
                    <ListItemIcon><History /></ListItemIcon>
                    <ListItemText
                      primary={<span><b>{item.disease}</b> [{item.symptoms.join(', ')}]</span>}
                      secondary={item.date}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Paper>
      </Container>
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar theme={darkMode ? 'dark' : 'light'} />
    </Box>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#00e6ff' },
    },
    shape: { borderRadius: 12 },
    typography: { fontFamily: 'Segoe UI, Roboto, Arial, sans-serif' },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user ? (
        <Dashboard user={user} onLogout={() => setUser(null)} darkMode={darkMode} onThemeToggle={() => setDarkMode(m => !m)} />
      ) : (
        <LoginSignup onLogin={setUser} />
      )}
    </ThemeProvider>
  );
}

export default App;
