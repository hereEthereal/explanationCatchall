import React from "react";

export interface EntityDetectorProps {
  id: number;
  x: number;
  y: number;
  radius: number;
  isDetecting: boolean;
}

const EntityDetector: React.FC<EntityDetectorProps> = ({
  x,
  y,
  radius,
  isDetecting,
}) => {
  return (
    <circle
      cx={x}
      cy={y}
      r={radius + (isDetecting ? 2 : 0)}
      fill={isDetecting ? "red" : "blue"}
      stroke="black"
      strokeWidth={1}
    />
  );
};

export default EntityDetector;