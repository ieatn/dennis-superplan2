import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './App.css'
import { Stepper, Step, StepLabel, Typography, Button, Box, TextField, Checkbox, FormGroup, FormControlLabel, Paper, List, ListItem, ListItemText, Container, Card, CardContent } from '@mui/material';
import { useQuestionnaire } from './QuestionnaireContext';
import axios from "axios";
import { API_URL } from "./config";

export default function Questionnaire() {
  const { state } = useLocation();
  const { clientId } = state;
  const navigate = useNavigate();
  const { questionnaireData, setQuestionnaireData } = useQuestionnaire();
  const [activeStep, setActiveStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const questions = [
    { type: 'text', question: "What are your main concerns?", key: 'question1' },
    { type: 'text', question: "What are your goals?", key: 'question2' },
    { type: 'checkbox', question: "Which of the following do you have in place for your legacy?", key: 'question3', options: ['Wills', 'Insurance', 'Life', 'Property'] },
    { type: 'checkbox', question: "Which personal financial statements do you have?", key: 'question4', options: ['Personal Financial Statements', '401k', 'Brokerage', 'LLC'] },
    { type: 'checkbox', question: "Which advisors or organizations do you work with?", key: 'question5', options: ['Accountants', 'Attorneys', 'Bankers', 'Other Advisors', 'Favorite Charities', 'Key Personnel'] },
    { type: 'checkbox', question: "What documents do you have for your financial review?", key: 'question6', options: ['Personal Income', 'Last 2 Years Tax Return', 'Personal', 'Business'] },
    { type: 'text', question: "Any additional comments?", key: 'question7' },
  ];
  // automatically set clientId into questionnaireData and fetch data
  useEffect(() => {
    // Set clientId into questionnaireData immediately
    setQuestionnaireData(prevData => ({ ...prevData, clientId }));
    fetchData(clientId);
  }, [clientId, setQuestionnaireData]);





  


  


  


  


  






  const fetchData = async (clientId) => {
    try {
      const response = await axios.get(`${API_URL}/get_results?client_id=${clientId}`);
      const data = response.data[0];
      
      // Process and set the fetched data
      const questionMappings = [
        { key: 'question1', defaultValue: [] },
        { key: 'question2', defaultValue: [] },
        { key: 'question3', defaultValue: [] },
        { key: 'question4', defaultValue: [] },
        { key: 'question5', defaultValue: [] },
        { key: 'question6', defaultValue: [] },
        { key: 'question7', defaultValue: [] },
      ];
      let newData = { ...data };
      questionMappings.forEach(({ key, defaultValue }) => {
        const value = data[key];
        if (value) {
          try {
            const parsedValue = JSON.parse(value);
            newData = { ...newData, [key]: parsedValue };
          } catch (e) {
            console.error(`Error parsing data for ${key}:`, e);
            newData = { ...newData, [key]: defaultValue };
          }
        } else {
          newData = { ...newData, [key]: defaultValue };
        }
      });

      setQuestionnaireData(prevData => ({ ...prevData, ...newData }));

      // Check if all questions have been answered
      const allAnswered = questions.every(q => newData[q.key] && newData[q.key].length > 0);
      if (allAnswered) {
        setIsComplete(true);
        setActiveStep(questions.length - 1); // Set to the last step if all are answered
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  


  


  


  


  

  


  


  


  


  

  


  


  


  


  
  const handleNext = () => {
    if (activeStep === questions.length - 1) {
      setIsComplete(true);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (isComplete) {
      setIsComplete(false);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if clientId is valid before submission
    if (!clientId) {
        console.error('clientId is required');
        return; // Prevent submission if clientId is not available
    }

    const submissionData = {
        clientId, // Ensure clientId is included
        questionnaireData
    };

    try {
        const response = await axios.post(`${API_URL}/submit_questionnaire`, submissionData);
        // Navigate back to the client route
        navigate(`/clients/${clientId}`);
    } catch (error) {
        console.error('Error submitting questionnaire:', error);
        // Show an error message to the user
    }
  };

  const handleAnswer = (answer) => {
    setQuestionnaireData(prevData => ({
      ...prevData,
      [questions[activeStep].key]: answer
    }));
  };

  const renderQuestion = () => {
    const currentQuestion = questions[activeStep];
    switch (currentQuestion.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            variant="outlined"
            label={currentQuestion.question}
            value={questionnaireData[currentQuestion.key] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            margin="normal"
          />
        );
      case 'checkbox':
        return (
          <FormGroup>
            {currentQuestion.options.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={questionnaireData[currentQuestion.key]?.includes(option) || false}
                    onChange={(e) => {
                      const newAnswer = e.target.checked
                        ? [...(questionnaireData[currentQuestion.key] || []), option]
                        : (questionnaireData[currentQuestion.key] || []).filter(item => item !== option);
                      handleAnswer(newAnswer);
                    }}
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
        );
      default:
        return null;
    }
  };

  const handleDelete = async () => {
    try {
        const response = await axios.delete(`${API_URL}/delete_data?client_id=${clientId}`);
        
        // Clear the form by resetting questionnaireData
        setQuestionnaireData({
            clientId: clientId, // Retain clientId if needed
            question1: [],
            question2: [],
            question3: [],
            question4: [],
            question5: [],
            question6: [],
            question7: ''
        });

        // Reset active step to 0 (first step)
        setActiveStep(0);
        
        // Reset completion state
        setIsComplete(false); // Ensure summary box does not show up
        
    } catch (error) {
        console.error('Error deleting data:', error);
    }
  };

  const renderSummary = () => (
    <Paper elevation={3} sx={{ p: 3, mt: 2, maxHeight: '600px', overflowY: 'auto' }}>
      <Typography variant="h6" gutterBottom>Summary</Typography>
      <List>
        {questions.map((q) => (
          <ListItem key={q.key}>
            <ListItemText
              primary={q.question}
              secondary={
                Array.isArray(questionnaireData[q.key])
                  ? questionnaireData[q.key].join(', ')
                  : questionnaireData[q.key]
              }
            />
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" color="secondary" onClick={handleDelete}>
        Delete
      </Button>
    </Paper>
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ width: '100%', mt: 4, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {questions.map((q, index) => (
            <Step key={q.key}>
              <StepLabel>{`Question ${index + 1}`}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Card variant="outlined" sx={{ mt: 4, mb: 4 }}>
          <CardContent>
            {isComplete ? (
              renderSummary()
            ) : (
              <>
                <Typography variant="h5" gutterBottom>
                  {questions[activeStep].question}
                </Typography>
                {renderQuestion()}
              </>
            )}
          </CardContent>
        </Card>
        <Box sx={{ position: 'fixed', bottom: 60, left: '50%', transform: 'translateX(-50%)', display: 'flex', justifyContent: 'space-between', width: '40%', height: '36px' }}>
          <Button
            variant="outlined"
            color="primary"
            disabled={activeStep === 0 && !isComplete}
            onClick={handleBack}
          >
            Back
          </Button>
          {isComplete ? (
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Submit
            </Button>
          ) : (
            <Button onClick={handleNext} variant="contained" color="primary">
              {activeStep === questions.length - 1 ? 'Review' : 'Next'}
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}
