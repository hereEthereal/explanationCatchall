# Flat File Compilation

## File: ControlPanel.tsx

```tsx
import React from "react";
import styled from "styled-components";

const ControlPanelContainer = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const SliderLabel = styled.label`
  margin-right: 8px;
  width: 120px;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

interface ControlPanelProps {
  baseSpeed: number;
  setBaseSpeed: (speed: number) => void;
  targetParticles: number;
  setTargetParticles: (particles: number) => void;
  onMoveStoredEnergy: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  baseSpeed,
  setBaseSpeed,
  targetParticles,
  setTargetParticles,
  onMoveStoredEnergy
}) => {
  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBaseSpeed(parseFloat(event.target.value));
  };

  const handleTargetParticlesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetParticles(parseInt(event.target.value));
  };

  return (
    <ControlPanelContainer>
      <SliderContainer>
        <SliderLabel>Particle Speed:</SliderLabel>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={baseSpeed}
          onChange={handleSpeedChange}
        />
        <span>{baseSpeed.toFixed(1)}</span>
      </SliderContainer>
      <SliderContainer>
        <SliderLabel>Target Particles:</SliderLabel>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={targetParticles}
          onChange={handleTargetParticlesChange}
        />
        <span>{targetParticles}</span>
      </SliderContainer>
      <Button onClick={onMoveStoredEnergy}>Move Stored Energy</Button>
    </ControlPanelContainer>
  );
};

export default ControlPanel;
```

## File: EntityConverter.tsx

```tsx
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
```

## File: EntityMover.tsx

```tsx
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
```

## File: InfoPanel.tsx

```tsx
import React from "react";
import styled from "styled-components";
import { ExecutiveCoordinator } from "./simulationUtils";

const InfoPanelContainer = styled.div`
  width: 300px;
  height: 600px;
  margin-left: 20px;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  overflow-y: auto;
`;

interface InfoPanelProps {
  totalEnergyCreated: number;
  amountOfStoredEnergyInNexus: number;
  largestRewardCount: number;
  executiveCoordinator: ExecutiveCoordinator | null;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  totalEnergyCreated,
  amountOfStoredEnergyInNexus,
  largestRewardCount,
  executiveCoordinator
}) => {
  const entityColors = {
    EN: "rgba(0, 255, 0, 0.2)",
    EM: "red",
    EC: "blue",
    ECv: "orange",
  };

  return (
    <InfoPanelContainer>
      <h2>Entity Information</h2>
      <h3>Color Mapping:</h3>
      <ul>
        {Object.entries(entityColors).map(([entity, color]) => (
          <li key={entity}>
            <span style={{ color }}>{entity}</span>: {color}
          </li>
        ))}
      </ul>
      <div>Total Energy Created: {totalEnergyCreated}</div>
      <div>Stored Energy in Nexus: {amountOfStoredEnergyInNexus}</div>
      <div>Largest Reward Count: {largestRewardCount}</div>
      <h3>Executive Coordinator Knowledge:</h3>
      {executiveCoordinator && (
        <>
          <div>Number of Converters: {executiveCoordinator.knownLocations.converters.length}</div>
          <div>Nexus Location: ({executiveCoordinator.knownLocations.nexus.x}, {executiveCoordinator.knownLocations.nexus.y})</div>
          <div>Self Location: ({executiveCoordinator.knownLocations.self.x}, {executiveCoordinator.knownLocations.self.y})</div>
        </>
      )}
    </InfoPanelContainer>
  );
};

export default InfoPanel;
```

## File: SimulationCanvas.tsx

```tsx
import React from "react";
import styled from "styled-components";
import EntityConverter, { EntityConverterProps } from "./EntityConverter";
import EntityMover, { EntityMoverProps } from "./EntityMover";
import { LightParticle, UsableEnergy, ExecutiveCoordinator } from "./simulationUtils";

const SVGCanvas = styled.svg`
  border: 1px solid #d1d5db;
`;

