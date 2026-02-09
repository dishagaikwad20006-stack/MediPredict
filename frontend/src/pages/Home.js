
import React from 'react';
import { Box, Button, Card, CardContent, Typography, Checkbox, FormControlLabel, Paper, Grid, Container, Divider } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
// Symptom categories for UI
const symptomCategories = [
  {
    label: 'General Symptoms',
    symptoms: ['Fever', 'Body Pain', 'Fatigue', 'Headache']
  },
  {
    label: 'Respiratory Symptoms',
    symptoms: ['Cough', 'Runny Nose', 'Sore Throat', 'Shortness of Breath']
  },
  {
    label: 'Digestive Symptoms',
    symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Stomach Pain']
  },
  {
    label: 'Other Symptoms',
    symptoms: ['Skin Rash', 'Dizziness', 'Chest Pain', 'Allergy']
  }
];

export default function Home() {
  const [selected, setSelected] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [prediction, setPrediction] = React.useState(null);

  const handleToggle = (symptom) => {
    setSelected((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleDiagnose = async () => {
    if (!selected.length) return;
    setLoading(true); setPrediction(null);
    try {
      const res = await axios.post('/api/simple_predict/', { symptoms: selected });
      setPrediction(res.data.prediction || res.data);
    } catch (e) {
      setPrediction({ disease: 'Error', description: 'Could not get prediction.' });
    }
    setLoading(false);
  };

  return (
    <Box className="animated-bg" sx={{ minHeight: '100vh', py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header and Nav */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', px: 4, py: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#00e6ff', letterSpacing: 1 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span role="img" aria-label="stethoscope">🩺</span> Diagnostic
            </span>
          </Typography>
        </Box>
      </Box>
      {/* Main Card */}
      <Container maxWidth="md">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Paper elevation={6} className="glass-bg" sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, color: 'white', boxShadow: 6, backdropFilter: 'blur(16px) saturate(180%)', background: 'rgba(30, 40, 60, 0.85)' }}>
            <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 2, color: 'white', letterSpacing: 1, textShadow: '0 2px 16px #00bcd4' }}>
              Select Your Symptoms
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 3, color: 'white' }}>
              Enter the symptoms you’re experiencing
            </Typography>
            <Divider sx={{ mb: 3, bgcolor: '#00e6ff', opacity: 0.2 }} />
            <Grid container spacing={3}>
              {symptomCategories.map((cat) => (
                <Grid item xs={12} sm={6} md={3} key={cat.label}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#00e6ff' }}>{cat.label}</Typography>
                  {cat.symptoms.map((sym) => (
                    <FormControlLabel
                      key={sym}
                      control={<Checkbox checked={selected.includes(sym)} onChange={() => handleToggle(sym)} sx={{ color: '#00e6ff' }} />}
                      label={<span style={{ color: 'white' }}>{sym}</span>}
                    />
                  ))}
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.97 }}>
                <Button variant="contained" onClick={handleDiagnose} disabled={loading || !selected.length} sx={{ bgcolor: '#1976d2', color: 'white', fontWeight: 700, minWidth: 200, boxShadow: 2, borderRadius: 99, fontSize: '1.1rem', opacity: loading || !selected.length ? 0.7 : 1, '&:hover': { bgcolor: '#00e6ff', color: '#232526' } }}>
                  {loading ? 'Analyzing...' : 'Predict Disease'}
                </Button>
              </motion.div>
            </Box>
            {prediction && (
              <Box sx={{ mt: 4 }}>
                <Card elevation={4} sx={{ borderRadius: 3, background: '#1e283c', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>{prediction.disease}</Typography>
                    <Typography sx={{ mb: 2 }}>{prediction.description}</Typography>
                    {prediction.medications && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle2">Suggested Medicines:</Typography>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>{prediction.medications.map((m) => <li key={m}>{m}</li>)}</ul>
                      </Box>
                    )}
                    {prediction.remedies && (
                      <Box>
                        <Typography variant="subtitle2">Suggested Remedies:</Typography>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>{prediction.remedies.map((r) => <li key={r}>{r}</li>)}</ul>
                      </Box>
                    )}
                    {prediction.alerts && prediction.alerts.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle2" color="warning.main">Alerts:</Typography>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>{prediction.alerts.map((a) => <li key={a}>{a}</li>)}</ul>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Container>
      {/* Footer */}
      <Box sx={{ mt: 8, mb: 2, textAlign: 'center', opacity: 0.7 }}>
        <Typography variant="body2" sx={{ fontFamily: 'Orbitron, Segoe UI, Arial', letterSpacing: 2, color: '#00e6ff' }}>
          ⚠️ This system provides preliminary guidance only. Consult a doctor for an accurate diagnosis.<br />
          © 2025 Home Diagnostic. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}
