import './App.css'
import React, { useEffect, useState } from "react";
import axios from 'axios';
import Button from '@mui/material/Button';
import { Link, useLocation } from "react-router-dom";
import { API_URL } from "./config";
import Card from "./Card";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

export default function CardGameBoard() {
  let { state } = useLocation();
  const { clientId } = state;

  const [boards, setBoards] = useState({
    board1: [
      { id: 1, frontText: "card 1", backText: "People accumulate their wealth in many ways. What is the source of your wealth? Check all that apply." },
      { id: 2, frontText: "card 2", backText: "To what or whom do you attribute your wealth? Check all that apply." },
      { id: 3, frontText: "card 3", backText: "What personal values are of the greatest importance to you at this time in your life? Check the 5 most important to you." },
      { id: 4, frontText: "card 4", backText: "To whom do you feel a sense of obligation when it comes to the distribution of your wealth? Check all that apply." },
      { id: 5, frontText: "card 5", backText: "There are many goals for financial and estate planning, among them the following. Rank all four goals in order of importance to you." },
      { id: 6, frontText: "card 6", backText: "If your estate were distributed to your beneficiaries (excluding your spouse, if applicable), give your best estimate of how it would be allocated among the following, if you did no additional planning and your estate were settled as it exists today. Please put percentages, in order, of the following categories:" },
      { id: 7, frontText: "card 7", backText: "If you could allocate your estate to beneficiaries at your death any way you wanted among the following choices, (excluding your spouse, if applicable), what would your ideal allocation look like? Please put percentages, in order, of the following categories:" },
      { id: 8, frontText: "card 8", backText: "How likely are the following to influence you in the creation or revision of your current plan? Rank all 5 influences in order of importance to you:" },
      { id: 9, frontText: "card 9", backText: "Which statement most closely reflects your definition of financial independence?" },
      { id: 10, frontText: "card 10", backText: "Money sometimes creates special opportunities. Which of the following opportunities of affluence or wealth are important to you? Check all that apply." },
      { id: 11, frontText: "card 11a", backText: "In order to ensure lifetime financial independence for you (and your spouse, if applicable), please indicate your best estimate of the annual after-tax income assets you will need, expressed in today's dollars:" },
      { id: 12, frontText: "card 12a", backText: "If your present income is more than sufficient to maintain lifetime financial independence for you (and your spouse, if applicable), even in the face of potential future inflation, health expenses, economic downturns or other unknowns, indicate what amount of excess income you currently possess. Estimate to the best of your ability." },
      { id: 13, frontText: "card 12b", backText: "If your present assets are more than sufficient to maintain lifetime financial independence for you (and your spouse, if applicable), even in the face of potential future inflation, health expenses, economic downturns or other unknowns, indicate what amount of excess assets you currently possess. Estimate to the best of your ability." },
      { id: 14, frontText: "card 13", backText: "Which statement most closely reflects your thoughts regarding your willingness to give up ownership or control of assets?" },
      { id: 15, frontText: "card 14", backText: "Which statement most closely reflects your view regarding your responsibility to conserve assets for heirs?" },
      { id: 16, frontText: "card 15", backText: "If there were no limit to the amount of wealth you could leave your heirs other than spouse, what is the sum total dollar amount you would leave to them?" },
      { id: 17, frontText: "card 16", backText: "Check any of the following philosophies of financial stewardship that you wish to impart to your children and other heirs" },
      { id: 18, frontText: "card 17", backText: "There are various perspectives regarding whether to discuss family financial resources with children or other heirs. Check the statement that most closely reflects your views." },
      { id: 19, frontText: "card 18", backText: "Regarding their specific potential inheritance, when is the best time to reveal your estate plan to children or other heirs? Check the statement that most closely reflects your view." },
      { id: 20, frontText: "card 17/18b", backText: "If you answered either of the above questions that children or other heirs should be informed of the family's financial situation or their inheritance at a certain age, what would that age be?" },
      { id: 21, frontText: "card 19", backText: "Do you believe your children currently possess the necessary skills to manage wealth?" },
      { id: 22, frontText: "card 20", backText: "How much inheritance should you leave your children?" },
      { id: 23, frontText: "card 21", backText: "Should each child be left the same amount of inheritance?" },
      { id: 24, frontText: "card 22", backText: "What do you think about transferring assets to children and/or other heirs during your lifetime?" },
      { id: 25, frontText: "card 23", backText: "What do you think about transferring assets to grandchildren?" },
      { id: 26, frontText: "card 24", backText: "There are numerous ways to transfer your family financial values to children and other heirs. Check the three that are most important to you." },
      { id: 27, frontText: "card 25", backText: "How does the transfer of family assets to children also affect the wealth you seek to preserve? Check all that apply." },
      { id: 28, frontText: "card 26", backText: "Taking into account all of the taxes you have paid over your lifetime (income, property, etc.), if you were required to give estate assets away, and your only choices were government and charitable purposes, what percent would you allocate to each?" },
      { id: 29, frontText: "card 27", backText: "Which statement most closely reflects your thoughts regarding the transfer of charitable gifts through your estate plan?" },
      { id: 30, frontText: "card 28a", backText: "How much involvement have you had with charitable organizations, including volunteerism and monetary donations?" },
      { id: 31, frontText: "card 28b", backText: "If you answered 'little or no charitable involvement', choose one statement that best reflects your feelings" },
      { id: 32, frontText: "card 28c", backText: "If you answered 'moderate involvement', choose one statement that best reflects your future plans" },
      { id: 33, frontText: "card 28d", backText: "If you answered 'I have been active with charitable organizations', choose one statement that best reflects your future plans" },
      { id: 34, frontText: "card 29", backText: "What do you think about transferring assets for charitable purposes during your lifetime?" },
      { id: 35, frontText: "card 30", backText: "On a scale of 1 to 5, how satisfied are you with the current effectiveness of your charitable gifts of time and money in improving the well-being of others?" },
      { id: 36, frontText: "card 31a", backText: "Which statement most closely reflects your view regarding the level of charitable contributions you make?" },
      { id: 37, frontText: "card 31b", backText: "If you answered 'I am likely to increase my current level of charitable contributions if certain conditions occur' in 31a, please check the all following conditions that would lead to a likely increase" },
      { id: 38, frontText: "card 32", backText: "Some families establish personal or family foundations through which they channel their charitable contributions. Which statement most closely reflects your view?" },
      { id: 39, frontText: "card 33", backText: "Which of the following statements reflect your view regarding the process of family or 'shared' philanthropy? Check all that apply." },
      { id: 40, frontText: "card 34", backText: "A variety of charitable purposes could benefit from your contributions. Rank from 1 to 4 the areas that are of greatest interest to you." },
      { id: 41, frontText: "card 35", backText: "What is your preference regarding recognition for philanthropic contributions? Check all that apply." },
      { id: 42, frontText: "card 36", backText: "If you were given $1,000,000 and were required to give it to charity, what charitable organizations or causes would you support, and at what dollar amount?" }
        
    ],
    board2: [],
    board3: [],
    board4: [],
    board5: [],
    board6: [],
    board7: [],
    board8: [],

  });


  const [draggingCard, setDraggingCard] = useState(null);
  const [sourceBoard, setSourceBoard] = useState(null);
  

  const handleDragStart = (card, boardName) => {
    setDraggingCard(card);
    setSourceBoard(boardName);
  };

  const handleDrop = (targetBoard) => {
    setBoards((prevBoards) => {
      // Check if the target board exists, if not, initialize it as an empty array
      if (!prevBoards[targetBoard]) {
        prevBoards[targetBoard] = [];
      }
  
      // If the dragged card or source board is not set, return the previous state
      if (!draggingCard || !sourceBoard) return prevBoards;
  
      // Create a new state by cloning the previous state
      const newBoards = { ...prevBoards };
  
      // Remove the dragged card from the source board
      newBoards[sourceBoard] = newBoards[sourceBoard].filter(
        (card) => card.id !== draggingCard.id
      );
  
      // Add the dragged card to the target board
      newBoards[targetBoard] = [...newBoards[targetBoard], draggingCard];
  
      // Clear the dragged card and source board state
      setDraggingCard(null);
      setSourceBoard(null);
  
      return newBoards;
    });
  };
  

  const handleDragOver = (e) => {
    e.preventDefault();
  };


  const getCards = () => {
    axios.get(`${API_URL}/get_cards?client_id=${clientId}`)
      .then(response => {
        const data = response.data;
        if (data.length === 0) {
          console.log('No cards found.');
          return;
        }
  
        const newBoards = {};
        
        data.forEach(card => {
          if (!newBoards[card.board_id]) {
            newBoards[card.board_id] = [];
          }
          newBoards[card.board_id].push({
            id: card.card_id,
            frontText: card.card_description.split(' - ')[0],
            backText: card.card_description.split(' - ')[1]
          });
        });
  
        setBoards(newBoards);
      })
      .catch(error => {
        console.error('There was an error fetching the cards!', error);
      });
  };

  useEffect(() => {
    getCards();
  }, []);
  

  const saveCards = () => {
    // Check if cards for this client already exist
    axios.get(`${API_URL}/get_cards?client_id=${clientId}`)
      .then(response => {
        if (response.data.length > 0) {
          // If cards exist, update instead of saving
          updateCards();
        } else {
          // If no cards exist, proceed with saving
          const data = {
            client_id: clientId,
            boards
          };
          axios.post(`${API_URL}/save_cards`, data)
            .then(response => {
              console.log(response.data);
            })
            .catch(error => {
              console.error('There was an error saving the cards!', error);
              alert('Failed to save cards.');
            });
        }
      })
      .catch(error => {
        console.error('Error checking for existing cards:', error);
        alert('Failed to check existing cards.');
      });
  };
  

  const deleteCards = () => {
    axios.delete(`${API_URL}/delete_cards?client_id=${clientId}`)
      .then(response => {
        console.log(response.data);
        // Reset the boards to their original state
        setBoards({
          board1: [
            { id: 1, frontText: "card 1", backText: "People accumulate their wealth in many ways. What is the source of your wealth? Check all that apply." },
            { id: 2, frontText: "card 2", backText: "People accumulate their wealth in many ways. What is the source of your wealth? Check all that apply." },
            { id: 3, frontText: "card 3", backText: "People accumulate their wealth in many ways. What is the source of your wealth? Check all that apply." },
          ],
          board2: [],
          board3: [],
          board4: [],
          board5: [],
          board6: [],
          board7: [],
          board8: [],
        });
      })
      .catch(error => {
        console.error('There was an error deleting the cards!', error);
        alert('Failed to delete cards.');
      });
  };

  const updateCards = () => {
    const data = {
      client_id: clientId,
      boards
    };
  
    axios.put(`${API_URL}/update_cards`, data)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error updating the cards!', error);
        alert('Failed to update cards.');
      });
  };



  const renderBoard = (boardName, bgColor) => {
    return (
      <div
        onDrop={() => handleDrop(boardName)}
        onDragOver={handleDragOver}
        style={{
          width: '220px',
          height: '320px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bgColor,
          position: 'relative',
          border: '1px solid #ccc',
          borderRadius: '10px',
        }}
      >
        <h3 style={{ marginBottom: '10px', position: 'absolute', top: '5px' }}>{boardName}</h3>
        {boards[boardName] && boards[boardName].length > 0 ? (
          <>
            {boards[boardName].slice(0, 5).map((card, index) => (
              <div
                key={card.id}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translate(${index * 2}px, ${index * 2}px)`,
                  zIndex: index,
                }}
              >
                <Card
                  frontText={card.frontText}
                  backText={card.backText}
                  onDragStart={() => handleDragStart(card, boardName)}
                />
              </div>
            ))}
            <Button
              variant="contained"
              size="small"
              onClick={() => handleOpenModal(boardName)}
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              View All {boards[boardName].length}
            </Button>
          </>
        ) : (
          <p>Drop cards here</p>
        )}
      </div>
    );
  };

  const [openModal, setOpenModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);








  
  const handleOpenModal = (boardName) => {
    setSelectedBoard(boardName);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBoard(null);
  };









  const renderModal = () => {
    if (!selectedBoard) return null;

    return (
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '1px solid #000',
          borderRadius: '10px',
          boxShadow: 24,
          p: 4,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}>
          <h2 id="modal-title" style={{ textAlign: 'center', color: '#3f51b5', marginBottom: '20px' }}>{selectedBoard} Cards</h2>
          <div id="modal-description" style={{ padding: '10px', maxHeight: '60vh', overflowY: 'auto' }}>
            {boards[selectedBoard] && boards[selectedBoard].map((card, index) => (
              <div key={card.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#1976d2' }}>Card {index + 1}</h3>
                <p style={{ margin: '5px 0' }}><strong>Front:</strong> {card.frontText}</p>
                <p style={{ margin: '5px 0' }}><strong>Back:</strong> {card.backText}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleCloseModal}>Close</Button>
          </div>
        </Box>
      </Modal>
    );
  };




  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Link to={`/clients/${clientId}`}>
          <Button variant="contained" color="primary">
            Back
          </Button>
        </Link>
        <div>
          <Button variant="contained" color="primary" onClick={saveCards} style={{ marginRight: '10px' }}>
            Save Cards
          </Button>
          <Button variant="contained" color="secondary" onClick={deleteCards}>
            Reset
          </Button>
        </div>
      </div>
      
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Card Game Board</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5rem' }}>
          {renderBoard('board1', '#BBDEFB')} {/* Light Blue */}
          {renderBoard('board2', '#C8E6C9')} {/* Light Green */}
          {renderBoard('board3', '#FFCDD2')} {/* Light Red */}
          {renderBoard('board4', '#FFF9C4')} {/* Light Yellow */}
          {renderBoard('board5', '#E1BEE7')} {/* Light Purple */}
          {renderBoard('board6', '#FFE0B2')} {/* Light Orange */}
        </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {renderBoard('board7', '#F8BBD0')} {/* Light Pink */}
            {renderBoard('board8', '#F5F5F5')} {/* Light Gray */}
          </div>
      </div>

      {renderModal()}
    </div>
  );
}
