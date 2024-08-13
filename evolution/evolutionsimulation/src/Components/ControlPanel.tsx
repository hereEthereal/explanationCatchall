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