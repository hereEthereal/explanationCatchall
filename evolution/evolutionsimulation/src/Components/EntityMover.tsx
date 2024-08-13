import React from 'react';

export interface EntityMoverProps {
  id: number;
  x: number;
  y: number;
  size: number;
  isCarryingConverter: boolean;
}

const EntityMover: React.FC<EntityMoverProps> = ({ x, y, size, isCarryingConverter }) => {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={size / 2}
        fill={isCarryingConverter ? "darkgreen" : "green"}
        stroke="black"
        strokeWidth={1}
      />
      {isCarryingConverter && (
        <circle
          cx={x}
          cy={y + size}
          r={size / 2}
          fill="purple"
          stroke="black"
          strokeWidth={1}
        />
      )}
    </g>
  );
};

export const initializeMovers = (
  count: number,
  canvasWidth: number,
  canvasHeight: number
): EntityMoverProps[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    size: 10,
    isCarryingConverter: false,
  }));
};

export default EntityMover;