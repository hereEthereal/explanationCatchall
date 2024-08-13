import React from "react";

export interface EntityConverterProps {
  id: number;
  x: number;
  y: number;
  size: number;
  hasStoredEnergy: boolean;
}

const EntityConverter: React.FC<EntityConverterProps> = ({
  x,
  y,
  size,
  hasStoredEnergy
}) => {
  return (
    <circle
      cx={x}
      cy={y}
      r={size / 2}
      fill={hasStoredEnergy ? "orange" : "purple"}
      stroke="black"
      strokeWidth={1}
    />
  );
};

export const initializeConverters = (
  canvasWidth: number,
  canvasHeight: number,
  nexusX: number,
  nexusY: number,
  nexusWidth: number,
  nexusHeight: number
): EntityConverterProps[] => {
  const converters: EntityConverterProps[] = [];
  // Add 20 random converters
  for (let i = 0; i < 20; i++) {
    converters.push({
      id: i,
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: 10,
      hasStoredEnergy: false,
    });
  }
  // Add one converter guaranteed to be in the Nexus area
  converters.push({
    id: 28,
    x: nexusX + Math.random() * nexusWidth,
    y: nexusY + Math.random() * nexusHeight,
    size: 10,
    hasStoredEnergy: false,
  });
  return converters;
};

export default EntityConverter;