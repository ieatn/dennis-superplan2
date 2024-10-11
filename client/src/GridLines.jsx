import React from 'react';
import { Line } from 'react-konva';

const GridLines = ({ guides }) => {
  return guides.map((lg, i) => {
    if (lg.orientation === "H") {
      return (
        <Line
          key={`h${i}`}
          points={[-6000, 0, 6000, 0]}
          stroke="rgb(0, 161, 255)"
          strokeWidth={3}
          dash={[4, 6]}
          x={0}
          y={lg.lineGuide}
        />
      );
    } else if (lg.orientation === "V") {
      return (
        <Line
          key={`v${i}`}
          points={[0, -6000, 0, 6000]}
          stroke="rgb(0, 161, 255)"
          strokeWidth={3}
          dash={[4, 6]}
          x={lg.lineGuide}
          y={0}
        />
      );
    }
    return null;
  }).filter(Boolean);
};

export default GridLines;