interface SimulationCanvasProps {
    particles: LightParticle[];
    usableEnergy: UsableEnergy[];
    movingEnergy: UsableEnergy[];
    entityConverters: EntityConverterProps[];
    entityMovers: EntityMoverProps[];
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
    entityMovers,
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
          <EntityConverter key={`converter-${converter.id}`} {...converter} />
        ))}
        
        {/* Render Entity Movers */}
        {entityMovers.map((mover) => (
          <EntityMover key={`mover-${mover.id}`} {...mover} />
        ))}
        
        {/* Render Particles */}
        {particles.map((particle, index) => (
          <circle
            key={`particle-${index}`}
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
```

## File: WorldSimulation.tsx

```tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SimulationCanvas from "./SimulationCanvas";
import ControlPanel from "./ControlPanel";
import InfoPanel from "./InfoPanel";
import { 
  LightParticle, 
  UsableEnergy, 
  ExecutiveCoordinator, 
  EntityConverterProps,
  EntityMoverProps,
  updateParticles,
  handleConversion,
  updateMovingEnergy,
  updateExecutiveCoordinator,
  updateEntityMovers
} from "./simulationUtils";
import { initializeConverters } from "./EntityConverter";
import { initializeMovers } from "./EntityMover";


const SimulationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #f3f4f6;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;


const WorldSimulation: React.FC = () => {
  const canvasWidth = 800;
  const canvasHeight = 600;
  const NEXUS_WIDTH = 300;
  const NEXUS_HEIGHT = 100;

  const nexusX = canvasWidth / 2 - NEXUS_WIDTH / 2;
  const nexusY = (canvasHeight * 2) / 3 - NEXUS_HEIGHT / 2;

  const [particles, setParticles] = useState<LightParticle[]>([]);
  const [usableEnergy, setUsableEnergy] = useState<UsableEnergy[]>([]);
  const [totalEnergyCreated, setTotalEnergyCreated] = useState(0);
  const [amountOfStoredEnergyInNexus, setAmountOfStoredEnergyInNexus] = useState(0);
  const [largestRewardCount, setLargestRewardCount] = useState(0);
  const [baseSpeed, setBaseSpeed] = useState<number>(1);
  const [targetParticles, setTargetParticles] = useState<number>(10);
  const [movingEnergy, setMovingEnergy] = useState<UsableEnergy[]>([]);

  const [entityConverters, setEntityConverters] = useState<EntityConverterProps[]>(() => 
    initializeConverters(canvasWidth, canvasHeight, nexusX, nexusY, NEXUS_WIDTH, NEXUS_HEIGHT)
  );

  const [entityMovers, setEntityMovers] = useState<EntityMoverProps[]>(() => 
    initializeMovers(30, canvasWidth, canvasHeight)
  );

  const [executiveCoordinator, setExecutiveCoordinator] = useState<ExecutiveCoordinator>(() => ({
    x: nexusX + NEXUS_WIDTH / 2,
    y: nexusY + NEXUS_HEIGHT / 2,
    size: 20,
    knownLocations: {
      converters: entityConverters.map(({ id, x, y }) => ({ id, x, y })),
      nexus: { x: nexusX, y: nexusY, width: NEXUS_WIDTH, height: NEXUS_HEIGHT },
      self: { x: nexusX + NEXUS_WIDTH / 2, y: nexusY + NEXUS_HEIGHT / 2 },
    },
  }));

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setParticles(prevParticles => updateParticles(prevParticles, targetParticles, baseSpeed));
      
      const conversionResult = handleConversion(particles, entityConverters);
      setEntityConverters(conversionResult.updatedConverters);
      setUsableEnergy(prevEnergy => {
        const newEnergy = [...prevEnergy, ...conversionResult.newUsableEnergy];
        // Remove any duplicate energies based on their ID
        return newEnergy.filter((energy, index, self) =>
          index === self.findIndex((e) => e.id === energy.id)
        );
      });
      setTotalEnergyCreated(prev => prev + conversionResult.newUsableEnergy.length);
      setAmountOfStoredEnergyInNexus(prev => prev + conversionResult.newEnergyInNexus);

      setMovingEnergy(prevMovingEnergy => 
        updateMovingEnergy(prevMovingEnergy, executiveCoordinator, setLargestRewardCount)
      );

      setExecutiveCoordinator(prevEC => updateExecutiveCoordinator(prevEC, entityConverters));

      const { updatedMovers, updatedConverters } = updateEntityMovers(entityMovers, entityConverters, canvasWidth, canvasHeight);
      setEntityMovers(updatedMovers);
      setEntityConverters(updatedConverters);
    }, 16);

    return () => clearInterval(updateInterval);
  }, [baseSpeed, targetParticles, particles, entityConverters, entityMovers]);

  const handleMoveStoredEnergy = () => {
    setEntityConverters(prevConverters => 
      prevConverters.map(converter => ({ ...converter, hasStoredEnergy: false }))
    );

    setUsableEnergy(prevEnergy => {
      const storedEnergy = prevEnergy.filter(energy => 
        entityConverters.some(converter => 
          Math.abs(energy.x - (converter.x + converter.size + 8 / 2)) < 1 &&
          Math.abs(energy.y - converter.y) < 1
        )
      );
      
      setMovingEnergy(prevMovingEnergy => [...prevMovingEnergy, ...storedEnergy]);
      
      return prevEnergy.filter(energy => 
        !storedEnergy.some(stored => stored.id === energy.id)
      );
    });
  };

  return (
    <SimulationContainer>
      <Title>World Simulation</Title>
      <SimulationCanvas
        particles={particles}
        usableEnergy={usableEnergy}
        movingEnergy={movingEnergy}
        entityConverters={entityConverters}
        entityMovers={entityMovers}
        executiveCoordinator={executiveCoordinator}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        nexusX={nexusX}
        nexusY={nexusY}
        nexusWidth={NEXUS_WIDTH}
        nexusHeight={NEXUS_HEIGHT}
      />
      <ControlPanel
        baseSpeed={baseSpeed}
        setBaseSpeed={setBaseSpeed}
        targetParticles={targetParticles}
        setTargetParticles={setTargetParticles}
        onMoveStoredEnergy={handleMoveStoredEnergy}
      />
      <InfoPanel
        totalEnergyCreated={totalEnergyCreated}
        amountOfStoredEnergyInNexus={amountOfStoredEnergyInNexus}
        largestRewardCount={largestRewardCount}
        executiveCoordinator={executiveCoordinator}
      />
    </SimulationContainer>
  );
};

