export interface LightParticle {
    x: number;
    y: number;
    speed: number;
    angle: number;
  }
  
  export interface UsableEnergy {
    id: number;
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
  
  export const handleConversion = (
    particles: LightParticle[],
    entityConverters: EntityConverterProps[],
    usableEnergyId: number
  ) => {
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
          const newEnergy = {
            id: usableEnergyId++,
            x: converter.x + converter.size + ENERGY_SIZE / 2,
            y: converter.y,
          };
          newUsableEnergy.push(newEnergy);
  
          // Check if the new energy is in the Nexus area
          const nexusX = canvasWidth / 2 - NEXUS_WIDTH / 2;
          const nexusY = (canvasHeight * 2) / 3 - NEXUS_HEIGHT / 2;
          if (
            newEnergy.x >= nexusX &&
            newEnergy.x <= nexusX + NEXUS_WIDTH &&
            newEnergy.y >= nexusY &&
            newEnergy.y <= nexusY + NEXUS_HEIGHT
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