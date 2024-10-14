import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Button, Grid } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { getDescendants } from "@minoru/react-dnd-treeview";
import { TreeView } from "./NWB/TreeView";
import axios from "axios";
import { API_URL } from "./config";
import "./App.css";

const NetWorthBoard = () => {
  let { state } = useLocation();
  const { clientId, folder } = state;

  // client data
  const [folders, setFolders] = useState([]);
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState(0);
  const [netWorth, setNetWorth] = useState(0);
  const getAssets = async (folder_id) => {
    try {
      const res = await fetch(`${API_URL}/fetch_assets/${folder_id}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAndExpandFolder = async () => {
    const data = await getAssets(folder.folder_id);
    if (!data) return;

    setAssets(data);

    const startingId = 102;
    const newNodes = data.map((asset, index) => ({
      id: startingId + index,
      parent: asset.liability > 0 ? 300 : 101,
      text: asset.name,
      value: asset.share_price !== null ? asset.share_price : 0,
      liability: asset.liability !== null ? asset.liability : 0,
    }));
    
    let updatedSampleData = [...new Set([...sampleData, ...newNodes])];
    updatedSampleData = [
      { id: 101, parent: 100, droppable: true, text: folder.folder_name, value: 0, liability: 0 },
      ...sampleData.slice(0, 1),
      ...newNodes
    ];
    setTreeData(updatedSampleData);
  };

  useEffect(() => {
    fetchAndExpandFolder();
  }, [folder.folder_id]);


  // tree
  const sampleData = [];
  const [treeData, setTreeData] = useState(sampleData);
  let tree1 = getDescendants(treeData, 100);
  let tree2 = getDescendants(treeData, 200);
  let tree3 = getDescendants(treeData, 300);
  let tree4 = getDescendants(treeData, 400);


  const handleDrop = (newTree, { dragSourceId, dropTargetId }) => {
    setTreeData((prevTreeData) => {
      const updatedTree = prevTreeData.map((node) => {
        if (node.id === dragSourceId) {
          return {
            ...node,
            parent: dropTargetId,
          };
        }
        return node;
      });
      return updatedTree;
    });
  };


  const deleteFolder = (id) => {
    setTreeData((prevTreeData) => prevTreeData.filter((node) => node.id !== id));
  };

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
    transition: 'width 0.2s ease, opacity 0.2s ease',
    overflow: 'hidden',
  });

  return (
    // Main Net Worth Board Box full screen
    <Box sx={{
      // backgroundColor: 'red',
      width: '100vw',
      // Adjust height to account for the navbar
      height: 'calc(100vh - 64px)', 
      // display: 'flex',
      // flexDirection: 'column',
      backgroundColor: '#f0f0f0', // Light gray background
      padding: 3,
    }}>

      {/* Buttons Container */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="contained"
          onClick={toggleLeftBoxes}
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













    
      <Box sx={{ display: 'flex', flexDirection: 'column' }} > 
        
        <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 2 }}>

          <Box className={`nwb-transition-box ${showLeftBoxes ? 'nwb-box' : ''}`} sx={{ 
            opacity: showLeftBoxes ? 1 : 0,
            width: showLeftBoxes ? '50%' : '0%',
            marginRight: showLeftBoxes ? 2 : 0, 
            
          }}>
            <Paper sx={{ padding: 2 }} className="custom-scrollbar">
              <Typography variant="h6">Assets Bank</Typography>
              <TreeView tree={tree1} onDrop={handleDrop} rootId={100} deleteFolder={deleteFolder} />
            </Paper>
          </Box>
          <Box className="nwb-grow-box">
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">Assets</Typography>
              <TreeView tree={tree2} onDrop={handleDrop} rootId={200} deleteFolder={deleteFolder} />
            </Paper>
          </Box>
        </Box>


        <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 2 }}>

          <Box className={`nwb-transition-box ${showLeftBoxes ? 'nwb-box' : ''}`} sx={{ 
            opacity: showLeftBoxes ? 1 : 0,
            width: showLeftBoxes ? '50%' : '0%',
            marginRight: showLeftBoxes ? 2 : 0,
          }}>
            <Paper sx={{ padding: 2 }}  >
              <Typography variant="h6">Liabilities Bank</Typography>
              <TreeView tree={tree3} onDrop={handleDrop} rootId={300} deleteFolder={deleteFolder} />
            </Paper>
          </Box>
          <Box className="nwb-grow-box">
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">Liabilities</Typography>
              <TreeView tree={tree4} onDrop={handleDrop} rootId={400} deleteFolder={deleteFolder} />
            </Paper>
          </Box>
        </Box>

        <Box>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h4">Net Worth</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ color: 'green' }}>Assets: {calculateTotalAssets(assets)}</Typography>
              <Typography variant="h6" sx={{ color: 'red' }}>Liabilities: {calculateTotalLiabilities(assets)}</Typography>
              <Typography variant="h6" sx={{ color: 'green' }}>Net Worth: {calculateNetWorth(assets)}</Typography>
            </Box>
          </Paper>
        </Box>
      </Box> 
      















      
    </Box>
  );
};

// Helper functions to calculate totals
const calculateTotalAssets = (assets) => {
  return assets.reduce((total, asset) => total + (asset.share_price * asset.unit_owned), 0).toFixed(2);
};

const calculateTotalLiabilities = (assets) => {
  return assets.reduce((total, asset) => total + (asset.liability || 0), 0).toFixed(2);
};

const calculateNetWorth = (assets) => {
  const totalAssets = calculateTotalAssets(assets);
  const totalLiabilities = calculateTotalLiabilities(assets);
  return (totalAssets - totalLiabilities).toFixed(2);
};

export default NetWorthBoard;
