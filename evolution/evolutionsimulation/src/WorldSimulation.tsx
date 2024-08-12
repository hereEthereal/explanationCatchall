import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

interface LightParticle {
  x: number;
  y: number;
  speed: number;
  angle: number;
}

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

const Canvas = styled.canvas`
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

const WorldSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<LightParticle[]>([]);
  const [baseSpeed, setBaseSpeed] = useState<number>(1);
  const [spawnRate, setSpawnRate] = useState<number>(1);

  const canvasWidth = 800;
  const canvasHeight = 600;
  
  // Energy Nexus (EN) configuration
  const enWidth = 100;
  const enHeight = 80;
  const enX = canvasWidth / 2 - enWidth / 2; // Centered horizontally
  const enY = Math.floor(canvasHeight * 2 / 3); // Positioned 2/3 down the screen

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw EN
      ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
      ctx.fillRect(enX, enY, enWidth, enHeight);
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
      ctx.lineWidth = 2;
      ctx.strokeRect(enX, enY, enWidth, enHeight);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Remove particle if it's inside the EN or out of bounds
        return !(
          particle.x >= enX &&
          particle.x <= enX + enWidth &&
          particle.y >= enY &&
          particle.y <= enY + enHeight
        ) && (
          particle.x >= 0 &&
          particle.x <= canvasWidth &&
          particle.y >= 0 &&
          particle.y <= canvasHeight
        );
      });

      console.log(`Particles: ${particlesRef.current.length}`);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const spawnInterval = setInterval(() => {
      for (let i = 0; i < spawnRate; i++) {
        const newParticle: LightParticle = {
          x: Math.random() * canvasWidth,
          y: 0,
          speed: baseSpeed + Math.random() * baseSpeed,
          angle: Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 4),
        };

        particlesRef.current.push(newParticle);
      }
      console.log(`Spawned ${spawnRate} particles`);
    }, 1000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(spawnInterval);
    };
  }, [baseSpeed, spawnRate]);

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBaseSpeed(parseFloat(event.target.value));
  };

  const handleSpawnRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpawnRate(parseInt(event.target.value));
  };

  return (
    <SimulationContainer>
      <Title>World Simulation</Title>
      <Canvas 
        ref={canvasRef} 
        width={canvasWidth} 
        height={canvasHeight} 
      />
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
    </SimulationContainer>
  );
};

export default WorldSimulation;