import React, { useEffect, useState, useRef } from "react";
import { Button, Typography, Box, TextField, Paper, Drawer } from "@mui/material";

export default function Chatbot({ clientId }) {
  const [mode, setMode] = useState("database"); // Default mode is database
  const messagesEndRef = useRef(null); // Reference to the end of the messages container
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // Scroll to the bottom of the chat messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]); // Depend on chatMessages to trigger scroll when messages change

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent default Enter key action
      handleSendMessage(); // Send message on Enter key press
    }
  };

  const handleSendMessage = async (messageText) => {
    const userMessage = messageText || inputValue;

    if (userMessage.trim()) {
      setChatMessages((prevMessages) => [...prevMessages, `You: ${userMessage}`]);
      if (!messageText) setInputValue("");

      try {
        const res = await fetch("http://localhost:5000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage, mode }),
        });
        const data = await res.json();

        setChatMessages((prevMessages) => [
          ...prevMessages,
          data.response ? `AI: ${data.response}` : "AI: Sorry, something went wrong.",
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        setChatMessages((prevMessages) => [...prevMessages, "AI: Sorry, something went wrong."]);
      }
    }
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setChatMessages((prevMessages) => [
      ...prevMessages,
      `Switched to ${newMode} mode.`,
    ]);
  };

  const handlePromptClick = (text) => {
    handleSendMessage(text); // Directly send the message text
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Paper elevation={3} sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', p: 3, bgcolor: '#f8f9fa', borderRadius: 2, overflow: 'hidden' }}>
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>Chatbot</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          {["chat", "database"].map((modeType) => (
            <Button
              key={modeType}
              variant={mode === modeType ? "contained" : "outlined"}
              size="small"
              onClick={() => handleModeSwitch(modeType)}
              sx={{ mr: 1 }}
            >
              {`${modeType.charAt(0).toUpperCase() + modeType.slice(1)} Mode`}
            </Button>
          ))}
        </Box>
        {mode === "database" && (
          <Button variant="outlined" size="small" onClick={toggleDrawer}>
            Show Prompts
          </Button>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 2, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
        {chatMessages.map((message, index) => (
          <Typography key={index} variant="body1" sx={{ mb: 1, fontFamily: 'sans-serif' }}>
            {message}
          </Typography>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          multiline
          rows={1}
          fullWidth
          variant="outlined"
        />
        <Button variant="contained" onClick={() => handleSendMessage()}>Send</Button>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Database Prompts</Typography>
          {[
            "How many tables are there in the database?",
            "How many records are in the assets table?",
            `How many assets are in the folder Q4 2022 with the folder id of ${clientId}?`,
            `How many assets with the same name are in the folder Q4 2022 with the folder id of ${clientId} that are in the folder Q4 2023 with the folder id of ${clientId}?`,
            `What assets are different between 2 folders?`
          ].map((text, index) => (
            <Button
              key={index}
              onClick={() => {
                handlePromptClick(text);
                toggleDrawer();
              }}
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
            >
              {text}
            </Button>
          ))}
        </Box>
      </Drawer>
    </Paper>
  );
}
