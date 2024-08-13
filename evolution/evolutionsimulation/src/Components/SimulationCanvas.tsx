import React from "react";
import styled from "styled-components";
import EntityConverter, { EntityConverterProps } from "./EntityConverter";
import { LightParticle, UsableEnergy, ExecutiveCoordinator } from "./simulationUtils";

const SVGCanvas = styled.svg`
  border: 1px solid #d1d5db;
`;

interface SimulationCanvasProps {
  particles: LightParticle[];
  usableEnergy: UsableEnergy[];
  movingEnergy: UsableEnergy[];
  entityConverters: EntityConverterProps[];
  executiveCoordinator: ExecutiveCoordinator;
  canvasWidth: number;
  canvasHeight: number;
  nexusX: number;
  nexusY: number;
  nexusWidth: number;
  nexusHeight: number;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  particles,
  usableEnergy,
  movingEnergy,
  entityConverters,
  executiveCoordinator,
  canvasWidth,
  canvasHeight,
  nexusX,
  nexusY,
  nexusWidth,
  nexusHeight
}) => {
  const ENERGY_SIZE = 8;

  return (
    <SVGCanvas width={canvasWidth} height={canvasHeight}>
      {/* Render Nexus area */}
      <rect
        x={nexusX}
        y={nexusY}
        width={nexusWidth}
        height={nexusHeight}
        fill="rgba(0, 255, 0, 0.2)"
        stroke="black"
        strokeWidth={1}
      />
      {/* Render Executive Coordinator */}
      <circle
        cx={executiveCoordinator.x}
        cy={executiveCoordinator.y}
        r={executiveCoordinator.size / 2}
        fill="blue"
        stroke="black"
        strokeWidth={1}
      />
      {/* Render Entity Converters */}
      {entityConverters.map((converter) => (
        <EntityConverter key={converter.id} {...converter} />
      ))}
      {/* Render Particles */}
      {particles.map((particle, index) => (
        <circle
          key={index}
          cx={particle.x}
          cy={particle.y}
          r={4}
          fill="yellow"
          stroke="black"
          strokeWidth={1}
        />
      ))}
      {/* Render Usable Energy */}
      {usableEnergy.map((energy) => (
        <rect
          key={energy.id}
          x={energy.x - ENERGY_SIZE / 2}
          y={energy.y - ENERGY_SIZE / 2}
          width={ENERGY_SIZE}
          height={ENERGY_SIZE}
          fill="purple"
        />
      ))}
      {/* Render Moving Energy */}
      {movingEnergy.map((energy) => (
        <rect
          key={energy.id}
          x={energy.x - ENERGY_SIZE / 2}
          y={energy.y - ENERGY_SIZE / 2}
          width={ENERGY_SIZE}
          height={ENERGY_SIZE}
          fill="green"
        />
      ))}
    </SVGCanvas>
  );
};

export default SimulationCanvas;