import React, { useState, useEffect } from 'react';
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
  const [folders, setFolders] = useState([]);
  

  // import folders from clients, dynamic render 
  useEffect(() => {
    const fetchFolders = async (client_id) => {
      try {
        const res = await fetch(
          `${API_URL}/fetch_folders/${client_id}`
        );
        const data = await res.json();
        setFolders(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchFolders(id);
  }, [id]);

  const handleChatOpen = () => {
    setChatOpen(true);
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* Render folders dynamically */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {folders.map((folder) => (
          <Grid item xs={6} key={folder.folder_id}>
            <Paper
              component={Link}
              to="/networthboard"
              state={{ clientId: id, folder: folder }}
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
              <Typography variant="subtitle1">{folder.folder_name}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" component="h2" gutterBottom>
        Client Details
      </Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h6">Client ID: {id}</Typography>
        <Typography>Name: {name || 'Unknown'}</Typography>
        {/* Add more client details as needed */}
        <Link to={`/card-game-board`} state={{ clientId: id }}>
          <Button variant="contained" color="primary">
            Card Game
          </Button>
        </Link>
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
      <Dialog open={chatOpen} onClose={() => setChatOpen(false)}>
        <DialogTitle>Chat with us</DialogTitle>
        <DialogContent>
          {/* Add your chatbot content here */}
          <Typography>This is where your chatbot interface would go.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Client;
