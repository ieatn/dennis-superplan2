import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Box, Container, Typography, Paper, Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, List, ListItem, Checkbox, ListItemText } from '@mui/material';
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
  
  // folder differences
  const [open, setOpen] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [folderDifferences, setFolderDifferences] = useState({
    added: [],
    removed: [],
  });
  const [showDifferences, setShowDifferences] = useState(false); // State for showing differences


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

    fetchFolders(id);
  }, [id]);

  const getAssets = async (folder_id) => {
    try {
      const res = await fetch(`${API_URL}/fetch_assets/${folder_id}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCompareFolders = async () => {
    if (selectedFolders.length === 2) {
      const selectedNames = selectedFolders
        .map((f) => f.folder_name)
        .join(" and ");
      const result = await compareFolders(); // Await the result of compareFolders
      if (result) {
        // Ensure result is not null
        const { folderIds, differenceMessages } = result;
        setChatMessages((prevMessages) => [
          ...prevMessages,
          `Selected folders: ${selectedNames} (IDs: ${folderIds.join(", ")})`,
          ...differenceMessages, // Add the differences as messages
        ]);
        setShowDifferences(true); // Show the differences section
      }
    } else {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        "Please select exactly two folders.",
      ]);
    }
    setOpen(false);
    setSelectedFolders([]);
  };


  const handleCheckFolders = () => {
    setOpen(true);
  };

  const handleSelectFolder = (folder) => {
    setSelectedFolders((prevState) => {
      const isSelected = prevState.some(
        (selected) => selected.folder_id === folder.folder_id
      );
      if (isSelected) {
        return prevState.filter(
          (selected) => selected.folder_id !== folder.folder_id
        );
      } else {
        return [...prevState, folder];
      }
    });
  };

  const compareFolders = async () => {
    if (selectedFolders.length === 2) {
      const [folder1, folder2] = selectedFolders;

      // Fetch assets for each selected folder
      const assets1 = await getAssets(folder1.folder_id);
      const assets2 = await getAssets(folder2.folder_id);

      // Create a map to quickly lookup assets by name
      const assetsMap1 = new Map(assets1.map((asset) => [asset.name, asset]));
      const assetsMap2 = new Map(assets2.map((asset) => [asset.name, asset]));

      // Prepare messages for differences
      let differenceMessages = [];

      assetsMap1.forEach((asset1, name) => {
        const asset2 = assetsMap2.get(name);
        if (asset2) {
          // Compare cusip property if names match
          if (asset1.cusip !== asset2.cusip) {
            differenceMessages.push(
              `Asset name "${name}" has different CUSIP values:`
            );
            differenceMessages.push(
              `  - Folder ${folder1.folder_name} CUSIP: ${asset1.cusip}`
            );
            differenceMessages.push(
              `  - Folder ${folder2.folder_name} CUSIP: ${asset2.cusip}`
            );
          }

          // Compare asset_type_id property if names match
          if (asset1.asset_type_id !== asset2.asset_type_id) {
            differenceMessages.push(
              `Asset name "${name}" has different asset_type_id values:`
            );
            differenceMessages.push(
              `  - Folder ${folder1.folder_name} asset_type_id: ${asset1.asset_type_id}`
            );
            differenceMessages.push(
              `  - Folder ${folder2.folder_name} asset_type_id: ${asset2.asset_type_id}`
            );
          }

          // Compare symbol property if names match
          if (asset1.symbol !== asset2.symbol) {
            differenceMessages.push(
              `Asset name "${name}" has different symbol values:`
            );
            differenceMessages.push(
              `  - Folder ${folder1.folder_name} symbol: ${asset1.symbol}`
            );
            differenceMessages.push(
              `  - Folder ${folder2.folder_name} symbol: ${asset2.symbol}`
            );
          }
        }
      });

      // Assets added to folder2 (i.e., present in folder2 but not in folder1)
      const addedAssets = [...assetsMap2.keys()].filter(
        (name) => !assetsMap1.has(name)
      );
    
      // Assets removed from folder2 (i.e., present in folder1 but not in folder2)
      const removedAssets = [...assetsMap1.keys()].filter(
        (name) => !assetsMap2.has(name)
      );

      // Update folder differences state
      setFolderDifferences({
        added: addedAssets,
        removed: removedAssets,
      });

      // Prepare folder IDs array
      const folderIds = [folder1.folder_id, folder2.folder_id];

      // Log folder IDs
      console.log(`Folder IDs: ${folderIds.join(", ")}`);

      return { folderIds, differenceMessages };
    } else {
      console.log("Please select exactly two folders.");
      return null;
    }
  };




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


      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCheckFolders}
          >
            Compare Folders
          </Button>
        </div>
      </div>

      {/* Modal for folder selection */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Select Folders</DialogTitle>
        <DialogContent>
          <List>
            {folders.map((folder) => (
              <ListItem
                button
                key={folder.folder_id}
                onClick={() => handleSelectFolder(folder)}
              >
                <Checkbox
                  edge="start"
                  checked={selectedFolders.some(
                    (selected) => selected.folder_id === folder.folder_id
                  )}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText primary={folder.folder_name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCompareFolders} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <>
        {showDifferences && (
          <div style={{ marginTop: '10px' }}>
            <h6 style={{ fontSize: '20px', margin: '5px 0', textAlign: 'center' }}>
              Folder Differences
            </h6>
            <Box 
              sx={{ 
                display: 'flex', 
                maxWidth: '800px', 
                margin: 'auto', 
                justifyContent: 'space-between', 
                marginBottom: '10px', 
                padding: 2, 
                border: '1px solid #ccc', 
                borderRadius: '8px', 
                backgroundColor: '#f9f9f9', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' 
              }}
            >
              <div>
                {folderDifferences.added && folderDifferences.added.length > 0 && (
                  <>
                    <h6 style={{ fontSize: '18px', margin: '5px 0', color: 'green' }}>
                      Added:
                    </h6>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                      {folderDifferences.added.map((item, index) => (
                        <li key={index} style={{ margin: '3px 0', color: 'green' }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <div>
                {folderDifferences.removed && folderDifferences.removed.length > 0 && (
                  <>
                    <h6 style={{ fontSize: '18px', margin: '5px 0', color: 'red' }}>
                      Removed:
                    </h6>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                      {folderDifferences.removed.map((item, index) => (
                        <li key={index} style={{ margin: '3px 0', color: 'red' }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </Box>
            <Button
              onClick={() => setShowDifferences(false)}
              variant="contained"
              color="error"
              style={{ marginTop: '10px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
            >
              Close
            </Button>
          </div>
        )}
      </>














      <Typography variant="h4" component="h2" gutterBottom>
        Client Details
      </Typography>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <div style={{ marginBottom: '24px' }}>
          <Typography variant="h6">Client ID: {id}</Typography>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <Typography variant="h6">Name: {name || 'Unknown'}</Typography>
        </div>
        <div>
          <Link to={`/card-game-board`} state={{ clientId: id }} style={{ marginRight: '20px' }}>
            <Button variant="contained" color="primary">
              Card Game
            </Button>
          </Link>
          <Link to={`/questionnaire`} state={{ clientId: id }}>
            <Button variant="contained" color="primary">
              Questionnaire
            </Button>
          </Link>
        </div>
      </Paper>



























      {/* chatbot button */}
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
