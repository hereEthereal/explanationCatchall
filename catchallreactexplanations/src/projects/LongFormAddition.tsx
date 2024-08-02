import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 40px);
  grid-template-rows: repeat(5, 40px);
  gap: 1px;
  background-color: #ccc;
  padding: 1px;
  margin-bottom: 20px;
`;

const GridCell = styled.div<{ highlight?: boolean; carry?: boolean }>`
  background-color: ${props => props.highlight ? '#ffff99' : 'white'};
  color: ${props => props.carry ? 'red' : 'black'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  user-select: none;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  font-size: 16px;
  padding: 5px 10px;
`;

const Button = styled.button`
  font-size: 16px;
  padding: 5px 10px;
`;

const TextArea = styled.textarea`
  width: 200px;
  height: 150px;
  resize: none;
  font-size: 16px;
  padding: 5px 10px;
`;

const ExplanationContainer = styled.div`
  max-width: 400px;
  text-align: center;
`;

const LongFormAddition: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>(Array(5).fill(Array(5).fill('')));
  const [number1, setNumber1] = useState<number>(0);
  const [number2, setNumber2] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [maxSteps, setMaxSteps] = useState<number>(0);
  const [explanation, setExplanation] = useState<string>('');
  const [textRepresentation, setTextRepresentation] = useState<string>('');

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInitialLabels();
  }, []);

  const setInitialLabels = () => {
    const labels = ['', 'c', '1', '2', 'a'];
    setGrid(prev => prev.map((row, i) => row.map((cell, j) => j === 0 ? labels[i] : cell)));
  };

  const start = () => {
    if (isNaN(number1) || isNaN(number2)) {
      alert('Please enter valid numbers');
      return;
    }
    reset();
    setNumbers();
    updateTextRepresentation();
  };

  const setNumbers = () => {
    const num1Str = number1.toString().padStart(4, '0');
    const num2Str = number2.toString().padStart(4, '0');
    setGrid(prev => prev.map((row, i) => {
      if (i === 2) return row.map((cell, j) => j > 0 ? num1Str[j-1] : cell);
      if (i === 3) return row.map((cell, j) => j > 0 ? num2Str[j-1] : cell);
      return row;
    }));
    setMaxSteps(4);
  };

  const step = () => {
    if (currentStep >= maxSteps) return;
    
    const col = 4 - currentStep;
    const num1 = parseInt(grid[2][col] || '0');
    const num2 = parseInt(grid[3][col] || '0');
    const carry = parseInt(grid[1][col] || '0');
    
    let sum = num1 + num2 + carry;
    let newCarry = 0;
    
    if (sum >= 10) {
      newCarry = 1;
      sum -= 10;
    }
    
    setGrid(prev => {
      const newGrid = [...prev.map(row => [...row])];
      newGrid[4][col] = sum.toString();
      if (col > 1) {
        newGrid[1][col-1] = newCarry.toString();
      }
      return newGrid;
    });
    
    highlightColumn(col);
    updateExplanation(col, num1, num2, carry, sum, newCarry);
    
    setCurrentStep(prev => prev + 1);
    updateTextRepresentation();
  };

  const highlightColumn = (col: number) => {
    if (gridRef.current) {
      const cells = gridRef.current.children;
      for (let i = 0; i < 5; i++) {
        cells[i * 5 + col].classList.add('highlight');
      }
    }
  };

  const updateExplanation = (col: number, num1: number, num2: number, carry: number, sum: number, newCarry: number) => {
    const placeValue = ['ones', 'tens', 'hundreds', 'thousands'][4 - col];
    let explanation = `Step ${currentStep + 1}: Adding ${placeValue}<br>`;
    explanation += `${num1} + ${num2} + ${carry} (carry) = ${sum + newCarry * 10}<br>`;
    if (newCarry) {
      explanation += `Write down ${sum} and carry ${newCarry} to the next column.`;
    } else {
      explanation += `Write down ${sum}.`;
    }
    setExplanation(explanation);
  };

  const reset = () => {
    setCurrentStep(0);
    setGrid(prev => prev.map((row, i) => row.map((cell, j) => i === 0 || j === 0 ? cell : '')));
    setExplanation('');
    updateTextRepresentation();
  };

  const updateTextRepresentation = () => {
    let text = `step ${currentStep}:\n`;
    for (let i = 0; i < 5; i++) {
      text += '|';
      for (let j = 0; j < 5; j++) {
        text += grid[i][j] || '_';
        text += '|';
      }
      text += '\n';
    }
    setTextRepresentation(text);
  };

  const copyText = () => {
    navigator.clipboard.writeText(textRepresentation);
  };

  const updateFromText = () => {
    const lines = textRepresentation.trim().split('\n');
    if (lines.length !== 6) {
      alert('Invalid text representation');
      return;
    }
    const newGrid = lines.slice(1).map(line => 
      line.split('|').filter(cell => cell !== '').map(cell => cell === '_' ? '' : cell)
    );
    setGrid(newGrid);
    setCurrentStep(parseInt(lines[0].split(' ')[1]) || 0);
    setExplanation('');
  };

  const randomize = () => {
    const randomFourDigitNumber = () => Math.floor(100 + Math.random() * 900);
    setNumber1(randomFourDigitNumber());
    setNumber2(randomFourDigitNumber());
  };

  return (
    <AppContainer>
      <h1>Long-Form Addition Explainer</h1>
      <GridContainer ref={gridRef}>
        {grid.map((row, i) => 
          row.map((cell, j) => 
            <GridCell key={`${i}-${j}`} highlight={j === 4 - currentStep} carry={i === 1 && j > 0 && j < 4 && cell !== ''}>
              {cell}
            </GridCell>
          )
        )}
      </GridContainer>
      <ControlsContainer>
        <Input type="number" value={number1} onChange={(e) => setNumber1(Number(e.target.value))} placeholder="First number" />
        <Input type="number" value={number2} onChange={(e) => setNumber2(Number(e.target.value))} placeholder="Second number" />
        <Button onClick={randomize}>Randomize</Button>
        <Button onClick={start}>Start</Button>
        <Button onClick={step}>Step</Button>
        <Button onClick={reset}>Reset</Button>
      </ControlsContainer>
      <ControlsContainer>
        <TextArea value={textRepresentation} readOnly />
        <Button onClick={copyText}>Copy Text</Button>
        <Button onClick={updateFromText}>Update From Text</Button>
      </ControlsContainer>
      <ExplanationContainer dangerouslySetInnerHTML={{ __html: explanation }} />
    </AppContainer>
  );
};

export default LongFormAddition;