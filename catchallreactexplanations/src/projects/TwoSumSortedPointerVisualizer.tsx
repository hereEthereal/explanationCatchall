import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

interface VisualizerProps {
  numbers: number[];
  target: number;
  isStartButtonPressed: boolean;
  speed: number;
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
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const ArrayView = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const NumberBox = styled.div<{ isSmall: boolean; isLarge: boolean; isFound: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  background-color: ${props => 
    props.isFound ? '#4caf50' : 
    props.isSmall ? '#ffc107' : 
    props.isLarge ? '#ff9800' : 'white'};
`;

const PointerView = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

const Pointer = styled.div`
  font-weight: bold;
`;

const WarningMessage = styled.div`
  color: orange;
  margin-bottom: 10px;
`;

const SpeedControl = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const SpeedSlider = styled.input`
  margin-right: 10px;
`;

const TwoSumSortedPointerVisualizer: React.FC<VisualizerProps> = ({ numbers: initialNumbers, target, isStartButtonPressed, speed }) => {
  const [state, setState] = useState({
    numbers: [] as number[],
    smallIdx: 0,
    largeIdx: 0,
    solution: null as [number, number] | null,
    isComplete: false,
    warning: null as string | null,
    executionLog: [] as string[]
  });
  const [foo, setSpeed] = useState(1000);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isStartButtonPressedRef = useRef(isStartButtonPressed);

  const sortNumbers = useCallback((nums: number[]) => {
    const sorted = [...nums].sort((a, b) => a - b);
    if (JSON.stringify(sorted) !== JSON.stringify(nums)) {
      return { sorted, warning: "Note: The input array has been sorted for the algorithm to work correctly." };
    }
    return { sorted, warning: null };
  }, []);

  const reset = useCallback(() => {
    const { sorted, warning } = sortNumbers(initialNumbers);
    setState({
      numbers: sorted,
      smallIdx: 0,
      largeIdx: sorted.length - 1,
      solution: null,
      isComplete: false,
      warning,
      executionLog: []
    });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [initialNumbers, sortNumbers]);

  useEffect(() => {
    reset();
  }, [initialNumbers, target, reset]);

  const step = useCallback(() => {
    setState(prevState => {
      const { numbers, smallIdx, largeIdx, executionLog } = prevState;
      
      if (smallIdx >= largeIdx) {
        return { 
          ...prevState, 
          isComplete: true,
          executionLog: [...executionLog, "No solution found"]
        };
      }

      const sum = numbers[smallIdx] + numbers[largeIdx];
      const newLog = [...executionLog, `Comparing ${numbers[smallIdx]} + ${numbers[largeIdx]} = ${sum}`];
      
      if (sum === target) {
        return {
          ...prevState,
          solution: [smallIdx, largeIdx],
          isComplete: true,
          executionLog: [...newLog, `Solution found: ${numbers[smallIdx]} + ${numbers[largeIdx]} = ${target}`]
        };
      } else if (sum < target) {
        return {
          ...prevState,
          smallIdx: smallIdx + 1,
          executionLog: [...newLog, `Sum is too small, moving small pointer to ${smallIdx + 1}`]
        };
      } else {
        return {
          ...prevState,
          largeIdx: largeIdx - 1,
          executionLog: [...newLog, `Sum is too large, moving large pointer to ${largeIdx - 1}`]
        };
      }
    });
  }, [target]);

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

  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(e.target.value));
  }, []);

  return (
    <Container>
      <Title>Two Sum Sorted Pointer Visualizer</Title>
      <p>Target: {target}</p>
      {state.warning && <WarningMessage>{state.warning}</WarningMessage>}
      <VisualizationArea>
        <ArrayView>
          {state.numbers.map((num, index) => (
            <NumberBox 
              key={index}
              isSmall={index === state.smallIdx}
              isLarge={index === state.largeIdx}
              isFound={state.solution?.includes(index) || false}
            >
              {num}
            </NumberBox>
          ))}
        </ArrayView>
        <PointerView>
          <Pointer>Small: {state.smallIdx}</Pointer>
          <Pointer>Large: {state.largeIdx}</Pointer>
        </PointerView>
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
      <div>Current Sum: {state.numbers[state.smallIdx] + state.numbers[state.largeIdx]}</div>
      {/* <div>
        <h3>Execution Log:</h3>
        {state.executionLog.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div> */}
      {state.solution && (
        <p>Solution found: {state.numbers[state.solution[0]]} + {state.numbers[state.solution[1]]} = {target}</p>
      )}
      {state.isComplete && !state.solution && (
        <p>No solution found</p>
      )}
    </Container>
  );
};

export default TwoSumSortedPointerVisualizer;