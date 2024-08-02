import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
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

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(5px); }
  50% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
  100% { transform: translateX(0); }
`;

const wiggle = keyframes`
  0% { transform: translateY(0); }
  25% { transform: translateY(-5px); }
  75% { transform: translateY(5px); }
  100% { transform: translateY(0); }
`;

const thinking = keyframes`
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
`;

const moveRight = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(30px); }
`;

const AnimatedCell = styled.div<{ 
    animate: 'shake' | 'wiggle' | 'none';
    isRed: boolean;
    isBlue: boolean;
    isYellow: boolean;
    isBorrowing: boolean;
  }>`
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    ${props => {
      switch(props.animate) {
        case 'shake':
          return css`animation: ${shake} 0.5s;`;
        case 'wiggle':
          return css`animation: ${wiggle} 0.5s;`;
        default:
          return 'animation: none;';
      }
    }}
    background-color: ${props => {
      if (props.isRed) return '#ffcccc';
      if (props.isBlue) return '#ccccff';
      if (props.isYellow) return '#ffffcc';
      return 'white';
    }};
    transition: background-color 0.3s;
    position: relative;
  
    ${props => props.isBorrowing && css`
      &::after {
        content: '1';
        position: absolute;
        top: -15px;
        right: -15px;
        font-size: 12px;
        animation: ${moveRight} 0.5s forwards;
      }
    `}
  `;
  
const Explanation = styled.div`
  margin-top: 20px;
  max-width: 400px;
  text-align: center;
`;

const ThinkingDot = styled.span<{ delay: number }>`
  animation: ${thinking} 1s infinite;
  animation-delay: ${props => props.delay}s;
`;

const ThinkingContainer = styled.div`
  font-size: 24px;
  margin-top: 10px;
`;

interface GridState {
  [key: number]: string[];
}

export const LongFormSubtraction: React.FC = () => {
  const [number1, setNumber1] = useState<number>(0);
  const [number2, setNumber2] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [gridState, setGridState] = useState<GridState>({});
  const [explanation, setExplanation] = useState<string>('');
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [animateCells, setAnimateCells] = useState<{ [key: string]: 'shake' | 'wiggle' | 'none' }>({});
  const [highlightCells, setHighlightCells] = useState<{ [key: string]: 'red' | 'blue' | 'yellow' | 'none' }>({});
  const [showMinus, setShowMinus] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [borrowingFrom, setBorrowingFrom] = useState<number | null>(null);
  const [borrowingTo, setBorrowingTo] = useState<number | null>(null);

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
    console.log('Starting subtraction...');
    console.log(`Number 1 - number2: ${number1} - ${number2} = ${number1 - number2}`);
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

  const animateStep = async (column: number) => {
    // Highlight and wiggle the current column
    setAnimateCells({
      [`2-${column}`]: 'wiggle',
      [`3-${column}`]: 'wiggle'
    });
    setHighlightCells({
      [`2-${column}`]: 'blue',
      [`3-${column}`]: 'blue'
    });
    await new Promise(resolve => setTimeout(resolve, 150));

    // Show minus sign
    setShowMinus(true);
    await new Promise(resolve => setTimeout(resolve, 150));

    // Start "thinking" animation
    setIsThinking(true);
    await new Promise(resolve => setTimeout(resolve, 150));

    // Stop "thinking" animation
    setIsThinking(false);

    // Perform subtraction
    let upperDigit = parseInt(gridState[2][column]);
    const lowerDigit = parseInt(gridState[3][column]);

    if (upperDigit < lowerDigit) {
      // Shake and turn red if borrowing is needed
      setAnimateCells({
        [`2-${column}`]: 'shake',
        [`3-${column}`]: 'shake'
      });
      setHighlightCells({
        [`2-${column}`]: 'red',
        [`3-${column}`]: 'red'
      });
      await new Promise(resolve => setTimeout(resolve, 400));

      // Perform borrowing
      let newBorrowFrom = column - 1;
      const newGridState = { ...gridState };
      while (newBorrowFrom > 0 && newGridState[2][newBorrowFrom] === '0') {
        newGridState[2][newBorrowFrom] = '9';
        newBorrowFrom--;
      }
      if (newBorrowFrom > 0) {
        // Highlight the cell we're borrowing from
        setHighlightCells(prev => ({
          ...prev,
          [`2-${newBorrowFrom}`]: 'yellow'
        }));
        await new Promise(resolve => setTimeout(resolve, 400));

        // Decrement the borrowed-from cell
        const originalValue = parseInt(newGridState[2][newBorrowFrom]);
        newGridState[2][newBorrowFrom] = (originalValue - 1).toString();
        setGridState(newGridState);
        await new Promise(resolve => setTimeout(resolve, 400));

        // Animate the borrowing
        setBorrowingFrom(newBorrowFrom);
        setBorrowingTo(column);
        await new Promise(resolve => setTimeout(resolve, 400));

        // Update the borrowing column
        newGridState[1][column] = '1';
        setGridState(newGridState);
        setExplanation(`Borrowing 10 from the ${getPositionName(currentStep - 1)} column for the ${getPositionName(currentStep)} column.`);
        upperDigit += 10;

        // Reset borrowing animation
        setBorrowingFrom(null);
        setBorrowingTo(null);
      }
    }

    // Perform subtraction and update grid
    const result = upperDigit - lowerDigit;
    setGridState(prevState => ({
      ...prevState,
      4: {
        ...prevState[4],
        [column]: result.toString()
      }
    }));
    setExplanation(`Subtracting ${lowerDigit} from ${upperDigit} in the ${getPositionName(currentStep)} column. Result: ${result}`);

    // Reset animations and highlights
    setAnimateCells({});
    setHighlightCells({});
    setShowMinus(false);
    setCurrentStep(prevStep => prevStep + 1);
  };

  const step = async () => {
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

    await animateStep(currentColumn);
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
    setExplanation('');
    setIsComplete(false);
    setAnimateCells({});
    setHighlightCells({});
    setShowMinus(false);
    setIsThinking(false);
    setBorrowingFrom(null);
    setBorrowingTo(null);
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
            <AnimatedCell
              key={`${row}-${col}`}
              animate={animateCells[`${row}-${col}`] || 'none'}
              isRed={highlightCells[`${row}-${col}`] === 'red'}
              isBlue={highlightCells[`${row}-${col}`] === 'blue'}
              isYellow={highlightCells[`${row}-${col}`] === 'yellow'}
              isBorrowing={borrowingFrom === col && row === 2}
            >
              {row === 3 && col === maxDigits - currentStep && showMinus ? '-' : ''}
              {gridState[row] && gridState[row][col] ? gridState[row][col] : ''}
            </AnimatedCell>
          ))
        )}
      </Grid>
      {isThinking && (
        <ThinkingContainer>
          <ThinkingDot delay={0}>.</ThinkingDot>
          <ThinkingDot delay={0.2}>.</ThinkingDot>
          <ThinkingDot delay={0.4}>.</ThinkingDot>
        </ThinkingContainer>
      )}
      <Explanation>{explanation}</Explanation>
    </Container>
  );
};