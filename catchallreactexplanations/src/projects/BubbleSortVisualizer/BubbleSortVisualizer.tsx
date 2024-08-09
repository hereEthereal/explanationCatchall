import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import AudioPlayerComponent from '../Audio/AudioPlayerWrapper';

interface BubbleSortVisualizerProps {
  initialArray?: number[];
  initialSpeed?: number;
}

type SortStep = {
  array: number[];
  comparing: number[];
  swapped: number[];
  sorted: number[];
  description: string;
};

const BubbleSortVisualizer: React.FC<BubbleSortVisualizerProps> = ({
  initialArray = [],
  initialSpeed = 500,
}) => {
  const [array, setArray] = useState<number[]>(initialArray);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [sortingSteps, setSortingSteps] = useState<SortStep[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(initialSpeed);

  const generateRandomArray = useCallback((length: number = 10) => {
    const newArray = Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    setCurrentStep(0);
    setIsSorted(false);
    return newArray;
  }, []);

  const bubbleSort = useCallback((arr: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const n = arr.length;
    let sortedCount = 0;

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          swapped: [],
          sorted: Array(sortedCount).fill(0).map((_, index) => n - 1 - index),
          description: `Comparing ${arr[j]} and ${arr[j + 1]}`
        });

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
          steps.push({
            array: [...arr],
            comparing: [],
            swapped: [j, j + 1],
            sorted: Array(sortedCount).fill(0).map((_, index) => n - 1 - index),
            description: `Swapped ${arr[j]} and ${arr[j + 1]}`
          });
        }
      }

      sortedCount++;

      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [],
        sorted: Array(sortedCount).fill(0).map((_, index) => n - 1 - index),
        description: `Element ${arr[n - 1 - i]} is now in its correct position`
      });

      if (!swapped) {
        break;
      }
    }

    return steps;
  }, []);

  useEffect(() => {
    const newArray = initialArray.length > 0 ? initialArray : generateRandomArray();
    setSortingSteps(bubbleSort(newArray));
  }, [initialArray, generateRandomArray, bubbleSort]);

  useEffect(() => {
    if (isPlaying && currentStep < sortingSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep >= sortingSteps.length) {
      setIsPlaying(false);
      setIsSorted(true);
    }
  }, [isPlaying, currentStep, sortingSteps, speed]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const nextStep = () => {
    if (currentStep < sortingSteps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const reset = () => {
    const newArray = generateRandomArray();
    setSortingSteps(bubbleSort(newArray));
    setCurrentStep(0);
    setIsPlaying(false);
    setIsSorted(false);
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(1000 - parseInt(event.target.value, 10));
  };

  const currentStepData = sortingSteps[currentStep] || {
    array: array,
    comparing: [],
    swapped: [],
    sorted: [],
    description: 'Ready to start sorting',
  };

  return (
    <Container>
      <Title>Bubble Sort Visualizer</Title>
      <ArrayContainer>
        {currentStepData.array.map((value, index) => (
          <BarWrapper key={index}>
            <ArrayBar
              height={value}
              isComparing={currentStepData.comparing.includes(index)}
              isSwapped={currentStepData.swapped.includes(index)}
              isSorted={currentStepData.sorted.includes(index)}
            >
              <BarLabel>{value}</BarLabel>
            </ArrayBar>
          </BarWrapper>
        ))}
      </ArrayContainer>
      <ControlPanel>
        <Button onClick={togglePlay} disabled={isSorted}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button onClick={nextStep} disabled={isPlaying || isSorted}>
          Next Step
        </Button>
        <Button onClick={reset}>Reset</Button>
      </ControlPanel>

      <SpeedControl>
        <label htmlFor="speed-slider">Speed: </label>
        <input
          id="speed-slider"
          type="range"
          min="1"
          max="990"
          value={1000 - speed}
          onChange={handleSpeedChange}
        />
      </SpeedControl>
      <AudioPlayerComponent filePath={"./bubbleSort.mp3"} buttonText={"explain"} />

      <StepInfo>Step: {currentStep + 1} / {sortingSteps.length}</StepInfo>
      <StepDescription>{currentStepData.description}</StepDescription>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const ArrayContainer = styled.div`
  display: flex;
  align-items: flex-end;
  height: 300px;
  margin-bottom: 20px;
  border-bottom: 2px solid #333;
  padding-bottom: 10px;
`;

const BarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 2px;
`;

const ArrayBar = styled.div<{
  height: number;
  isComparing: boolean;
  isSwapped: boolean;
  isSorted: boolean;
}>`
  width: 30px;
  height: ${(props) => props.height * 3}px;
  background-color: ${(props) =>
    props.isSorted
      ? '#4CAF50'
      : props.isComparing
      ? '#FFC107'
      : props.isSwapped
      ? '#F44336'
      : '#2196F3'};
  transition: height 0.3s ease, background-color 0.3s ease;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border-radius: 4px 4px 0 0;
`;

const BarLabel = styled.span`
  color: white;
  font-size: 12px;
  padding: 2px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const SpeedControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  input[type="range"] {
    width: 200px;
  }
`;

const StepInfo = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
`;

const StepDescription = styled.div`
  font-size: 16px;
  max-width: 600px;
  text-align: center;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
`;

export default BubbleSortVisualizer;