import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Container, Typography, Paper, Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import FolderIcon from '@mui/icons-material/Folder';
import { API_URL } from './config.jsx';
import ChatBot from './ChatBot.jsx';

const Client = () => {
  const { id } = useParams();
  const location = useLocation();
  const { name } = location.state || {};
  const [chatVisible, setChatVisible] = useState(false);
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

  const handleChatToggle = () => {
    setChatVisible((prev) => !prev);
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
        <Link to={`/questionnaire`} state={{ clientId: id }}>
          <Button variant="contained" color="primary">
            Questionnaire
          </Button>
        </Link>
      </Paper>
      {/* Chatbot Fab Button or Placeholder */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setChatVisible((prev) => !prev)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <ChatIcon />
      </Fab>

      {/* Chatbot Popup */}
      {chatVisible && (
        <div style={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          width: '600px',
          height: '700px',
          backgroundColor: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          borderRadius: '8px',
          zIndex: 1000,
        }}>
          <ChatBot clientId={id} />
        </div>
      )}
    </Container>
  );
};

export default Client;
