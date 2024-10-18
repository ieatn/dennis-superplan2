import React, { useEffect, useState, useRef } from "react";
import { Button, Typography } from "@mui/material";

export default function Chatbot({ clientId }) {
  const [mode, setMode] = useState("database"); // Default mode is database
  const messagesEndRef = useRef(null); // Reference to the end of the messages container
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

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

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Chatbot</h3>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        {["chat", "database"].map((modeType) => (
          <Button
            key={modeType}
            variant={mode === modeType ? "contained" : "outlined"}
            size="small"
            onClick={() => handleModeSwitch(modeType)}
            sx={{ mx: 1, bgcolor: mode === modeType ? "primary.main" : "transparent", color: mode === modeType ? "white" : "#607d8b" }}
          >
            {`${modeType.charAt(0).toUpperCase() + modeType.slice(1)} Mode`}
          </Button>
        ))}
      </div>

      <div style={{ overflowY: 'auto', height: '400px', border: '1px solid #ccc', borderRadius: '4px', padding: '10px', backgroundColor: 'white' }}>
        {chatMessages.map((message, index) => (
          <Typography key={index} variant="body1" style={{ fontSize: "1.1rem", marginBottom: "0.5rem", fontFamily: "sans-serif" }}>
            {message}
          </Typography>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <textarea
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder="Type your message..."
        style={{ width: '100%', marginTop: '10px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        rows={1}
      />
      <Button onClick={() => handleSendMessage()} style={{ marginTop: '10px' }}>Send</Button>

      {mode === "database" && (
        <div style={{ marginTop: '20px' }}>
          {["How many tables are there in the database?", "How many records are in the assets table?", `How many assets are in the folder Q4 2022 with the folder id of ${clientId}?`, `How many assets with the same name are in the folder Q4 2022 with the folder id of ${clientId} that are in the folder Q4 2023 with the folder id of ${clientId}?`, `What assets are different between 2 folders?`].map((text, index) => (
            <div key={index} onClick={() => handlePromptClick(text)} style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', margin: '5px 0', backgroundColor: '#e0e0e0', textAlign: 'center' }}>
              {text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
