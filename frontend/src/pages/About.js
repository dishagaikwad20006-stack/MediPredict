import React from 'react';
import { Container, Typography, Card, CardContent, Grid, Stack } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import ScienceIcon from '@mui/icons-material/Science';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export default function About() {
  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h4" sx={{ mt: 2, mb: 3, textAlign: 'center', fontWeight: 800, color: 'primary.main' }}>
        About MediPredict
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
        MediPredict provides symptom-based guidance, medication references, and home remedies. It is not a substitute for professional medical advice. Always consult a licensed physician for diagnosis and treatment.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={4} sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <ShieldIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Privacy First</Typography>
              </Stack>
              <Typography variant="body2">
                We only use your inputs to generate on-the-spot suggestions. No symptom data is shared with third parties.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={4} sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <ScienceIcon color="secondary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>AI + Rule Fusion</Typography>
              </Stack>
              <Typography variant="body2">
                We combine machine learning with expert-inspired rules to improve relevance for common symptom clusters.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={4} sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <SupportAgentIcon color="action" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Need Help?</Typography>
              </Stack>
              <Typography variant="body2">
                For support or feedback, contact us at support@medipredict.local. In emergencies, call local medical services immediately.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
