import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Chip, Stack } from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';
import SpaIcon from '@mui/icons-material/Spa';
import axios from 'axios';

export default function Medicines() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('/api/diseases/').then((r) => {
      const data = r.data || [];
      const toArr = (v) => Array.isArray(v) ? v : (typeof v === 'string' ? v.split(',').map(s=>s.trim()).filter(Boolean) : []);
      const rows = data.map((d) => ({
        name: d.name,
        description: d.description,
        meds: toArr(d.medications || d.meds),
        remedies: toArr(d.remedies),
      }));
      setItems(rows);
    }).catch(() => setItems([]));
  }, []);

  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h4" sx={{ mt: 2, mb: 4, textAlign: 'center', color: 'primary.main', fontWeight: 700 }}>
        Medicines & Remedies
      </Typography>
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.name}>
            <Card elevation={4} sx={{ height: '100%', borderRadius: 3, '&:hover': { boxShadow: 8 } }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <MedicationIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                </Stack>
                <Typography variant="body2" sx={{ mb: 2 }}>{item.description}</Typography>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Medicines</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                  {item.meds.length ? item.meds.map((m) => <Chip key={m} label={m} color="primary" variant="outlined" />) : <Typography variant="caption">No data</Typography>}
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <SpaIcon color="success" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Home Remedies</Typography>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {item.remedies.length ? item.remedies.map((r) => <Chip key={r} label={r} variant="outlined" />) : <Typography variant="caption">No data</Typography>}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
