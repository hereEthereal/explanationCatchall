import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import TwoSumNestedLoop from "./2SumNestedLoop"
import TwoSumEfficientVisualizer from './TwoSumEfficientVisualizer';
import TwoSumSortedPointerVisualizer from './TwoSumSortedPointerVisualizer';

const WrapperContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
`;

const InputArea = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Input = styled.input`
  padding: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ControlsArea = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const SpeedControl = styled.div`
  display: flex;
  align-items: center;
`;

const SpeedSlider = styled.input`
  margin-right: 10px;
`;

const VisualizersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const TwoSumWrapper: React.FC = () => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [inputNumbers, setInputNumbers] = useState('23, 7, 42, 15, 31, 9, 48, 3, 36, 19, 11, 27, 4, 39, 16, 45, 50, 8, 33, 21, 47, 13, 29, 6,60, 41, 18, 2, 37, 25, 10');
  const [inputTarget, setInputTarget] = useState('110')
  const [isStartButtonPressed, setIsStartButtonPressed] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const handleSubmit = () => {
    const newNumbers = inputNumbers.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    const newTarget = parseInt(inputTarget);
    
    if (newNumbers.length < 2) {
      alert("Please enter at least two numbers.");
      return;
    }
    
    if (isNaN(newTarget)) {
      alert("Please enter a valid target number.");
      return;
    }
    
    setNumbers(newNumbers);
    setTarget(newTarget);
    setIsStartButtonPressed(false);
  };

  const togglePlay = () => {
    setIsStartButtonPressed(prev => !prev);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(e.target.value));
  };

  return (
    <WrapperContainer>
      <Title>Two Sum Visualizer</Title>
      <InputArea>
        <Input 
          type="text" 
          placeholder="Enter numbers (comma-separated)" 
          value={inputNumbers} 
          onChange={(e) => setInputNumbers(e.target.value)}
        />
        <Input 
          type="number" 
          placeholder="Enter target" 
          value={inputTarget} 
          onChange={(e) => setInputTarget(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </InputArea>
      <ControlsArea>
        <Button onClick={togglePlay}>
          {isStartButtonPressed ? 'Reset' : 'Start'}
        </Button>
        <SpeedControl>
          <SpeedSlider
            type="range"
            min="10"
            max="2000"
            step="100"
            value={speed}
            onChange={handleSpeedChange}
          />
          <span>Speed: {speed}ms</span>
        </SpeedControl>
      </ControlsArea>
      <VisualizersContainer>
        <TwoSumNestedLoop 
          key={`brute-${numbers.join(',')}-${target}`}
          numbers={numbers} 
          target={target}
          isStartButtonPressed={isStartButtonPressed}
          speed={speed}
        />
        <TwoSumEfficientVisualizer 
          key={`efficient-${numbers.join(',')}-${target}`}
          numbers={numbers} 
          target={target}
          isStartButtonPressed={isStartButtonPressed}
          speed={speed}
        />
        <TwoSumSortedPointerVisualizer 
          key={`sorted-${numbers.join(',')}-${target}`}
          numbers={numbers} 
          target={target}
          isStartButtonPressed={isStartButtonPressed}
          speed={speed}
        />
      </VisualizersContainer>
    </WrapperContainer>
  );
};

export default TwoSumWrapper;