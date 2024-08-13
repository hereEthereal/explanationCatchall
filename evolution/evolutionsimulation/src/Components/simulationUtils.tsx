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