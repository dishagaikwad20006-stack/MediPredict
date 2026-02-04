import React, { useState, useEffect } from 'react';
import { Box, Button, Chip, Card, CardContent, Typography, LinearProgress, Stack, Autocomplete, TextField, Paper, Grid, Container } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicationIcon from '@mui/icons-material/Medication';
import SpaIcon from '@mui/icons-material/Spa';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Home({ user }) {
  const [symptoms, setSymptoms] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    axios.get('/api/diseases/').then(r => {
      const all = new Set();
      (r.data || []).forEach(d => (d.symptom_list || []).forEach(s => all.add(s)));
      setSuggestions(Array.from(all));
    }).catch(() => setSuggestions([]));
  }, []);

  const handleDiagnose = async () => {
    if (!symptoms.length) return;
    setLoading(true); setPredictions([]);
    try {
      const res = await axios.post('/api/simple_predict/', { symptoms });
      // The new endpoint returns a prediction object with details
      setPredictions([res.data.prediction]);
    } catch (e) {
      // ignore
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, background: 'linear-gradient(135deg, #2196F3 0%, #00BCD4 100%)', color: 'white', boxShadow: 6 }}>
          <Typography variant="h3" align="center" sx={{ fontWeight: 700, mb: 2, color: 'white', fontSize: { xs: '2rem', md: '2.5rem' } }}>
            Welcome to MediPredict{user ? `, ${user.username}` : ''}
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3, color: 'white', fontSize: { xs: '1rem', md: '1.15rem' } }}>
            Enter your symptoms below and receive AI-powered disease predictions along with recommended medications and home remedies.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Autocomplete
              multiple
              freeSolo
              options={suggestions}
              value={symptoms}
              onChange={(e, v) => setSymptoms(v)}
              renderInput={(params) => (
                <TextField {...params} label="Describe your symptoms" placeholder="e.g. fever, cough" variant="outlined" fullWidth sx={{ fontSize: '1.2rem', minHeight: 56, '.MuiInputBase-input': { fontSize: '1.2rem', py: 2 } }} />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="filled" label={option} {...getTagProps({ index })} key={index} sx={{ bgcolor: '#fff', color: '#1976d2', fontWeight: 500 }} />
                ))
              }
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Button variant="contained" onClick={() => setSymptoms([])} sx={{ bgcolor: 'white', color: '#1976d2', fontWeight: 700, minWidth: 120, boxShadow: 2, '&:hover': { bgcolor: '#e3f2fd' } }}>Clear</Button>
              <Button variant="contained" onClick={handleDiagnose} disabled={loading || !symptoms.length} sx={{ bgcolor: '#1976d2', color: 'white', fontWeight: 700, minWidth: 160, boxShadow: 2, opacity: loading || !symptoms.length ? 0.7 : 1, '&:hover': { bgcolor: '#1565c0' } }}>
                {loading ? 'Analyzing...' : 'Get Diagnosis'}
              </Button>
            </Box>
          </Box>
        </Paper>

        {predictions.length > 0 && (
          <Stack spacing={2} sx={{ mt:3 }}>
            {predictions.map((p, i) => (
              <motion.div key={p.disease+i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{ delay: i * 0.1 }}>
                <Card elevation={4} sx={{ borderRadius: 3, '&:hover': { boxShadow: 6 } }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{display:'flex',justifyContent:'center',alignItems:'center', mb: 2}}>
                      <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">{p.disease}</Typography>
                    </Box>
                    <Typography sx={{mt:1, mb: 2}}>{p.description}</Typography>
                    <Box sx={{mt:2}}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <MedicationIcon color="secondary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2">Suggested Medicines</Typography>
                      </Box>
                      <Box sx={{display:'flex',gap:1,flexWrap:'wrap',mt:1}}>{(p.medications||[]).map(m=><Chip key={m} label={m} color="primary" variant="outlined" />)}</Box>
                    </Box>
                    <Box sx={{mt:2}}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SpaIcon color="success" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2">Suggested Remedies</Typography>
                      </Box>
                      <Box sx={{display:'flex',gap:1,flexWrap:'wrap',mt:1}}>{(p.remedies||[]).map(r=><Chip key={r} label={r} variant="outlined" />)}</Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
