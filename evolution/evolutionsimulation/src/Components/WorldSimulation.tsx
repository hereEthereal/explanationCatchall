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
const NEXUS_WIDTH = 300;
const NEXUS_HEIGHT = 100;

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



const WorldSimulation: React.FC = () => {
  const [particles, setParticles] = useState<LightParticle[]>([]);
  const [usableEnergy, setUsableEnergy] = useState<UsableEnergy[]>([]);
  const [totalEnergyCreated, setTotalEnergyCreated] = useState(0);
  const [amountOfStoredEnergyInNexus, setAmountOfStoredEnergyInNexus] = useState(0);
  const [baseSpeed, setBaseSpeed] = useState<number>(1);
  const [spawnRate, setSpawnRate] = useState<number>(1);
  const [movingEnergy, setMovingEnergy] = useState<UsableEnergy[]>([]);

  const canvasWidth = 800;
  const canvasHeight = 600;

  const nexusX = canvasWidth / 2 - NEXUS_WIDTH / 2;
  const nexusY = (canvasHeight * 2) / 3 - NEXUS_HEIGHT / 2;

  const [entityDetectors, setEntityDetectors] = useState<EntityDetectorProps[]>([
    { id: 1, x: 100, y: 100, radius: 20, isDetecting: false },
    { id: 2, x: 300, y: 200, radius: 20, isDetecting: false },
    { id: 3, x: 500, y: 300, radius: 20, isDetecting: false },
  ]);

  const [entityConverters, setEntityConverters] = useState<EntityConverterProps[]>(() => {
    const converters: EntityConverterProps[] = [];
    // Add 28 random converters
    for (let i = 0; i < 28; i++) {
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
      x: nexusX + Math.random() * NEXUS_WIDTH,
      y: nexusY + Math.random() * NEXUS_HEIGHT,
      size: 10,
      hasStoredEnergy: false,
    });
    return converters;
  });

  const entityColors = {
    EN: "rgba(0, 255, 0, 0.2)",
    ED: "blue",
    EM: "red",
    EC: "purple",
    ECv: "orange",
  };

  useEffect(() => {
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

        // Update detectors
        const updatedDetectors = entityDetectors.map((detector) => ({
          ...detector,
          isDetecting: updatedParticles.some(
            (particle) =>
              Math.sqrt(
                Math.pow(detector.x - particle.x, 2) +
                Math.pow(detector.y - particle.y, 2)
              ) <= detector.radius
          ),
        }));
        setEntityDetectors(updatedDetectors);

        // Handle conversion process
        setEntityConverters((prevConverters) => {
          let newUsableEnergy: UsableEnergy[] = [];
          const updatedConverters = prevConverters.map((converter) => {
            if (!converter.hasStoredEnergy) {
              const particleIndex = updatedParticles.findIndex(
                (particle) =>
                  Math.sqrt(
                    Math.pow(converter.x - particle.x, 2) +
                    Math.pow(converter.y - particle.y, 2)
                  ) <= converter.size / 2
              );

              if (particleIndex !== -1) {
                const newEnergy = {
                  id: usableEnergyId++,
                  x: converter.x + converter.size + ENERGY_SIZE / 2,
                  y: converter.y,
                };
                newUsableEnergy.push(newEnergy);
                updatedParticles.splice(particleIndex, 1);
                setTotalEnergyCreated((prev) => prev + 1);

                // Check if the new energy is in the Nexus area
                if (
                  newEnergy.x >= nexusX &&
                  newEnergy.x <= nexusX + NEXUS_WIDTH &&
                  newEnergy.y >= nexusY &&
                  newEnergy.y <= nexusY + NEXUS_HEIGHT
                ) {
                  setAmountOfStoredEnergyInNexus((prev) => prev + 1);
                }

                return { ...converter, hasStoredEnergy: true };
              }
            }
            return converter;
          });

          setUsableEnergy((prevEnergy) => [...prevEnergy, ...newUsableEnergy]);
          return updatedConverters;
        });

        return updatedParticles;
      });

      // Move the falling energy
      setMovingEnergy((prevMovingEnergy) =>
        prevMovingEnergy.map((energy) => ({
          ...energy,
          y: energy.y + 1, // Adjust this value to change falling speed
        })).filter((energy) => energy.y < canvasHeight)
      );
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

  const handleSpawnRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpawnRate(parseInt(event.target.value));
  };

  const handleMoveStoredEnergy = () => {
    setEntityConverters((prevConverters) => 
      prevConverters.map((converter) => ({ ...converter, hasStoredEnergy: false }))
    );

    setUsableEnergy((prevEnergy) => {
      const storedEnergy = prevEnergy.filter((energy) => 
        entityConverters.some((converter) => 
          Math.abs(energy.x - (converter.x + converter.size + ENERGY_SIZE / 2)) < 1 &&
          Math.abs(energy.y - converter.y) < 1
        )
      );
      
      setMovingEnergy((prevMovingEnergy) => [...prevMovingEnergy, ...storedEnergy]);
      
      return prevEnergy.filter((energy) => 
        !storedEnergy.some((stored) => stored.id === energy.id)
      );
    });
  };

  return (
    <SimulationContainer>
      <Title>World Simulation</Title>
      <SVGCanvas width={canvasWidth} height={canvasHeight}>
        {/* Render Nexus area */}
        <rect
          x={nexusX}
          y={nexusY}
          width={NEXUS_WIDTH}
          height={NEXUS_HEIGHT}
          fill={entityColors.EN}
          stroke="black"
          strokeWidth={1}
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
        <Button onClick={handleMoveStoredEnergy}>Move Stored Energy</Button>
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
          Blue circles that turn red when detecting light particles.
        </p>
        <div>Total Energy Created: {totalEnergyCreated}</div>
        <div>Stored Energy in Nexus: {amountOfStoredEnergyInNexus}</div>
      </InfoPanel>
    </SimulationContainer>
  );
};

export default WorldSimulation;