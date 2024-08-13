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
    initializeMovers(20, canvasWidth, canvasHeight)
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
    let usableEnergyId = 0;

    const updateInterval = setInterval(() => {
      setParticles(prevParticles => updateParticles(prevParticles, targetParticles, baseSpeed));
      
      const conversionResult = handleConversion(particles, entityConverters, usableEnergyId);
      setEntityConverters(conversionResult.updatedConverters);
      setUsableEnergy(prevEnergy => [...prevEnergy, ...conversionResult.newUsableEnergy]);
      setTotalEnergyCreated(prev => prev + conversionResult.newUsableEnergy.length);
      setAmountOfStoredEnergyInNexus(prev => prev + conversionResult.newEnergyInNexus);
      usableEnergyId += conversionResult.newUsableEnergy.length;

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