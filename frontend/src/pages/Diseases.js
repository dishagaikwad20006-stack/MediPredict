import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Grid, Card, CardContent } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import axios from 'axios';

export default function Diseases(){
  const [list, setList] = useState([]);
  useEffect(()=>{ axios.get('/api/diseases/').then(r=>setList(r.data||[])).catch(()=>setList([])) },[]);
  return (
    <Container>
      <Typography variant="h4" sx={{mt:2,mb:4, textAlign: 'center', color: 'primary.main'}}>All Diseases Database</Typography>
      <Grid container spacing={3}>
        {list.map(d=> (
          <Grid item xs={12} sm={6} md={4} key={d.id}>
            <Card elevation={3} sx={{ height: '100%', borderRadius: 3, '&:hover': { boxShadow: 6 } }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">{d.name}</Typography>
                </Box>
                <Typography sx={{mt:1, mb: 2}}>{d.description}</Typography>
                <Typography variant="body2" sx={{fontStyle:'italic', color: 'text.secondary'}}>
                  Symptoms: {(d.symptom_list||[]).join(', ')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
