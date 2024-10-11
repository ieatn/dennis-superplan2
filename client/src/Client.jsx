import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Container, Typography, Paper, Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import FolderIcon from '@mui/icons-material/Folder';
import { API_URL } from './config.jsx';



const Client = () => {
  const { id } = useParams();
  const location = useLocation();
  const { name } = location.state || {};
  const [chatOpen, setChatOpen] = useState(false);

  // import folders from clients, dyanmic render 

  const handleChatOpen = () => {
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* Replace NetWorthBoard button with two folders */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Paper
            component={Link}
            to="/networthboard"
            state={{ clientId: id }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 2,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <FolderIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="subtitle1">2023</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper
            component={Link}
            to="/networthboard"
            state={{ clientId: id }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 2,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <FolderIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="subtitle1">2024</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h4" component="h2" gutterBottom>
        Client Details
      </Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h6">Client ID: {id}</Typography>
        <Typography>Name: {name || 'Unknown'}</Typography>
        {/* Add more client details as needed */}
      </Paper>

      {/* Chatbot Fab Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={handleChatOpen}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <ChatIcon />
      </Fab>

      {/* Chatbot Dialog */}
      <Dialog open={chatOpen} onClose={handleChatClose}>
        <DialogTitle>Chat with us</DialogTitle>
        <DialogContent>
          {/* Add your chatbot content here */}
          <Typography>This is where your chatbot interface would go.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChatClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Client;
