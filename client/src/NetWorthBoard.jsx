import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Select, MenuItem, Paper, Typography } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import { getDescendants } from "@minoru/react-dnd-treeview";
import { TreeView } from "./NWB/TreeView";
import axios from "axios";
import { API_URL } from "./config";
import "./App.css";
import ReplayIcon from '@mui/icons-material/Replay';

const NetWorthBoard = () => {
  let { state } = useLocation();
  const { clientId, folder } = state;

  // tree
  const sampleData = [];
  const [treeData, setTreeData] = useState(sampleData);
  let tree1 = getDescendants(treeData, 100);
  let tree2 = getDescendants(treeData, 200);
  let tree3 = getDescendants(treeData, 300);
  let tree4 = getDescendants(treeData, 400);

  // api
  const [folders, setFolders] = useState([]);
  const [assetValues, setAssetValues] = useState(0);
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState(0);
  const [netWorth, setNetWorth] = useState(0);

  // modal and scenarios
  const [openModal, setOpenModal] = useState(false);
  // update flag to keep track of if we are updating or creating a scenario
  const [isUpdating, setIsUpdating] = useState(false);
   // store the entire array of scenarios from database
   const [scenarios, setScenarios] = useState([]);
   // just name and id of scenario from database
   const [scenarioName, setScenarioName] = useState('');
   const [scenarioId, setScenarioId] = useState(0);
   const [selectedScenario, setSelectedScenario] = useState(null);

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

  // create folder
  const createFolder = (folderName) => {
    const newFolder = {
      id: Math.max(...treeData.map(node => node.id), 0) + 1, // Generate a unique ID for the new folder
      parent: 100, 
      text: folderName,
      value: 0,
      liability: 0,
      droppable: true, 
    };
    
    setTreeData((prevTreeData) => [...prevTreeData, newFolder]); 
  };
  

  // client data

  const getAssets = async (folder_id) => {
    try {
      const res = await fetch(`${API_URL}/fetch_assets/${folder_id}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const calculateValuesAndLiabilities = () => {
    const calculateTotal = (parentId) => {
      return treeData
        .filter((node) => node.parent === parentId)
        .reduce((accumulator, node) => {
          if (node.droppable) {
            return accumulator + calculateTotal(node.id);
          }
          return accumulator + (parentId === 400 ? node.liability : node.value);
        }, 0);
    };

    const totalValue = calculateTotal(200);
    const totalLiability = calculateTotal(400);

    setAssetValues(formatLargeNumber(totalValue));
    setLiabilities(formatLargeNumber(totalLiability));
    setNetWorth(formatLargeNumber(totalValue - totalLiability));
  };

  const formatLargeNumber = (value) => {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(() => {
    calculateValuesAndLiabilities();
  }, [treeData]);

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

  // scenarios
  const handleScenarioChange = (event) => {
    const selected = event.target.value;
    setSelectedScenario(selected);
    setScenarioId(selected.scenario_id);
    setScenarioName(selected.scenario_name);
    setIsUpdating(true);
    if (selected.tree_data) {
      setTreeData(JSON.parse(selected.tree_data));
    }
  };
  useEffect(() => {
    console.log(selectedScenario);
  }, [selectedScenario]);


  // MODALS
  // select modal for name text
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // SCENARIOS
  const saveScenario = () => {
    if (scenarioName.trim() === '') {
      alert('Please enter a scenario name');
      return;
    }
    createScenario(scenarioId);
    handleCloseModal();
  };

  const deleteScenario = async () => {
    if (!selectedScenario) {
      alert('Please select a scenario to delete');
      return;
    }
    try {
      await axios.delete(`${API_URL}/delete_scenario`, { params: { scenario_id: selectedScenario.scenario_id } });
      console.log('Scenario deleted successfully');
      setScenarios(prevScenarios => prevScenarios.filter(s => s.scenario_id !== selectedScenario.scenario_id));
      setSelectedScenario(null);
      setScenarioId(0);
      setScenarioName('');
      setIsUpdating(false);
      fetchAndExpandFolder();
    } catch (error) {
      console.error('Error deleting scenario:', error);
    }
  };

  const fetchAllScenarios = async () => {
    try {
      const res = await axios.get(`${API_URL}/get_scenarios`);
      if (res.data.length === 0) {
        fetchAndExpandFolder();
      } else {
        setScenarios(res.data);
      }
    } catch (error) {
      console.error("Error fetching scenarios:", error);
    }
  };
  useEffect(() => {
    fetchAllScenarios();
  }, []);
  const fetchScenario = async (id) => {
    const res = await axios.get(`${API_URL}/get_one_scenario`, { params: { scenario_id: id } });
    setTreeData(JSON.parse(res.data[0].tree_data));
  };
  const createScenario = async (id) => {
    const newId = id === 0 ? Math.floor(Math.random() * 10000) : id;
    const scenarioData = {
      client_id: clientId,
      scenario_id: newId,
      tree_data: treeData,
      scenario_name: scenarioName
    };
    try {
      const res = await axios.post(`${API_URL}/create_scenario`, scenarioData);
      if (res.status === 201) {
        console.log('Scenario created successfully');
        await fetchAllScenarios();
        setScenarioId(newId);
        setSelectedScenario(scenarios.find(s => s.scenario_id === newId));
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log('Scenario ID already exists, updating scenario...');
        await updateScenario(newId);
        await fetchAllScenarios();
      } else {
        console.error('Error creating scenario:', error);
      }
    }
  };
  const updateScenario = async (id) => {
    const scenarioData = {
      client_id: clientId,
      scenario_id: id,
      tree_data: treeData,
      scenario_name: scenarioName
    };
    const res = await axios.put(`${API_URL}/update_scenario`, scenarioData);
    if (res.status === 201) {
      console.log('Scenario updated successfully');
    }
  }

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

  const resetTrees = () => {
    fetchAndExpandFolder();
    setSelectedScenario(null);
    setScenarioId(0);
    setScenarioName('');
    setIsUpdating(false);
  };

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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={toggleLeftBoxes}
          >
            {showLeftBoxes ? 'Hide Left Boxes' : 'Show Left Boxes'}
          </Button>
          <Button onClick={() => createFolder("New Folder")}>Add Folder</Button>
          <Button 
            variant="outlined" 
            startIcon={<ReplayIcon />} 
            onClick={resetTrees}
          >
            Reset
          </Button>
        </Box>




        {/* SCENARIO SELECT */}
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <Select
            value={selectedScenario || ''}
            onChange={(e) => handleScenarioChange(e)}
            sx={{ minWidth: 160, height: 40 }}
            displayEmpty
          >
            <MenuItem value="" disabled>Select Scenario</MenuItem>
            {scenarios.map((scenario) => (
              <MenuItem key={scenario.scenario_id} value={scenario}>
                {scenario.scenario_name}
              </MenuItem>
            ))}
          </Select>
          <Button variant="contained" color="primary" sx={{ height: 40 }} onClick={handleOpenModal}>
            Save
          </Button>
          <Button variant="contained" color="error" sx={{ height: 40 }} onClick={deleteScenario}>Delete</Button>
        </Box>



        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>{isUpdating ? 'Update Scenario' : 'Save Scenario'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the scenario name to {isUpdating ? 'update' : 'save'}.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Scenario Name"
              type="text"
              fullWidth
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
            <Button onClick={saveScenario} color="primary">
              {isUpdating ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>


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
              <TreeView tree={tree1} onDrop={handleDrop} rootId={100} deleteFolder={deleteFolder} treeData={treeData} />
            </Paper>
          </Box>
          <Box className="nwb-grow-box">
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">Assets</Typography>
              <TreeView 
                tree={tree2} 
                onDrop={handleDrop} 
                rootId={200} 
                deleteFolder={deleteFolder} 
                treeData={treeData}
              />
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
              <TreeView tree={tree3} onDrop={handleDrop} rootId={300} deleteFolder={deleteFolder} treeData={treeData} />
            </Paper>
          </Box>
          <Box className="nwb-grow-box">
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">Liabilities</Typography>
              <TreeView tree={tree4} onDrop={handleDrop} rootId={400} deleteFolder={deleteFolder} treeData={treeData} />
            </Paper>
          </Box>
        </Box>

        <Box>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h4">Net Worth</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ color: 'green' }}>Assets: {assetValues}</Typography>
              <Typography variant="h6" sx={{ color: 'red' }}>Liabilities: {liabilities}</Typography>
              <Typography variant="h6" sx={{ color: parseInt(netWorth) > 0 ? 'green' : 'red' }}>Net Worth: {netWorth}</Typography>
            </Box>
          </Paper>
        </Box>
      </Box> 
      
      
    </Box>
  );
};

export default NetWorthBoard;
