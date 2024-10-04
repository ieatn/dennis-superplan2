import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group } from 'react-konva';
import { AppBar, Toolbar, Button, Modal, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ArrowManager from './ArrowManager';

const EstateBoard = () => {
  const stageWidth = window.innerWidth * 0.9;
  const stageHeight = window.innerHeight * 0.9;
  const baseCircleRadius = Math.min(stageWidth, stageHeight) * 0.08;

  const [circles, setCircles] = useState([
    { id: 1, x: stageWidth * 0.2, y: stageHeight * 0.2, color: 'red', text: 'Family', size: 1 },
    { id: 2, x: stageWidth * 0.5, y: stageHeight * 0.5, color: 'blue', text: 'Business', size: 1.2 },
    { id: 3, x: stageWidth * 0.8, y: stageHeight * 0.8, color: 'green', text: 'Cash', size: 0.8 },
  ]);

  const [arrows, setArrows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromCircle, setFromCircle] = useState('');
  const [toCircle, setToCircle] = useState('');

  const handleDragMove = (e, index) => {
    const newCircles = [...circles];
    newCircles[index] = {
      ...newCircles[index],
      x: e.target.x(),
      y: e.target.y(),
    };
    setCircles(newCircles);

    // Update arrows
    const newArrows = arrows.map(arrow => {
      if (arrow.from.id === newCircles[index].id || arrow.to.id === newCircles[index].id) {
        const fromCircle = arrow.from.id === newCircles[index].id ? newCircles[index] : circles.find(c => c.id === arrow.from.id);
        const toCircle = arrow.to.id === newCircles[index].id ? newCircles[index] : circles.find(c => c.id === arrow.to.id);
        return { ...arrow, from: fromCircle, to: toCircle };
      }
      return arrow;
    });
    setArrows(newArrows);
  };

  const handleAddArrow = () => {
    if (fromCircle && toCircle) {
      const from = circles.find(c => c.id === fromCircle);
      const to = circles.find(c => c.id === toCircle);
      setArrows([...arrows, { from, to }]);
      setIsModalOpen(false);
      setFromCircle('');
      setToCircle('');
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between', backgroundColor: '#3f51b5', borderRadius: '8px', padding: '8px' }}>
          <Button variant="contained" color="primary" size="small" onClick={() => setIsModalOpen(true)} sx={{ borderRadius: '20px', margin: '0 4px' }}>Add Arrow</Button>
          <Button variant="contained" color="secondary" size="small" onClick={() => console.log('Action 1')} sx={{ borderRadius: '20px', margin: '0 4px' }}>Action 1</Button>
          <Button variant="contained" color="success" size="small" onClick={() => console.log('Action 2')} sx={{ borderRadius: '20px', margin: '0 4px' }}>Action 2</Button>
        </Toolbar>
      </AppBar>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            <Rect
              width={stageWidth}
              height={stageHeight}
              fill="#f0f0f0"
              stroke="black"
              strokeWidth={2}
            />
            <ArrowManager arrows={arrows} baseCircleRadius={baseCircleRadius} />
            {circles.map((circle, index) => {
              const radius = baseCircleRadius * circle.size;
              return (
                <Group
                  key={index}
                  x={circle.x}
                  y={circle.y}
                  draggable
                  onDragMove={(e) => handleDragMove(e, index)}
                >
                  <Circle
                    radius={radius}
                    fill={circle.color}
                  />
                  <Text
                    width={radius * 2}
                    text={circle.text}
                    fontSize={radius * 0.4}
                    fill="white"
                    align="center"
                    verticalAlign="middle"
                    offsetX={radius}
                    offsetY={radius * 0.2}
                  />
                </Group>
              );
            })}
          </Layer>
        </Stage>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>From</InputLabel>
            <Select
              value={fromCircle}
              onChange={(e) => setFromCircle(e.target.value)}
            >
              {circles.map((circle) => (
                <MenuItem key={circle.id} value={circle.id}>{circle.text}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>To</InputLabel>
            <Select
              value={toCircle}
              onChange={(e) => setToCircle(e.target.value)}
            >
              {circles.map((circle) => (
                <MenuItem key={circle.id} value={circle.id}>{circle.text}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={handleAddArrow} variant="contained">Add Arrow</Button>
        </Box>
      </Modal>
    </>
  );
};

export default EstateBoard;