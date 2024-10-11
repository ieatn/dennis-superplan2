import React from 'react';
import { Arrow } from 'react-konva';

const ArrowManager = ({ arrows, baseCircleRadius }) => {
  const calculateArrowPoints = (from, to) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);
    
    const fromRadius = baseCircleRadius * from.size;
    const toRadius = baseCircleRadius * to.size;
    
    return [
      from.x + fromRadius * Math.cos(angle) - 3,
      from.y + fromRadius * Math.sin(angle) - 3,
      to.x - toRadius * Math.cos(angle) + 5,
      to.y - toRadius * Math.sin(angle) + 5
    ];
  };

  return (
    <>
      {arrows.map((arrow, index) => (
        <Arrow
          key={index}
          points={calculateArrowPoints(arrow.from, arrow.to)}
          pointerLength={20} // Reduced size
          pointerWidth={20}  // Reduced size
          fill="black"
          stroke="black"
          strokeWidth={4}    // Reduced size
        />
      ))}
    </>
  );
};

export default ArrowManager;