import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import EntityDetector, { EntityDetectorProps } from "./EntityDetector";
import EntityConverter, { EntityConverterProps } from "./EntityConverter";

interface LightParticle {
  x: number;
  y: number;
  speed: number;
  angle: number;
}

interface UsableEnergy {
  id: number;
  x: number;
  y: number;
}

const ENERGY_SIZE = 8;
const MAX_ENERGY_LAYERS = 3;

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

const SVGCanvas = styled.svg`
  border: 1px solid #d1d5db;
`;

const ControlPanel = styled.div`
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

const InfoPanel = styled.div`
  width: 300px;
  height: 600px;
  margin-left: 20px;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  overflow-y: auto;
`;

const WorldSimulation: React.FC = () => {
  const [particles, setParticles] = useState<LightParticle[]>([]);
  const [usableEnergy, setUsableEnergy] = useState<UsableEnergy[]>([]);
  const [totalEnergyCreated, setTotalEnergyCreated] = useState(0);
  const [totalEnergyRemoved, setTotalEnergyRemoved] = useState(0);
  const [debugMode, setDebugMode] = useState(false);

  const [baseSpeed, setBaseSpeed] = useState<number>(1);
  const [spawnRate, setSpawnRate] = useState<number>(1);
  const [entityDetectors, setEntityDetectors] = useState<EntityDetectorProps[]>([
    { id: 1, x: 100, y: 100, radius: 20, isDetecting: false },
    { id: 2, x: 300, y: 200, radius: 20, isDetecting: false },
    { id: 3, x: 500, y: 300, radius: 20, isDetecting: false },
  ]);

    const [entityConverters, setEntityConverters] = useState<EntityConverterProps[]>([
    { id: 1, x: 200, y: 150, size: 10 },
    { id: 2, x: 400, y: 250, size: 10 },
    { id: 3, x: 600, y: 350, size: 10 },
  ]);
  const canvasWidth = 800;
  const canvasHeight = 600;

  // Energy Nexus (EN) configuration
  const enWidth = 100;
  const enHeight = 80;
  const enX = canvasWidth / 2 - enWidth / 2;
  const enY = Math.floor((canvasHeight * 2) / 3);

  const entityColors = {
    EN: "rgba(0, 255, 0, 0.2)",
    ED: "blue",
    EM: "red",
    EC: "purple",
    ECv: "orange",
  };

  // Modify the getNextEnergyPosition function:
const getNextEnergyPosition = (
  converter: EntityConverterProps,
  existingEnergy: UsableEnergy[]
): { x: number; y: number } | null => {
  const positions = [];
  for (let layer = 1; layer <= MAX_ENERGY_LAYERS; layer++) {
    for (let i = 0; i < layer * 8; i++) {
      const angle = (i * 2 * Math.PI) / (layer * 8);
      const x = converter.x + Math.cos(angle) * (converter.size / 2 + ENERGY_SIZE * layer);
      const y = converter.y + Math.sin(angle) * (converter.size / 2 + ENERGY_SIZE * layer);
      positions.push({ x, y });
    }
  }

  for (const pos of positions) {
    const isOccupied = existingEnergy.some(
      (energy) => Math.sqrt(Math.pow(energy.x - pos.x, 2) + Math.pow(energy.y - pos.y, 2)) < ENERGY_SIZE
    );
    if (!isOccupied) {
      return pos;
    }
  }

  return null; // All positions are occupied
};

  useEffect(() => {
    let particleId = 0;
    let usableEnergyId = 0;

    const updateInterval = setInterval(() => {
      setParticles((prevParticles) => {
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

        const updatedDetectors = entityDetectors.map((detector) => {
          const isDetecting = updatedParticles.some(
            (particle) =>
              Math.sqrt(
                Math.pow(detector.x - particle.x, 2) +
                  Math.pow(detector.y - particle.y, 2)
              ) <= detector.radius
          );

          if (isDetecting !== detector.isDetecting) {
            console.log(
              `Detector ${detector.id} is ${
                isDetecting ? "now detecting" : "no longer detecting"
              } a particle`
            );
          }

          return { ...detector, isDetecting };
        });

        setEntityDetectors(updatedDetectors);



        // Handle conversion process
        const newUsableEnergy: UsableEnergy[] = [];
        const remainingParticles = updatedParticles.filter((particle) => {
          for (const converter of entityConverters) {
            const distance = Math.sqrt(
              Math.pow(converter.x - particle.x, 2) +
                Math.pow(converter.y - particle.y, 2)
            );
            // todo, consider this if, we may need to make it more accomdating
            if (distance <= converter.size / 2) {
              const nextPosition = getNextEnergyPosition(converter, usableEnergy);
              if (nextPosition) {
                newUsableEnergy.push({
                  id: usableEnergyId++,
                  x: nextPosition.x,
                  y: nextPosition.y,
                });
                console.log(`Energy created at (${nextPosition.x}, ${nextPosition.y})`);

                setTotalEnergyCreated(prev => prev + 1);

                return false; // Remove this particle
              }
            }
          }
          return true; // Keep this particle
        });

        setUsableEnergy((prevUsableEnergy) => [...prevUsableEnergy, ...newUsableEnergy]);

        return remainingParticles;      });
    }, 16); // 60 FPS

    const spawnInterval = setInterval(() => {
      setParticles((prevParticles) => [
        ...prevParticles,
        ...Array(spawnRate)
          .fill(null)
          .map(() => ({
            x: Math.random() * canvasWidth,
            y: 0,
            speed: baseSpeed + Math.random() * baseSpeed,
            angle: Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 4),
          })),
      ]);
    }, 1000);

    return () => {
      clearInterval(updateInterval);
      clearInterval(spawnInterval);
    };
  }, [baseSpeed, spawnRate]);

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBaseSpeed(parseFloat(event.target.value));
  };

  const handleSpawnRateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSpawnRate(parseInt(event.target.value));
  };

  return (
    <SimulationContainer>
      <Title>World Simulation</Title>
      <SVGCanvas width={canvasWidth} height={canvasHeight}>
        <rect
          x={enX}
          y={enY}
          width={enWidth}
          height={enHeight}
          fill={entityColors.EN}
          stroke="rgba(0, 255, 0, 0.8)"
          strokeWidth={2}
        />
        {entityDetectors.map((detector) => (
          <EntityDetector key={detector.id} {...detector} />
        ))}
        {entityConverters.map((converter) => (
          <EntityConverter key={converter.id} {...converter} />
        ))}
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
      </SVGCanvas>
      <ControlPanel>
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
          <SliderLabel>Spawn Rate:</SliderLabel>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={spawnRate}
            onChange={handleSpawnRateChange}
          />
          <span>{spawnRate} per second</span>
        </SliderContainer>
      </ControlPanel>
      <InfoPanel>
        <h2>Entity Information</h2>
        <h3>Color Mapping:</h3>
        <ul>
          {Object.entries(entityColors).map(([entity, color]) => (
            <li key={entity}>
              <span style={{ color }}>{entity}</span>: {color}
            </li>
          ))}
        </ul>
        <h3>Entity Detectors:</h3>
        <p>
          Blue circles that turn red and slightly enlarge when detecting
          light particles.
        </p>
        <div>Total Energy Created: {totalEnergyCreated}</div>

      </InfoPanel>
    </SimulationContainer>
  );
};

export default WorldSimulation;