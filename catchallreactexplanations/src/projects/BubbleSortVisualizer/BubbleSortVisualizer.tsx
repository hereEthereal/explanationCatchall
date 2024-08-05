import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

interface BubbleSortVisualizerProps {
  initialArray?: number[];
  speed?: number;
}

const BubbleSortVisualizer: React.FC<BubbleSortVisualizerProps> = ({
  initialArray = [],
  speed = 500,
}) => {
  const [array, setArray] = useState<number[]>(initialArray);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappedIndices, setSwappedIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSorted, setIsSorted] = useState<boolean>(false);

  const generateRandomArray = useCallback((length: number = 10) => {
    const newArray = Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    setCurrentStep(0);
    setComparingIndices([]);
    setSwappedIndices([]);
    setSortedIndices([]);
    setIsSorted(false);
  }, []);

  useEffect(() => {
    if (initialArray.length === 0) {
      generateRandomArray();
    }
  }, [initialArray, generateRandomArray]);

  const bubbleSort = useCallback(() => {
    const sortedArray = [...array];
    const steps: { array: number[]; comparing: number[]; swapped: number[]; sorted: number[] }[] = [];

    for (let i = 0; i < sortedArray.length; i++) {
      for (let j = 0; j < sortedArray.length - i - 1; j++) {
        steps.push({ array: [...sortedArray], comparing: [j, j + 1], swapped: [], sorted: [] });

        if (sortedArray[j] > sortedArray[j + 1]) {
          [sortedArray[j], sortedArray[j + 1]] = [sortedArray[j + 1], sortedArray[j]];
          steps.push({ array: [...sortedArray], comparing: [], swapped: [j, j + 1], sorted: [] });
        }
      }
      steps.push({ array: [...sortedArray], comparing: [], swapped: [], sorted: [sortedArray.length - 1 - i] });
    }

    return steps;
  }, [array]);

  const [sortingSteps, setSortingSteps] = useState<ReturnType<typeof bubbleSort>>([]);

  useEffect(() => {
    setSortingSteps(bubbleSort());
  }, [bubbleSort]);

  useEffect(() => {
    if (isPlaying && currentStep < sortingSteps.length) {
      const timer = setTimeout(() => {
        nextStep();
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep >= sortingSteps.length) {
      setIsPlaying(false);
      setIsSorted(true);
    }
  }, [isPlaying, currentStep, sortingSteps, speed]);

  const nextStep = () => {
    if (currentStep < sortingSteps.length) {
      const { array, comparing, swapped, sorted } = sortingSteps[currentStep];
      setArray(array);
      setComparingIndices(comparing);
      setSwappedIndices(swapped);
      setSortedIndices((prev) => Array.from(new Set([...prev, ...sorted])));
      setCurrentStep((prev) => prev + 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const reset = () => {
    generateRandomArray();
    setIsPlaying(false);
  };

  return (
    <Container>
      <ArrayContainer>
        {array.map((value, index) => (
          <ArrayBar
            key={index}
            height={value}
            isComparing={comparingIndices.includes(index)}
            isSwapped={swappedIndices.includes(index)}
            isSorted={sortedIndices.includes(index)}
          />
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
      <StepInfo>Step: {currentStep} / {sortingSteps.length}</StepInfo>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ArrayContainer = styled.div`
  display: flex;
  align-items: flex-end;
  height: 300px;
  margin-bottom: 20px;
`;

const ArrayBar = styled.div<{
  height: number;
  isComparing: boolean;
  isSwapped: boolean;
  isSorted: boolean;
}>`
  width: 30px;
  height: ${(props) => props.height * 3}px;
  margin: 0 2px;
  background-color: ${(props) =>
    props.isSorted
      ? '#4CAF50'
      : props.isComparing
      ? '#FFC107'
      : props.isSwapped
      ? '#F44336'
      : '#2196F3'};
  transition: height 0.3s ease, background-color 0.3s ease;
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
`;

const StepInfo = styled.div`
  font-size: 18px;
`;

export default BubbleSortVisualizer;