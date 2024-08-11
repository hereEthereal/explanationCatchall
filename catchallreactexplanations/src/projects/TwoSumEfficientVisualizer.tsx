import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

interface VisualizerProps {
  numbers: number[];
  target: number;
  isStartButtonPressed: boolean;
  speed: number
}

const Container = styled.div`
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
`;

const VisualizationArea = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ArrayView = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-content: flex-start;
  width: 70%;
`;

const NumberBox = styled.div<{ isHighlighted: boolean; isFound: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  background-color: ${props => 
    props.isFound ? '#4caf50' : 
    props.isHighlighted ? '#ffc107' : 'white'};
`;

const MapView = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  width: 25%;
  max-height: 300px;
  overflow-y: auto;
`;

const SpeedControl = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const SpeedSlider = styled.input`
  margin-right: 10px;
`;

const TwoSumEfficientVisualizer: React.FC<VisualizerProps> = ({ numbers, target, isStartButtonPressed, speed }) => {
  const [state, setState] = useState({
    currentIndex: 0,
    numMap: new Map<number, number>(),
    solution: null as [number, number] | null,
    isComplete: false,
    executionLog: [] as string[]
  });
  const [foo, setSpeed] = useState(1000); // Default speed: 1 second
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isStartButtonPressedRef = useRef(isStartButtonPressed);

  const reset = useCallback(() => {
    setState({
      currentIndex: 0,
      numMap: new Map(),
      solution: null,
      isComplete: false,
      executionLog: []
    });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    reset();
  }, [numbers, target, reset]);

  const step = useCallback(() => {
    setState(prevState => {
      const { currentIndex, numMap, executionLog } = prevState;
      
      if (currentIndex >= numbers.length) {
        return { 
          ...prevState, 
          isComplete: true,
          executionLog: [...executionLog, "No solution found"]
        };
      }

      const complement = target - numbers[currentIndex];
      const newLog = [...executionLog, `Checking if ${complement} exists in the map`];
      
      if (numMap.has(complement)) {
        return {
          ...prevState,
          solution: [numMap.get(complement)!, currentIndex],
          isComplete: true,
          executionLog: [...newLog, `Solution found: ${numbers[numMap.get(complement)!]} + ${numbers[currentIndex]} = ${target}`]
        };
      } else {
        const updatedMap = new Map(numMap);
        updatedMap.set(numbers[currentIndex], currentIndex);
        return {
          ...prevState,
          currentIndex: currentIndex + 1,
          numMap: updatedMap,
          executionLog: [...newLog, `Added ${numbers[currentIndex]} to the map`]
        };
      }
    });
  }, [numbers, target]);

  useEffect(() => {
    if (isStartButtonPressed && !isStartButtonPressedRef.current) {
      isStartButtonPressedRef.current = true;
      reset();
      setState(prev => ({ ...prev, isComplete: false }));
    } else if (!isStartButtonPressed) {
      isStartButtonPressedRef.current = false;
    }
  }, [isStartButtonPressed, reset]);

  useEffect(() => {
    if (isStartButtonPressed && !state.isComplete) {
      timeoutRef.current = setTimeout(() => {
        step();
      }, speed);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isStartButtonPressed, state, speed, step]);

  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(e.target.value));
  }, []);

  return (
    <Container>
      <Title>Efficient 2Sum Algorithm Visualizer</Title>
      <p>Target: {target}</p>
      <VisualizationArea>
        <ArrayView>
          {numbers.map((num, index) => (
            <NumberBox 
              key={index}
              isHighlighted={index === state.currentIndex}
              isFound={state.solution?.includes(index) || false}
            >
              {num}
            </NumberBox>
          ))}
        </ArrayView>
        <MapView>
          <h3>Number Map</h3>
          {Array.from(state.numMap).map(([key, value]) => (
            <div key={key}>{key}: {value}</div>
          ))}
        </MapView>
      </VisualizationArea>
      <SpeedControl>
        <SpeedSlider
          type="range"
          min="100"
          max="2000"
          step="100"
          value={speed}
          onChange={handleSpeedChange}
        />
        <span>Speed: {speed}ms</span>
      </SpeedControl>
      {state.solution && (
        <p>Solution found: {numbers[state.solution[0]]} + {numbers[state.solution[1]]} = {target}</p>
      )}
      {state.isComplete && !state.solution && (
        <p>No solution found</p>
      )}
    </Container>
  );
};

export default TwoSumEfficientVisualizer;