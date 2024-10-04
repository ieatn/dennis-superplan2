import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button, Box } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import "./App.css";

const Home = () => (
  <Box sx={{ my: 4, textAlign: 'center' }}>
    <Typography variant="h2" gutterBottom>Welcome to SuperPlan</Typography>
    <Typography variant="h5" gutterBottom>Plan your projects with ease and efficiency</Typography>
    <Button variant="contained" size="large" sx={{ mt: 2 }} component={Link} to="/clients">Get Started</Button>
  </Box>
);

export default function App() {
    return (
        <div className="app">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>SuperPlan</Link>
                    </Typography>
                    <Button color="inherit" component={Link} to="/clients">Clients</Button>
                    <Button color="inherit" component={Link} to="/blogs">Blogs</Button>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md">
                <Box sx={{ my: 4 }}>
                    <Outlet />
                </Box>
            </Container>
        </div>
    );
}

export { Home };
