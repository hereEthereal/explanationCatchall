import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

interface TwoSumProps {
  numbers: number[];
  target: number;
  isStartButtonPressed: boolean;
  speed: number;
}

type NumberPair = [number, number] | null;

interface VisualizationState {
  currentI: number;
  currentJ: number;
  solution: NumberPair;
  isComplete: boolean;
  executionLog: string[];
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
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

const TwoSumNestedLoop: React.FC<TwoSumProps> = ({ numbers, target, isStartButtonPressed, speed }) => {
  const [state, setState] = useState<VisualizationState>({
    currentI: 0,
    currentJ: 1,
    solution: null,
    isComplete: false,
    executionLog: [],
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isStartButtonPressedRef = useRef(isStartButtonPressed);

  const reset = useCallback(() => {
    setState({
      currentI: 0,
      currentJ: 1,
      solution: null,
      isComplete: false,
      executionLog: [],
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
      const { currentI, currentJ, executionLog } = prevState;
      
      if (currentI >= numbers.length - 1) {
        return { 
          ...prevState, 
          solution: null, 
          isComplete: true,
          executionLog: [...executionLog, "No solution found"] 
        };
      }

      const sum = numbers[currentI] + numbers[currentJ];
      const newLog = [...executionLog, `Comparing ${numbers[currentI]} + ${numbers[currentJ]} = ${sum}`];

      if (sum === target) {
        return {
          ...prevState,
          solution: [currentI, currentJ],
          isComplete: true,
          executionLog: [...newLog, `Solution found: ${numbers[currentI]} + ${numbers[currentJ]} = ${target}`],
        };
      } else if (currentJ < numbers.length - 1) {
        return {
          ...prevState,
          currentJ: currentJ + 1,
          executionLog: newLog,
        };
      } else {
        return {
          ...prevState,
          currentI: currentI + 1,
          currentJ: currentI + 2,
          executionLog: newLog,
        };
      }
    });
  }, [numbers, target]);

  useEffect(() => {
    if (isStartButtonPressed && !isStartButtonPressedRef.current) {
      isStartButtonPressedRef.current = true;
      reset();
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

  return (
    <Container>
      <Title>Two Sum Nested Loop Visualizer</Title>
      <p>Target: {target}</p>
      <VisualizationArea>
        {numbers.map((num, index) => (
          <NumberBox
            key={index}
            isHighlighted={index === state.currentI || index === state.currentJ}
          >
            {num}
          </NumberBox>
        ))}
      </VisualizationArea>
      <div>Current Sum: {numbers[state.currentI] + numbers[state.currentJ]}</div>
      {state.solution && (
        <div>Solution Found: {numbers[state.solution[0]]} + {numbers[state.solution[1]]} = {target}</div>
      )}
      {/* <ExecutionLog>
        {state.executionLog.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </ExecutionLog> */}
      {state.isComplete && !state.solution && (
        <p>No solution found</p>
      )}
    </Container>
  );
};

export default TwoSumNestedLoop;