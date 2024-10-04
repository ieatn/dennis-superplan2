import React, { useState, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group } from 'react-konva';
import { AppBar, Toolbar, Button, Modal, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ArrowManager from './ArrowManager';
import GridLines from './GridLines';

const EstateBoard = () => {
  const GUIDE_LINE_OFFSET = 5;
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
  const [gridGuides, setGridGuides] = useState([]);

  const stageRef = React.useRef(null);

  const SNAP_THRESHOLD = 20; // Adjust this value to control when snapping starts
  const SNAP_STRENGTH = 3; // Adjust this value between 0 and 1 to control snapping strength

  const getStops = (draggedCircleId) => {
    const stage = stageRef.current;
    const vertical = [0, stage.width() / 2, stage.width()];
    const horizontal = [0, stage.height() / 2, stage.height()];

    circles.forEach((circle) => {
      if (circle.id !== draggedCircleId) {
        const radius = baseCircleRadius * circle.size;
        vertical.push(circle.x, circle.x + radius, circle.x - radius);
        horizontal.push(circle.y, circle.y + radius, circle.y - radius);
      }
    });

    return {
      vertical: [...new Set(vertical)].sort((a, b) => a - b),
      horizontal: [...new Set(horizontal)].sort((a, b) => a - b),
    };
  };

  const getBounds = (circle) => {
    const radius = baseCircleRadius * circle.size;
    return {
      vertical: [
        { guide: circle.x - radius, snap: 'start', offset: -radius },
        { guide: circle.x, snap: 'center', offset: 0 },
        { guide: circle.x + radius, snap: 'end', offset: radius },
      ],
      horizontal: [
        { guide: circle.y - radius, snap: 'start', offset: -radius },
        { guide: circle.y, snap: 'center', offset: 0 },
        { guide: circle.y + radius, snap: 'end', offset: radius },
      ],
    };
  };

  const getGuides = (stops, bounds) => {
    const resultV = [];
    const resultH = [];
    stops.horizontal.forEach((lg) => {
      bounds.horizontal.forEach((bound) => {
        const diff = Math.abs(lg - bound.guide);
        if (diff < GUIDE_LINE_OFFSET) {
          resultH.push({
            lineGuide: lg,
            diff: diff,
            snap: bound.snap,
            offset: bound.offset,
          });
        }
      });
    });
    stops.vertical.forEach((lg) => {
      bounds.vertical.forEach((bound) => {
        const diff = Math.abs(lg - bound.guide);
        if (diff < GUIDE_LINE_OFFSET) {
          resultV.push({
            lineGuide: lg,
            diff: diff,
            snap: bound.snap,
            offset: bound.offset,
          });
        }
      });
    });
    const minH = resultH.sort((a, b) => a.diff - b.diff)[0];
    const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
    const guides = [];
    if (minH) {
      guides.push({
        lineGuide: minH.lineGuide,
        offset: minH.offset,
        orientation: "H",
        snap: minH.snap,
      });
    }
    if (minV) {
      guides.push({
        lineGuide: minV.lineGuide,
        offset: minV.offset,
        orientation: "V",
        snap: minV.snap,
      });
    }
    return guides;
  };

  const drawLine = useCallback((guides) => {
    setGridGuides(guides);
  }, []);

  const handleDragMove = (e, index) => {
    const draggedCircle = circles[index];
    const stage = e.target.getStage();
    const layer = e.target.getLayer();
    
    // Get the new position of the dragged circle
    const newX = e.target.x();
    const newY = e.target.y();

    const stops = getStops(draggedCircle.id);
    const bounds = getBounds({ ...draggedCircle, x: newX, y: newY });
    const guides = getGuides(stops, bounds);

    let newPosition = { x: newX, y: newY };
    let shouldDrawGuides = false;

    if (guides.length > 0) {
      guides.forEach((lg) => {
        if (lg.orientation === "H") {
          const diff = newY - (lg.lineGuide + lg.offset);
          if (Math.abs(diff) < SNAP_THRESHOLD) {
            newPosition.y = newY - diff * SNAP_STRENGTH;
            shouldDrawGuides = true;
          }
        } else if (lg.orientation === "V") {
          const diff = newX - (lg.lineGuide + lg.offset);
          if (Math.abs(diff) < SNAP_THRESHOLD) {
            newPosition.x = newX - diff * SNAP_STRENGTH;
            shouldDrawGuides = true;
          }
        }
      });

      if (shouldDrawGuides) {
        drawLine(guides);
      } else {
        setGridGuides([]);
      }
    } else {
      setGridGuides([]);
    }

    e.target.position(newPosition);

    // Update the circles state
    const newCircles = [...circles];
    newCircles[index] = {
      ...newCircles[index],
      x: newPosition.x,
      y: newPosition.y,
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

    // Force update of the layer
    layer.batchDraw();
  };

  const handleDragEnd = (e) => {
    setGridGuides([]);
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
        <Stage width={stageWidth} height={stageHeight} ref={stageRef}>
          <Layer>
            <Rect
              width={stageWidth}
              height={stageHeight}
              fill="#f0f0f0"
              stroke="black"
              strokeWidth={2}
            />
            <ArrowManager arrows={arrows} baseCircleRadius={baseCircleRadius} />
            <GridLines guides={gridGuides} />
            {circles.map((circle, index) => {
              const radius = baseCircleRadius * circle.size;
              return (
                <Group
                  key={circle.id}
                  x={circle.x}
                  y={circle.y}
                  draggable
                  onDragMove={(e) => handleDragMove(e, index)}
                  onDragEnd={handleDragEnd}
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