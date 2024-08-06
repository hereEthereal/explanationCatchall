import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const BarContainer = styled.div`
  display: flex;
  align-items: flex-end;
  height: 300px;
  margin-bottom: 20px;
`;

interface BarProps {
    height: number;
    isPivot: boolean;
    isI: boolean;
    isJ: boolean;
    isComparing: boolean;
    isSwapping: boolean;
  }
  
  const Bar = styled.div<BarProps>`
    flex: 1;
    background-color: ${(props) =>
      props.isPivot
        ? 'red'
        : props.isI
        ? 'blue'
        : props.isJ
        ? 'green'
        : props.isComparing
        ? 'yellow'
        : props.isSwapping
        ? 'purple'
        : 'gray'};
    margin: 0 1px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: ${(props) => props.height}%;
  `;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Button = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
`;

interface Step {
    array: number[];
    pivot: number;
    low: number;
    high: number;
    i: number;
    j: number;
    action: 'compare' | 'swap' | 'partition' | 'finish';
    description: string;
  }
  
  const QuicksortVisualizer: React.FC = () => {
    const [array, setArray] = useState<number[]>([]);
    const [steps, setSteps] = useState<Step[]>([]);
    const [currentStep, setCurrentStep] = useState<number>(0);
  
    useEffect(() => {
      generateRandomArray();
    }, []);
  
    const generateRandomArray = () => {
      const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
      setArray(newArray);
      setSteps([]);
      setCurrentStep(0);
      console.log('Generated new random array:', newArray);
    };
  
    const initializeQuicksort = () => {
      const newSteps: Step[] = [];
      quicksort([...array], 0, array.length - 1, newSteps);
      setSteps(newSteps);
      setCurrentStep(0);
      setArray([...newSteps[0].array]); // Set array to initial state
      console.log('Quicksort initialized. Total steps:', newSteps.length);
    };
  
    const quicksort = (arr: number[], low: number, high: number, steps: Step[]) => {
      if (low < high) {
        const pivotIndex = partition(arr, low, high, steps);
        quicksort(arr, low, pivotIndex - 1, steps);
        quicksort(arr, pivotIndex + 1, high, steps);
      } else if (low === high) {
        steps.push({
          array: [...arr],
          pivot: arr[low],
          low,
          high,
          i: low,
          j: high,
          action: 'finish',
          description: `Subarray [${low}, ${high}] is sorted.`
        });
      }
    };
  
    const partition = (arr: number[], low: number, high: number, steps: Step[]): number => {
      const pivot = arr[high];
      let i = low - 1;
  
      steps.push({
        array: [...arr],
        pivot,
        low,
        high,
        i,
        j: low,
        action: 'partition',
        description: `Start partitioning subarray [${low}, ${high}] with pivot ${pivot}`
      });
  
      for (let j = low; j < high; j++) {
        steps.push({
          array: [...arr],
          pivot,
          low,
          high,
          i,
          j,
          action: 'compare',
          description: `Compare arr[${j}] = ${arr[j]} with pivot ${pivot}`
        });
  
        if (arr[j] < pivot && i !== j) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            array: [...arr],
            pivot,
            low,
            high,
            i,
            j,
            action: 'swap',
            description: `${arr[i]} is less than pivot ${pivot}, so swap arr[${i}] = ${arr[i]} with arr[${j}] = ${arr[j]}`
          });
        }
      }
  
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      steps.push({
        array: [...arr],
        pivot,
        low,
        high,
        i: i + 1,
        j: high,
        action: 'swap',
        description: `Place pivot ${pivot} at its correct position (index ${i + 1})`
      });
  
      return i + 1;
    };
  
    const nextStep = () => {
      if (currentStep < steps.length - 1) {
        const nextStepIndex = currentStep + 1;
        setCurrentStep(nextStepIndex);
        setArray([...steps[nextStepIndex].array]);
        console.log(`Step ${nextStepIndex + 1}:`, steps[nextStepIndex].description);
      }
    };
  
    const prevStep = () => {
      if (currentStep > 0) {
        const prevStepIndex = currentStep - 1;
        setCurrentStep(prevStepIndex);
        setArray([...steps[prevStepIndex].array]);
        console.log(`Step ${prevStepIndex + 1}:`, steps[prevStepIndex].description);
      }
    };
  
    const currentStepData = steps[currentStep];
  
    return (
      <Container>
        <h1>Quicksort Visualizer</h1>
        <Controls>
          <Button onClick={generateRandomArray}>Generate New Array</Button>
          <Button onClick={initializeQuicksort}>Start Quicksort</Button>
          <Button onClick={prevStep} disabled={currentStep === 0}>
            Previous Step
          </Button>
          <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
            Next Step
          </Button>
        </Controls>
        <BarContainer>
          {array.map((value, index) => (
            <Bar
              key={index}
              height={(value / Math.max(...array)) * 100}
              isPivot={currentStepData && index === currentStepData.high}
              isI={currentStepData && index === currentStepData.i}
              isJ={currentStepData && index === currentStepData.j}
              isComparing={currentStepData && currentStepData.action === 'compare' && index === currentStepData.j}
              isSwapping={currentStepData && currentStepData.action === 'swap' && (index === currentStepData.i || index === currentStepData.j)}
            >
              {value}
            </Bar>
          ))}
        </BarContainer>
        <div>
          Step: {currentStep + 1} / {steps.length}
        </div>
        {currentStepData && (
          <div>
            <p><strong>Action:</strong> {currentStepData.action}</p>
            <p><strong>Explanation:</strong> {currentStepData.description}</p>
            <p><strong>Current subarray:</strong> [{currentStepData.low}, {currentStepData.high}]</p>
            <p><strong>Pivot:</strong> {currentStepData.pivot}</p>
            <p><strong>i:</strong> {currentStepData.i} (last position of elements smaller than pivot)</p>
            <p><strong>j:</strong> {currentStepData.j} (current element being compared)</p>
          </div>
        )}
      </Container>
    );
  };
  
  export default QuicksortVisualizer;