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
      from.x + fromRadius * Math.cos(angle),
      from.y + fromRadius * Math.sin(angle),
      to.x - toRadius * Math.cos(angle),
      to.y - toRadius * Math.sin(angle)
    ];
  };

  return (
    <>
      {arrows.map((arrow, index) => (
        <Arrow
          key={index}
          points={calculateArrowPoints(arrow.from, arrow.to)}
          pointerLength={20}
          pointerWidth={20}
          fill="black"
          stroke="black"
          strokeWidth={4}
        />
      ))}
    </>
  );
};

export default ArrowManager;