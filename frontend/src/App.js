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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Home, LocalHospital, Medication, Info, ArrowBack } from '@mui/icons-material';

const SYMPTOMS = [
  'Fever', 'Body Pain', 'Fatigue', 'Headache', 'Nausea', 'Vomiting', 'Diarrhea', 'Stomach Pain',
  'Cough', 'Runny Nose', 'Sore Throat', 'Skin Rash', 'Dizziness', 'Chest Pain', 'Allergy'
];
const HOSPITALS = [
  { name: 'Trinity Care Hospital', address: '445 Maple Avenue, City Center', phone: '+91 9876543210' },
  { name: 'City Health Hospital', address: '28 Green Park Road', phone: '+91 9876522434' },
  { name: 'Best Life Hospital', address: '102 Wellness Street', phone: '+91 9876110987' },
];

function LoginSignup({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!username || !password) {
      setError('Username and password required');
      return false;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    setError('');
    return true;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    if (isSignup) {
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
        setError(data.error || 'Signup failed');
      }
    } else {
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
        setError(data.detail || 'Login failed');
      }
    }
    setLoading(false);
  };

  // OAuth button placeholder
  const handleOAuth = () => {
    window.location.href = 'http://localhost:8000/api/oauth/login/google/'; // Example endpoint
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={8} sx={{ p: 4, borderRadius: 4, backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.15)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <LockOutlined sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            {isSignup ? 'Create Account' : 'Sign In'}
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
              inputProps={{ maxLength: 32 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              inputProps={{ maxLength: 32 }}
            />
            {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 1, fontWeight: 600, fontSize: 18, borderRadius: 2 }}
              disabled={loading}
            >
              {loading ? (isSignup ? 'Signing up...' : 'Signing in...') : (isSignup ? 'Sign Up' : 'Sign In')}
            </Button>
            <Button
              fullWidth
              color="secondary"
              sx={{ mb: 1, fontWeight: 500, borderRadius: 2 }}
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Already have an account? Sign In' : 'New here? Sign Up'}
            </Button>
            {/* <Divider sx={{ my: 2 }}>or</Divider> */}
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
      <AppBar position="static" color="primary" elevation={3} sx={{ backdropFilter: 'blur(8px)', background: 'rgba(31,38,135,0.37)' }}>
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

function DiagnosisFlow({ onDiagnose }) {
  const [selected, setSelected] = useState([]);
  const handleChange = (symptom) => {
    setSelected((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{
        p: 4,
        borderRadius: 4,
        backdropFilter: 'blur(8px)',
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>Select Your Symptoms</Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          {SYMPTOMS.map((symptom) => (
            <Button
              key={symptom}
              variant={selected.includes(symptom) ? 'contained' : 'outlined'}
              color={selected.includes(symptom) ? 'secondary' : 'primary'}
              onClick={() => handleChange(symptom)}
              sx={{ minWidth: 140, fontWeight: 500, borderRadius: 2, bgcolor: selected.includes(symptom) ? 'secondary.light' : 'primary.light', color: selected.includes(symptom) ? 'primary.contrastText' : 'primary.main' }}
            >
              {symptom}
            </Button>
          ))}
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4, fontSize: 18, borderRadius: 2, px: 4, bgcolor: 'secondary.main', color: 'secondary.contrastText', fontWeight: 600 }}
          disabled={selected.length === 0}
          onClick={() => onDiagnose(selected)}
        >
          Predict Disease
        </Button>
      </Paper>
    </Container>
  );
}

function DiagnosisResult({ result, onBack }) {
  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.15)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
        <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mb: 2 }} variant="outlined">Go Back</Button>
        <Typography variant="h4" gutterBottom>Diagnosis Result</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>You may have: <b>{result.disease || 'Unknown'}</b></Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Recommended Medicines:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {result.medications?.map((med, idx) => (
            <Paper key={idx} sx={{ px: 2, py: 1, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.contrastText', fontWeight: 500 }}>{med}</Paper>
          ))}
        </Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Precautions:</Typography>
        <List>
          {result.remedies?.map((rem, idx) => (
            <ListItem key={idx} sx={{ pl: 0 }}>
              <ListItemText primary={rem} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" sx={{ mt: 2, fontWeight: 600, borderRadius: 2 }}>Take Care</Button>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>Nearby Hospital</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {HOSPITALS.map((hosp, idx) => (
            <Paper key={idx} sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>{hosp.name}</Typography>
                <Typography variant="body2">{hosp.address}</Typography>
                <Typography variant="body2">{hosp.phone}</Typography>
              </Box>
              <Button variant="contained" color="secondary" sx={{ borderRadius: 2 }}>Call Now</Button>
            </Paper>
          ))}
        </Box>
        <Button variant="outlined" color="primary" sx={{ mt: 2, borderRadius: 2 }}>Show All Hospitals</Button>
        <Typography variant="body2" color="warning.main" sx={{ mt: 3 }}>
          This system provides preliminary guidance only. Consult a doctor for an accurate diagnosis.
        </Typography>
      </Paper>
    </Container>
  );
}

function LandingPage({ onStart }) {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="md">
        <Paper elevation={8} sx={{ p: 6, borderRadius: 4, textAlign: 'center', backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.25)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
          <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>AI-Powered Disease Detection System</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>Enter your symptoms to get preliminary disease detection and hospital recommendation</Typography>
          <Button variant="contained" color="primary" size="large" sx={{ px: 6, py: 2, fontSize: 20, borderRadius: 2 }} onClick={onStart}>Start Diagnosis</Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 6 }}>
            <Paper sx={{ p: 3, borderRadius: 3, minWidth: 180, textAlign: 'center', bgcolor: 'secondary.main', color: 'secondary.contrastText' }}>
              <Typography variant="h6" fontWeight={600}>Enter Symptoms</Typography>
              <Typography variant="body2">Select your symptoms from a user friendly list</Typography>
            </Paper>
            <Paper sx={{ p: 3, borderRadius: 3, minWidth: 180, textAlign: 'center', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              <Typography variant="h6" fontWeight={600}>Get Results</Typography>
              <Typography variant="body2">Receive instant analysis and probable diseases</Typography>
            </Paper>
            <Paper sx={{ p: 3, borderRadius: 3, minWidth: 180, textAlign: 'center', bgcolor: 'info.main', color: '#fff' }}>
              <Typography variant="h6" fontWeight={600}>Get Medicines</Typography>
              <Typography variant="body2">Receive common medicine recommendations</Typography>
            </Paper>
          </Box>
          <Typography variant="body2" color="warning.main" sx={{ mt: 4 }}>
            This system provides preliminary guidance only. Consult a doctor for an accurate diagnosis.
          </Typography>
        </Paper>
      </Container>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 6 }}>
        © 2025 Home Diagnostic. All Rights Reserved.
      </Typography>
    </Box>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('landing');
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#0052cc', light: '#4f8cff', dark: '#002b5c', contrastText: '#fff' },
      secondary: { main: '#00c9a7', light: '#5fffd7', dark: '#00897b', contrastText: '#fff' },
      background: {
        default: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        paper: 'rgba(255,255,255,0.25)',
      },
      warning: { main: '#ff9800' },
      error: { main: '#d7263d' },
      info: { main: '#2196f3' },
      success: { main: '#00c853' },
    },
    shape: { borderRadius: 16 },
    typography: { fontFamily: 'Segoe UI, Roboto, Arial, sans-serif' },
  });

  const handleDiagnose = async (selectedSymptoms) => {
    try {
      const res = await fetch('http://localhost:8000/api/doctor/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: selectedSymptoms })
      });
      const data = await res.json();
      setDiagnosisResult(data);
      setPage('result');
    } catch (err) {
      toast.error('Error connecting to backend');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!user ? (
        <LoginSignup onLogin={setUser} />
      ) : (
        <>
          <AppBar position="static" color="primary" elevation={3} sx={{ backdropFilter: 'blur(8px)', background: 'rgba(31,38,135,0.37)' }}>
            <Toolbar>
              <Science sx={{ mr: 2 }} />
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Home Diagnostic
              </Typography>
              <Button color="inherit" startIcon={<Home />} sx={{ mx: 1 }} onClick={() => setPage('landing')}>Home</Button>
              <Button color="inherit" startIcon={<Science />} sx={{ mx: 1 }} onClick={() => setPage('diagnose')}>Diagnose</Button>
              <Button color="inherit" startIcon={<Medication />} sx={{ mx: 1 }}>Medicines</Button>
              <Button color="inherit" startIcon={<LocalHospital />} sx={{ mx: 1 }}>Hospitals</Button>
              <Button color="inherit" startIcon={<Info />} sx={{ mx: 1 }}>About</Button>
              <Button color="inherit" sx={{ mx: 1 }} onClick={() => setUser(null)}>Logout</Button>
            </Toolbar>
          </AppBar>
          {page === 'landing' && <LandingPage onStart={() => setPage('diagnose')} />}
          {page === 'diagnose' && <DiagnosisFlow onDiagnose={handleDiagnose} />}
          {page === 'result' && diagnosisResult && <DiagnosisResult result={diagnosisResult} onBack={() => setPage('diagnose')} />}
        </>
      )}
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar theme="colored" />
    </ThemeProvider>
  );
}

export default App;
