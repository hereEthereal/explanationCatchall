import React, { useEffect, useState } from "react";
import styled from "styled-components";
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

interface ExecutiveCoordinator {
  x: number;
  y: number;
  size: number;
  knownLocations: {
    converters: { id: number; x: number; y: number }[];
    nexus: { x: number; y: number; width: number; height: number };
    self: { x: number; y: number };
  };
}

const ENERGY_SIZE = 8;
const NEXUS_WIDTH = 300;
const NEXUS_HEIGHT = 100;
const EC_SIZE = 20;

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
  const [largestRewardCount, setLargestRewardCount] = useState(0);
  const [baseSpeed, setBaseSpeed] = useState<number>(1);
  const [targetParticles, setTargetParticles] = useState<number>(10);
  const [movingEnergy, setMovingEnergy] = useState<UsableEnergy[]>([]);

  const canvasWidth = 800;
  const canvasHeight = 600;

  const nexusX = canvasWidth / 2 - NEXUS_WIDTH / 2;
  const nexusY = (canvasHeight * 2) / 3 - NEXUS_HEIGHT / 2;

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

  const [executiveCoordinator, setExecutiveCoordinator] = useState<ExecutiveCoordinator>({
    x: nexusX + NEXUS_WIDTH / 2,
    y: nexusY + NEXUS_HEIGHT / 2,
    size: EC_SIZE,
    knownLocations: {
      converters: entityConverters.map(({ id, x, y }) => ({ id, x, y })),
      nexus: { x: nexusX, y: nexusY, width: NEXUS_WIDTH, height: NEXUS_HEIGHT },
      self: { x: nexusX + NEXUS_WIDTH / 2, y: nexusY + NEXUS_HEIGHT / 2 },
    },
  });

  const entityColors = {
    EN: "rgba(0, 255, 0, 0.2)",
    EM: "red",
    EC: "blue",
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

        // Spawn new particles
        const particlesToSpawn = Math.max(0, targetParticles - updatedParticles.length);
        const newParticles = Array(particlesToSpawn).fill(null).map(() => ({
          x: Math.random() * canvasWidth,
          y: 0,
          speed: baseSpeed + Math.random() * baseSpeed,
          angle: Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 4),
        }));

        return [...updatedParticles, ...newParticles];
      });

      // Handle conversion process
      setEntityConverters((prevConverters) => {
        let newUsableEnergy: UsableEnergy[] = [];
        const updatedConverters = prevConverters.map((converter) => {
          if (!converter.hasStoredEnergy) {
            const particleIndex = particles.findIndex(
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
              setParticles((prevParticles) => {
                const updatedParticles = [...prevParticles];
                updatedParticles.splice(particleIndex, 1);
                return updatedParticles;
              });
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

      // Move the falling energy and check for contact with Executive Coordinator
      setMovingEnergy((prevMovingEnergy) =>
        prevMovingEnergy.map((energy) => {
          const newY = energy.y + 1; // Adjust this value to change falling speed
          
          // Check if energy is in contact with Executive Coordinator
          if (
            Math.abs(energy.x - executiveCoordinator.x) <= (ENERGY_SIZE + executiveCoordinator.size) / 2 &&
            Math.abs(newY - executiveCoordinator.y) <= (ENERGY_SIZE + executiveCoordinator.size) / 2
          ) {
            setLargestRewardCount((prev) => prev + 1);
            return null; // Remove this energy
          }
          
          return { ...energy, y: newY };
        }).filter((energy): energy is UsableEnergy => energy !== null && energy.y < canvasHeight)
      );

      // Update Executive Coordinator's knowledge of entity locations
      setExecutiveCoordinator((prevEC) => ({
        ...prevEC,
        knownLocations: {
          ...prevEC.knownLocations,
          converters: entityConverters.map(({ id, x, y }) => ({ id, x, y })),
          self: { x: prevEC.x, y: prevEC.y },
        },
      }));
    }, 16); // 60 FPS

    return () => {
      clearInterval(updateInterval);
    };
  }, [baseSpeed, targetParticles, executiveCoordinator]);

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBaseSpeed(parseFloat(event.target.value));
  };

  const handleTargetParticlesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetParticles(parseInt(event.target.value));
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
        {/* Render Executive Coordinator */}
        <circle
          cx={executiveCoordinator.x}
          cy={executiveCoordinator.y}
          r={executiveCoordinator.size / 2}
          fill={entityColors.EC}
          stroke="black"
          strokeWidth={1}
        />
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
        <div>Total Energy Created: {totalEnergyCreated}</div>
        <div>Stored Energy in Nexus: {amountOfStoredEnergyInNexus}</div>
        <div>Largest Reward Count: {largestRewardCount}</div>
        <h3>Executive Coordinator Knowledge:</h3>
        <div>Number of Converters: {executiveCoordinator.knownLocations.converters.length}</div>
        <div>Nexus Location: ({executiveCoordinator.knownLocations.nexus.x}, {executiveCoordinator.knownLocations.nexus.y})</div>
        <div>Self Location: ({executiveCoordinator.knownLocations.self.x}, {executiveCoordinator.knownLocations.self.y})</div>
      </InfoPanel>
    </SimulationContainer>
  );
};

export default WorldSimulation;