import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { getDescendants } from "@minoru/react-dnd-treeview";
import axios from "axios";
import { API_URL } from "./config";

const NetWorthBoard = () => {
  let { state } = useLocation();
  const { clientId, folder } = state;

  // client data
  const [folders, setFolders] = useState([]);
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState(0);
  const [netWorth, setNetWorth] = useState(0);

  // tree
  const sampleData = [];
  const [treeData, setTreeData] = useState(sampleData);
  let tree1 = getDescendants(treeData, 100);
  let tree2 = getDescendants(treeData, 200);
  let tree3 = getDescendants(treeData, 300);
  let tree4 = getDescendants(treeData, 400);

  // scenarios
  const [scenariosArray, setScenariosArray] = useState([]);
  const [scenario, setScenario] = useState(scenariosArray[0]);
  const [scenarioId, setScenarioId] = useState(0);
  const [scenarioName, setScenarioName] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);


  useEffect(() => {
    const fetchFolders = async (client_id) => {
      try {
        const res = await fetch(
          `http://localhost:5000/fetch_folders/${client_id}`
        );
        const data = await res.json();
        setFolders(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchFolders(clientId);
  }, []);


  const [showLeftBoxes, setShowLeftBoxes] = useState(true);

  const toggleLeftBoxes = () => {
    setShowLeftBoxes(!showLeftBoxes);
  };

  const transitionStyle = (isVisible) => ({
    width: isVisible ? '50%' : '0%',
    opacity: isVisible ? 1 : 0,
    transition: 'width 0.5s ease, opacity 0.5s ease',
    overflow: 'hidden',
  });

  return (
    <Box sx={{
      height: 'calc(100vh - 64px)', // Adjust height to account for the AppBar
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f0f0f0', // Light gray background
      padding: 2,
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mb: 1 }}>
          <Button
            variant="contained"
            onClick={toggleLeftBoxes}
            sx={{ mr: 1 }} // Add margin to the right for spacing
          >
            {showLeftBoxes ? 'Hide Left Boxes' : 'Show Left Boxes'}
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#4caf50', color: '#ffffff' }} // Change button color
            component={Link}
            to={`/estateboard`}
          >
            Go to Estate Board
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Box sx={{ display: 'flex', flexGrow: 4, mb: 2 }}>
          <Box sx={{ ...transitionStyle(showLeftBoxes), mr: showLeftBoxes ? 2 : 0 }}>
            <Paper sx={{ height: '100%', p: 2 }}>
              <Typography variant="h6">Asset Bank</Typography>
            </Paper>
          </Box>
          <Box sx={{ flexGrow: 1, transition: 'width 0.5s ease' }}>
            <Paper sx={{ height: '100%', p: 2 }}>
              <Typography variant="h6">Assets</Typography>
            </Paper>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexGrow: 4, mb: 2 }}>
          <Box sx={{ ...transitionStyle(showLeftBoxes), mr: showLeftBoxes ? 2 : 0 }}>
            <Paper sx={{ height: '100%', p: 2 }}>
              <Typography variant="h6">Liabilities Bank</Typography>
            </Paper>
          </Box>
          <Box sx={{ flexGrow: 1, transition: 'width 0.5s ease' }}>
            <Paper sx={{ height: '100%', p: 2 }}>
              <Typography variant="h6">Liabilities</Typography>
            </Paper>
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Paper sx={{ height: '100%', p: 2 }}>
            <Typography variant="h6">Net Worth</Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default NetWorthBoard;
