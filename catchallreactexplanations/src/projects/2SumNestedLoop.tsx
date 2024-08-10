import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

// Types
type NumberPair = [number, number] | null;

interface AppState {
  numbers: number[];
  target: number;
  currentI: number;
  currentJ: number;
  solution: NumberPair;
  isRunning: boolean;
  executionLog: string[];
  speed: number;
}

// Styled Components
const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const InputSection = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  margin-right: 10px;
  padding: 5px;
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

const VisualizationArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const NumberBox = styled.div<{ isHighlighted: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  background-color: ${props => props.isHighlighted ? '#ffc107' : 'white'};
`;

const ExecutionLog = styled.div`
  height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
`;

const SpeedControl = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const SpeedSlider = styled.input`
  margin-right: 10px;
`;

// Main App Component
const TwoSumNestedLoop: React.FC = () => {
  const [state, setState] = useState<AppState>({
    numbers: [],
    target: 0,
    currentI: 0,
    currentJ: 1,
    solution: null,
    isRunning: false,
    executionLog: [],
    speed: 1000, // Default speed: 1 second
  });

  const [inputNumbers, setInputNumbers] = useState('');
  const [inputTarget, setInputTarget] = useState('');

  const handleStart = () => {
    const numbers = inputNumbers.split(',').map(Number);
    const target = Number(inputTarget);
    setState({
      ...state,
      numbers,
      target,
      currentI: 0,
      currentJ: 1,
      solution: null,
      isRunning: true,
      executionLog: [],
    });
  };

  const handleStep = useCallback(() => {
    const { numbers, target, currentI, currentJ } = state;
    if (currentI >= numbers.length - 1) {
      setState(prevState => ({ ...prevState, isRunning: false, solution: null }));
      return;
    }

    const sum = numbers[currentI] + numbers[currentJ];
    const newLog = [...state.executionLog, `Comparing ${numbers[currentI]} + ${numbers[currentJ]} = ${sum}`];

    if (sum === target) {
      setState(prevState => ({
        ...prevState,
        solution: [currentI, currentJ],
        isRunning: false,
        executionLog: [...newLog, `Solution found: ${numbers[currentI]} + ${numbers[currentJ]} = ${target}`],
      }));
    } else if (currentJ < numbers.length - 1) {
      setState(prevState => ({
        ...prevState,
        currentJ: currentJ + 1,
        executionLog: newLog,
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        currentI: currentI + 1,
        currentJ: currentI + 2,
        executionLog: newLog,
      }));
    }
  }, [state]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.isRunning) {
      timer = setTimeout(handleStep, state.speed);
    }
    return () => clearTimeout(timer);
  }, [state.isRunning, state.currentI, state.currentJ, state.speed, handleStep]);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = Number(e.target.value);
    setState(prevState => ({ ...prevState, speed: newSpeed }));
  };

  return (
    <AppContainer>
      <Title>2Sum Problem Visualizer</Title>
      <InputSection>
        <Input
          type="text"
          value={inputNumbers}
          onChange={(e) => setInputNumbers(e.target.value)}
          placeholder="Enter numbers (comma-separated)"
        />
        <Input
          type="number"
          value={inputTarget}
          onChange={(e) => setInputTarget(e.target.value)}
          placeholder="Enter target sum"
        />
        <Button onClick={handleStart}>Start</Button>
        <Button onClick={handleStep} disabled={!state.isRunning}>Step</Button>
        <Button onClick={() => setState(prevState => ({ ...prevState, isRunning: !prevState.isRunning }))}>
          {state.isRunning ? 'Pause' : 'Play'}
        </Button>
      </InputSection>
      <SpeedControl>
        <SpeedSlider
          type="range"
          min="100"
          max="2000"
          step="100"
          value={state.speed}
          onChange={handleSpeedChange}
        />
        <span>Speed: {state.speed}ms</span>
      </SpeedControl>
      <VisualizationArea>
        {state.numbers.map((num, index) => (
          <NumberBox
            key={index}
            isHighlighted={index === state.currentI || index === state.currentJ}
          >
            {num}
          </NumberBox>
        ))}
      </VisualizationArea>
      <div>Target Sum: {state.target}</div>
      <div>Current Sum: {state.numbers[state.currentI] + state.numbers[state.currentJ]}</div>
      {state.solution && (
        <div>Solution Found: {state.numbers[state.solution[0]]} + {state.numbers[state.solution[1]]} = {state.target}</div>
      )}
      <ExecutionLog>
        {state.executionLog.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </ExecutionLog>
    </AppContainer>
  );
};

export default TwoSumNestedLoop;
