import React from 'react';

interface EntityConverterProps {
    id: number;
    x: number;
    y: number;
    size: number;
    hasStoredEnergy: boolean;
  }

const EntityConverter: React.FC<EntityConverterProps> = ({ x, y, size }) => {
  return (
    <circle
      cx={x}
      cy={y}
      r={size / 2}
      fill="orange"
      stroke="black"
      strokeWidth={1}
    />
  );
};

export default EntityConverter;
export type {EntityConverterProps}