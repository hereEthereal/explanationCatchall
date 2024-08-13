```tsx
// Handle conversion process
setUsableEnergy((prevUsableEnergy) => {
  const newUsableEnergy = [...prevUsableEnergy];
  const remainingParticles = updatedParticles.filter((particle) => {
    for (const converter of entityConverters) {
      const distance = Math.sqrt(
        Math.pow(converter.x - particle.x, 2) +
        Math.pow(converter.y - particle.y, 2)
      );
      if (distance <= converter.size / 2) {
        const nextPosition = getNextEnergyPosition(converter, newUsableEnergy);
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

  setParticles(remainingParticles);
  return newUsableEnergy;
});
```
