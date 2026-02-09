import React, { useMemo } from 'react';
import { Box, Grid, Card, CardContent, Typography, Stack, Chip, Button, Divider, Rating } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';
import ScheduleIcon from '@mui/icons-material/Schedule';

const hospitals = [
  {
    name: 'Fortis Hiranandani Hospital',
    distanceKm: 1.4,
    address: 'Sector 10A, Vashi, Navi Mumbai',
    phone: '+91 22 3919 9222',
    etaMinutes: 7,
    rating: 4.5,
    open24: true,
    bedsAvailable: 15,
    specialties: ['Emergency', 'Cardiology', 'ICU']
  },
  {
    name: 'Apollo Hospitals Navi Mumbai',
    distanceKm: 4.2,
    address: 'Parsik Hill Road, Belapur, Navi Mumbai',
    phone: '+91 22 3350 3350',
    etaMinutes: 16,
    rating: 4.4,
    open24: true,
    bedsAvailable: 22,
    specialties: ['Oncology', 'Cardiac Sciences', 'Neurosciences']
  },
  {
    name: 'MGM Hospital Vashi',
    distanceKm: 2.8,
    address: 'Sector 3, Vashi, Navi Mumbai',
    phone: '+91 22 2781 4046',
    etaMinutes: 11,
    rating: 4.2,
    open24: true,
    bedsAvailable: 12,
    specialties: ['Emergency', 'Orthopedics', 'Radiology']
  },
  {
    name: 'Terna Specialty Hospital',
    distanceKm: 6.5,
    address: 'Sector 22, Nerul, Navi Mumbai',
    phone: '+91 22 6152 2525',
    etaMinutes: 20,
    rating: 4.1,
    open24: true,
    bedsAvailable: 10,
    specialties: ['General Surgery', 'Nephrology', 'Trauma']
  }
];

export default function Hospitals() {
  const sortedHospitals = useMemo(
    () => [...hospitals].sort((a, b) => a.distanceKm - b.distanceKm),
    []
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Nearby Hospitals
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Quick view of close-by emergency and specialty care options.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Chip icon={<LocalHospitalIcon />} label="Emergency ready" color="primary" variant="outlined" />
          <Chip icon={<ScheduleIcon />} label="24x7" color="success" variant="outlined" />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {sortedHospitals.map((hosp) => {
          const mapQuery = encodeURIComponent(`${hosp.name} ${hosp.address}`);
          return (
          <Grid item xs={12} sm={6} key={hosp.name}>
            <Card elevation={4} sx={{ height: '100%', background: 'rgba(30,30,30,0.9)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.06)' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{hosp.name}</Typography>
                  <Chip size="small" label={`${hosp.distanceKm} km`} color="info" />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                  <Rating value={hosp.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">{hosp.rating.toFixed(1)} rating</Typography>
                </Stack>

                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

                <Stack spacing={1.2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PlaceIcon fontSize="small" />
                    <Typography variant="body2">{hosp.address}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ScheduleIcon fontSize="small" />
                    <Typography variant="body2">ETA ~ {hosp.etaMinutes} mins · Beds: {hosp.bedsAvailable} · {hosp.open24 ? 'Open 24x7' : 'Open 7am-10pm'}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {hosp.specialties.map((tag) => (
                      <Chip key={tag} label={tag} size="small" color="secondary" variant="outlined" sx={{ mb: 0.5 }} />
                    ))}
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                  <Button variant="contained" color="primary" startIcon={<PhoneIcon />} href={`tel:${hosp.phone}`}>
                    Call
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<PlaceIcon />}
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Directions
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