export default WorldSimulation;
```

## File: simulationUtils.tsx

```tsx
export interface LightParticle {
    x: number;
    y: number;
    speed: number;
    angle: number;
  }
  export interface UsableEnergy {
    id: string;  // Changed from number to string
    x: number;
    y: number;
  }
  export interface ExecutiveCoordinator {
    x: number;
    y: number;
    size: number;
    knownLocations: {
      converters: { id: number; x: number; y: number }[];
      nexus: { x: number; y: number; width: number; height: number };
      self: { x: number; y: number };
    };
  }
  
  export interface EntityConverterProps {
    id: number;
    x: number;
    y: number;
    size: number;
    hasStoredEnergy: boolean;
  }

  export interface EntityMoverProps {
    id: number;
    x: number;
    y: number;
    size: number;
    isCarryingConverter: boolean;
    movesRemaining?: number;
  }
  
  
  const canvasWidth = 800;
  const canvasHeight = 600;
  const NEXUS_WIDTH = 300;
  const NEXUS_HEIGHT = 100;
  const ENERGY_SIZE = 8;
  
  export const updateParticles = (
    prevParticles: LightParticle[],
    targetParticles: number,
    baseSpeed: number
  ): LightParticle[] => {
    const updatedParticles = prevParticles
      .map((particle) => ({
        ...particle,
        x: particle.x + Math.cos(particle.angle) * particle.speed,
        y: particle.y + Math.sin(particle.angle) * particle.speed,
      }))
      .filter(
        (particle) =>
          particle.x >= 0 &&
          particle.x <= canvasWidth &&
          particle.y >= 0 &&
          particle.y <= canvasHeight
      );
  
    const particlesToSpawn = Math.max(0, targetParticles - updatedParticles.length);
    const newParticles = Array(particlesToSpawn).fill(null).map(() => ({
      x: Math.random() * canvasWidth,
      y: 0,
      speed: baseSpeed + Math.random() * baseSpeed,
      angle: Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 4),
    }));
  
    return [...updatedParticles, ...newParticles];
  };
  
  let globalEnergyId = 0;


  export const handleConversion = (
    particles: LightParticle[],
    entityConverters: EntityConverterProps[],
  ): { updatedConverters: EntityConverterProps[], newUsableEnergy: UsableEnergy[], newEnergyInNexus: number } => {
    let newUsableEnergy: UsableEnergy[] = [];
    let newEnergyInNexus = 0;
    const updatedConverters = entityConverters.map((converter) => {
      if (!converter.hasStoredEnergy) {
        const particleIndex = particles.findIndex(
          (particle) =>
            Math.sqrt(
              Math.pow(converter.x - particle.x, 2) +
              Math.pow(converter.y - particle.y, 2)
            ) <= converter.size / 2
        );
  
        if (particleIndex !== -1) {
          const newEnergy: UsableEnergy = {
            id: `energy-${globalEnergyId++}`,
            x: converter.x + converter.size + 8 / 2,
            y: converter.y,
          };
          newUsableEnergy.push(newEnergy);
  
          // Check if the new energy is in the Nexus area
          const nexusX = 800 / 2 - 300 / 2;
          const nexusY = (600 * 2) / 3 - 100 / 2;
          if (
            newEnergy.x >= nexusX &&
            newEnergy.x <= nexusX + 300 &&
            newEnergy.y >= nexusY &&
            newEnergy.y <= nexusY + 100
          ) {
            newEnergyInNexus++;
          }
  
          return { ...converter, hasStoredEnergy: true };
        }
      }
      return converter;
    });
  
    return { updatedConverters, newUsableEnergy, newEnergyInNexus };
  };
  export const updateMovingEnergy = (
    prevMovingEnergy: UsableEnergy[],
    executiveCoordinator: ExecutiveCoordinator | null,
    setLargestRewardCount: (callback: (prev: number) => number) => void
  ): UsableEnergy[] => {
    return prevMovingEnergy.map((energy) => {
      const newY = energy.y + 1; // Adjust this value to change falling speed
      
      // Check if energy is in contact with Executive Coordinator
      if (executiveCoordinator &&
        Math.abs(energy.x - executiveCoordinator.x) <= (ENERGY_SIZE + executiveCoordinator.size) / 2 &&
        Math.abs(newY - executiveCoordinator.y) <= (ENERGY_SIZE + executiveCoordinator.size) / 2
      ) {
        setLargestRewardCount((prev) => prev + 1);
        return null;
      }
      
      return { ...energy, y: newY };
    }).filter((energy): energy is UsableEnergy => energy !== null && energy.y < canvasHeight);
  };

  export const updateExecutiveCoordinator = (
    prevEC: ExecutiveCoordinator,
    entityConverters: EntityConverterProps[]
  ): ExecutiveCoordinator => {
    return {
      ...prevEC,
      knownLocations: {
        ...prevEC.knownLocations,
        converters: entityConverters.map(({ id, x, y }) => ({ id, x, y })),
        self: { x: prevEC.x, y: prevEC.y },
      },
    };
  };



  export const updateEntityMovers = (
    entityMovers: EntityMoverProps[],
    entityConverters: EntityConverterProps[],
    canvasWidth: number,
    canvasHeight: number
  ): { updatedMovers: EntityMoverProps[], updatedConverters: EntityConverterProps[] } => {
    const updatedMovers = entityMovers.map(mover => {
      let newX = mover.x;
      let newY = mover.y;
      let isCarryingConverter = mover.isCarryingConverter;
      let movesRemaining = mover.movesRemaining || 0;
  
      // Always attempt to move, regardless of carrying status
      const move = Math.random() > 0.8; // 20% chance to move
      if (move) {
        const direction = Math.floor(Math.random() * 4);
        const moveDistance = 2; // 2 pixels per move
        switch (direction) {
          case 0: newY = Math.max(0, mover.y - moveDistance); break; // Up
          case 1: newY = Math.min(canvasHeight, mover.y + moveDistance); break; // Down
          case 2: newX = Math.max(0, mover.x - moveDistance); break; // Left
          case 3: newX = Math.min(canvasWidth, mover.x + moveDistance); break; // Right
        }
  
        // Decrement movesRemaining if carrying a converter
        if (isCarryingConverter && movesRemaining > 0) {
          movesRemaining--;
        }
      }
  
      // Check if it's time to drop the converter
      if (isCarryingConverter && movesRemaining === 0) {
        isCarryingConverter = false;
        // Move up 5 steps after dropping
        newY = Math.max(0, newY - 10); // 5 * 2 pixels
        console.log(`Mover ${mover.id} dropped the converter and moved up`);
      }
  
      return { ...mover, x: newX, y: newY, isCarryingConverter, movesRemaining };
    });
  
    const updatedConverters = entityConverters.map(converter => {
      const nearbyMover = updatedMovers.find(mover => 
        !mover.isCarryingConverter &&
        Math.abs(mover.x - converter.x) < mover.size &&
        Math.abs(mover.y - converter.y) < mover.size
      );
  
      if (nearbyMover && Math.random() < 0.5) {
        console.log(`Mover ${nearbyMover.id} decided to move Converter ${converter.id}`);
        const moverIndex = updatedMovers.findIndex(m => m.id === nearbyMover.id);
        updatedMovers[moverIndex] = {
          ...updatedMovers[moverIndex],
          isCarryingConverter: true,
          movesRemaining: Math.floor(Math.random() * 31) + 10, // Random number between 10 and 40
        };
        return { ...converter, x: updatedMovers[moverIndex].x, y: updatedMovers[moverIndex].y + updatedMovers[moverIndex].size };
      } else if (nearbyMover) {
        console.log(`Mover ${nearbyMover.id} decided not to move Converter ${converter.id}`);
      }
  
      return converter;
    });
  
    // Update positions of carried converters
    updatedMovers.forEach(mover => {
      if (mover.isCarryingConverter) {
        const carriedConverter = updatedConverters.find(conv => 
          Math.abs(conv.x - mover.x) < mover.size &&
          Math.abs(conv.y - (mover.y + mover.size)) < mover.size
        );
        if (carriedConverter) {
          const converterIndex = updatedConverters.findIndex(c => c.id === carriedConverter.id);
          updatedConverters[converterIndex] = { ...carriedConverter, x: mover.x, y: mover.y + mover.size };
        }
      }
    });
  
    return { updatedMovers, updatedConverters };
  };
```

