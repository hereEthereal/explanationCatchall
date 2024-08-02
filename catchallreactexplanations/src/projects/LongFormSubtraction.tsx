import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 5px 10px;
  font-size: 16px;
`;

const Button = styled.button<{ disabled?: boolean }>`
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${props => props.disabled ? '#ccc' : '#4CAF50'};
  color: white;
  border: none;
  border-radius: 4px;

  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : '#45a049'};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 30px);
  gap: 1px;
  background-color: #ccc;
  padding: 1px;
  margin-top: 20px;
`;

const Cell = styled.div`
  width: 30px;
  height: 30px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
`;

const Explanation = styled.div`
  margin-top: 20px;
  max-width: 400px;
  text-align: center;
`;

// Types
interface GridState {
  [key: number]: string[];
}

// LongFormSubtraction component
export const LongFormSubtraction: React.FC = () => {
  const [number1, setNumber1] = useState<number>(0);
  const [number2, setNumber2] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [gridState, setGridState] = useState<GridState>({});
  const [explanation, setExplanation] = useState<string>('');
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isBorrowing, setIsBorrowing] = useState<boolean>(false);
  const [borrowFrom, setBorrowFrom] = useState<number>(-1);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const maxDigits = 7;

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGridState: GridState = {};
    for (let i = 0; i < 7; i++) {
      newGridState[i] = Array(8).fill('_');
    }
    setGridState(newGridState);
  };

  const start = () => {
    if (isNaN(number1) || isNaN(number2) || number1 < number2) {
      alert('Please enter valid numbers. Number 1 should be greater than Number 2.');
      return;
    }

    setCurrentStep(0);
    setIsComplete(false);
    initializeGrid();
    populateInitialNumbers();
    setIsStarted(true);
    setExplanation('Initial setup complete. Click "Step" to begin subtraction.');
  };

  const populateInitialNumbers = () => {
    const num1Str = number1.toString().padStart(maxDigits, ' ');
    const num2Str = number2.toString().padStart(maxDigits, ' ');

    setGridState(prevState => {
      const newState = { ...prevState };
      for (let i = 0; i < maxDigits; i++) {
        newState[2][i + 1] = num1Str[i] === ' ' ? '_' : num1Str[i];
        newState[3][i + 1] = num2Str[i] === ' ' ? '_' : num2Str[i];
      }
      return newState;
    });
  };


  const step = () => {
    if (isComplete) {
      return;
    }

    const currentColumn = maxDigits - currentStep;

    // Check if the subtraction is complete
    const resultArray = Object.values(gridState[4] || {}).filter(val => val !== '_');
    const currentResult = resultArray.length > 0 ? parseInt(resultArray.join('')) : NaN;
    
    if (currentStep >= maxDigits || (number1 - number2 === currentResult && !isNaN(currentResult))) {
      setExplanation('Subtraction complete!');
      setIsStarted(false);
      setIsComplete(true);
      return;
    }

    let upperDigit = parseInt(gridState[2][currentColumn]);
    const lowerDigit = parseInt(gridState[3][currentColumn]);

    if (isBorrowing) {
      const result = (upperDigit + 10) - lowerDigit;
      setGridState(prevState => ({
        ...prevState,
        4: {
          ...prevState[4],
          [currentColumn]: result.toString()
        }
      }));
      setExplanation(`Step ${currentStep + 1}: Subtracting ${lowerDigit} from ${upperDigit + 10} in the ${getPositionName(currentStep)} column. Result: ${result}`);
      setIsBorrowing(false);
      setCurrentStep(prevStep => prevStep + 1);
    } else if (upperDigit < lowerDigit) {
      let newBorrowFrom = currentColumn - 1;
      const newGridState = { ...gridState };
      while (newBorrowFrom > 0 && newGridState[2][newBorrowFrom] === '0') {
        newGridState[2][newBorrowFrom] = '9';
        newBorrowFrom--;
      }
      if (newBorrowFrom > 0) {
        newGridState[2][newBorrowFrom] = (parseInt(newGridState[2][newBorrowFrom]) - 1).toString();
        newGridState[1][currentColumn] = '1';
        setGridState(newGridState);
        setBorrowFrom(newBorrowFrom);
        setExplanation(`Step ${currentStep + 1}: Borrowing 10 from the ${getPositionName(currentStep - 1)} column for the ${getPositionName(currentStep)} column.`);
        setIsBorrowing(true);
      }
    } else {
      const result = upperDigit - lowerDigit;
      setGridState(prevState => ({
        ...prevState,
        4: {
          ...prevState[4],
          [currentColumn]: result.toString()
        }
      }));
      setExplanation(`Step ${currentStep + 1}: Subtracting ${lowerDigit} from ${upperDigit} in the ${getPositionName(currentStep)} column. Result: ${result}`);
      setCurrentStep(prevStep => prevStep + 1);
    }
  };


  const getPositionName = (step: number): string => {
    const positions = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];
    return positions[step] || '';
  };

  const reset = () => {
    initializeGrid();
    setNumber1(0);
    setNumber2(0);
    setCurrentStep(0);
    setIsStarted(false);
    setIsBorrowing(false);
    setBorrowFrom(-1);
    setExplanation('');
    setIsComplete(false);
  };

  const randomize = () => {
    const min = 1000;
    const max = 9999;
    const randomNum1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const randomNum2 = Math.floor(Math.random() * (randomNum1 - min + 1)) + min;
    setNumber1(randomNum1);
    setNumber2(randomNum2);
  };

  return (
    <Container>
      <Title>Long Form Subtraction</Title>
      <InputContainer>
        <Input
          type="number"
          value={number1}
          onChange={(e) => setNumber1(parseInt(e.target.value))}
          placeholder="Number 1"
        />
        <Input
          type="number"
          value={number2}
          onChange={(e) => setNumber2(parseInt(e.target.value))}
          placeholder="Number 2"
        />
        <Button onClick={randomize} disabled={isStarted}>
          Randomize
        </Button>
        <Button onClick={start} disabled={isStarted}>
          Start
        </Button>
        <Button onClick={step} disabled={!isStarted || isComplete}>
          Step
        </Button>
        <Button onClick={reset}>
          Reset
        </Button>
      </InputContainer>
      <Grid>
        {[0, 1, 2, 3, 4, 5, 6].map(row =>
          [0, 1, 2, 3, 4, 5, 6, 7].map(col => (
            <Cell key={`${row}-${col}`}>
              {gridState[row] && gridState[row][col] ? gridState[row][col] : ''}
            </Cell>
          ))
        )}
      </Grid>
      <Explanation>{explanation}</Explanation>
    </Container>
  );
};