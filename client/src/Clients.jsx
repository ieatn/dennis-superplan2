import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config.jsx';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_URL}/fetch_clients`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
        // You might want to set an error state here and display it to the user
      }
    };

    fetchClients();
  }, []);

  const handleClientClick = (client) => {
    navigate(`/clients/${client.client_id}`, { state: { name: `${client.first_name1} ${client.last_name1}` } });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Client List
      </Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <List>
          {clients.map((client) => (
            <ListItem key={client.client_id} button onClick={() => handleClientClick(client)}>
              <ListItemText primary={`${client.first_name1} ${client.last_name1}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Clients;
