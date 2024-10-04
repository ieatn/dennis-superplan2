import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NetWorthBoard = () => {
  const [showBanks, setShowBanks] = useState(true);

  const handleToggle = () => {
    setShowBanks(!showBanks);
  };

  const transitionStyle = (isVisible) => ({
    transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
    opacity: isVisible ? 1 : 0,
    transition: 'transform 0.5s ease, opacity 0.5s ease',
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="contained" color="secondary" onClick={handleToggle}>
          {showBanks ? 'Hide Banks' : 'Show Banks'}
        </Button>
        <Button component={Link} to="/estateboard" variant="contained" color="primary">
          Go to Estate Board
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {/* Assets Bank */}
        <Grid item xs={6}>
          <Paper
            elevation={3}
            sx={{ p: 2, height: '100%', ...transitionStyle(showBanks) }}
          >
            <Typography variant="h6">Assets Bank</Typography>
            <Typography variant="body1">$100,000</Typography>
          </Paper>
        </Grid>

        {/* Assets */}
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6">Assets</Typography>
            <Typography variant="body1">$50,000</Typography>
          </Paper>
        </Grid>

        {/* Liabilities Bank */}
        <Grid item xs={6}>
          <Paper
            elevation={3}
            sx={{ p: 2, height: '100%', ...transitionStyle(showBanks) }}
          >
            <Typography variant="h6">Liabilities Bank</Typography>
            <Typography variant="body1">$5,000/month</Typography>
          </Paper>
        </Grid>

        {/* Liabilities */}
        <Grid item xs={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6">Liabilities</Typography>
            <Typography variant="body1">$3,000/month</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Total Assets:</Typography>
            <Typography variant="body1">$100,000</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Total Liabilities:</Typography>
            <Typography variant="body1">$50,000</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Net Worth:</Typography>
            <Typography variant="body1">$50,000</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default NetWorthBoard;
