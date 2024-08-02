import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Card = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1rem;
  background-color: #f0f0f0;
  border-bottom: 1px solid #e0e0e0;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0060df;
  }
`;

const GridContainer = styled.div<{ size: number }>`
  display: grid;
  gap: 1px;
  grid-template-columns: repeat(${props => props.size + 1}, minmax(30px, 1fr));
  background-color: #ccc;
  padding: 1px;
`;

const CellContainer = styled.div<{ isHeader: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  background-color: ${props => props.isHeader ? '#f0f0f0' : 'white'};
  font-weight: ${props => props.isHeader ? 'bold' : 'normal'};
  min-height: 30px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 16rem;
  font-family: monospace;
  font-size: 0.875rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
`;

interface CellProps {
  content: string;
  isHeader: boolean;
  onChange: (content: string) => void;
}

const Cell: React.FC<CellProps> = ({ content, isHeader, onChange }) => {
  return (
    <CellContainer
      isHeader={isHeader}
      contentEditable={!isHeader}
      suppressContentEditableWarning={true}
      onBlur={(e) => onChange(e.currentTarget.textContent || '')}
    >
      {content}
    </CellContainer>
  );
};

interface GridState {
  size: number;
  cells: string[][];
}

const GridConverter: React.FC = () => {
  const [gridState, setGridState] = useState<GridState>({ size: 5, cells: [] });
  const [textRepresentation, setTextRepresentation] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const createGrid = useCallback((size: number) => {
    const newCells = Array(size)
      .fill('')
      .map(() => Array(size).fill(''));
    setGridState({ size, cells: newCells });
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem('gridConverterState');
    if (savedState) {
      const { size, cells, currentStep, history } = JSON.parse(savedState);
      setGridState({ size, cells });
      setCurrentStep(currentStep);
      setHistory(history);
    } else {
      createGrid(5);
    }
  }, [createGrid]);

  useEffect(() => {
    updateTextFromGrid();
  }, [gridState]);

  const updateTextFromGrid = () => {
    let text = `step ${currentStep}:\n  `;
    for (let i = 1; i <= gridState.size; i++) {
      text += `|${i.toString().padEnd(2)}`;
    }
    text += '|\n--' + '-'.repeat(gridState.size * 3 + 1) + '\n';
    gridState.cells.forEach((row, i) => {
      text += `${(i + 1).toString().padEnd(2)}`;
      row.forEach((cell) => {
        text += `|${(cell || '_').padEnd(2)}`;
      });
      text += '|\n';
    });
    setTextRepresentation(text);
  };

  const updateGridFromText = () => {
    const lines = textRepresentation.split('\n');
    const newCells = lines.slice(3).map((line) =>
      line
        .split('|')
        .slice(1, -1)
        .map((cell) => (cell.trim() === '_' ? '' : cell.trim()))
    );
    setGridState((prev) => ({ ...prev, cells: newCells }));
  };

  const handleCellChange = (rowIndex: number, colIndex: number, content: string) => {
    setGridState((prev) => {
      const newCells = [...prev.cells];
      newCells[rowIndex][colIndex] = content;
      return { ...prev, cells: newCells };
    });
  };

  const saveAndIncrementStep = () => {
    setHistory((prev) => [...prev, textRepresentation]);
    setCurrentStep((prev) => prev + 1);
  };

  const copyText = () => {
    const textToCopy = showHistory ? history.join('\n==>\n') : textRepresentation;
    navigator.clipboard.writeText(textToCopy);
  };

  const resetApp = () => {
    setGridState({ size: 5, cells: Array(5).fill('').map(() => Array(5).fill('')) });
    setHistory([]);
    setCurrentStep(0);
    localStorage.removeItem('gridConverterState');
  };

  useEffect(() => {
    localStorage.setItem(
      'gridConverterState',
      JSON.stringify({
        size: gridState.size,
        cells: gridState.cells,
        currentStep,
        history,
      })
    );
  }, [gridState, currentStep, history]);

  return (
    <Container>
      <FlexContainer>
        <Card>
          <CardHeader>
            <CardTitle>Grid</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              min={1}
              max={10}
              value={gridState.size}
              onChange={(e) => createGrid(Number(e.target.value))}
            />
            <GridContainer size={gridState.size}>
              <Cell content="" isHeader={true} onChange={() => {}} />
              {Array.from({ length: gridState.size }, (_, i) => (
                <Cell key={`header-${i}`} content={(i + 1).toString()} isHeader={true} onChange={() => {}} />
              ))}
              {gridState.cells.map((row, rowIndex) => (
                <React.Fragment key={`row-${rowIndex}`}>
                  <Cell content={(rowIndex + 1).toString()} isHeader={true} onChange={() => {}} />
                  {row.map((cell, colIndex) => (
                    <Cell
                      key={`cell-${rowIndex}-${colIndex}`}
                      content={cell}
                      isHeader={false}
                      onChange={(content) => handleCellChange(rowIndex, colIndex, content)}
                    />
                  ))}
                </React.Fragment>
              ))}
            </GridContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Text Representation</CardTitle>
          </CardHeader>
          <CardContent>
            <TextArea
              value={showHistory ? history.join('\n==>\n') : textRepresentation}
              onChange={(e) => setTextRepresentation(e.target.value)}
              readOnly={showHistory}
            />
            <div>
              <Button onClick={updateGridFromText}>Update Grid</Button>
              <Button onClick={copyText}>Copy Text</Button>
              <Button onClick={saveAndIncrementStep}>Save and Increment Step</Button>
              <Button onClick={() => setShowHistory(!showHistory)}>
                {showHistory ? 'Show Current' : 'Show History'}
              </Button>
              <Button onClick={resetApp}>Reset</Button>
            </div>
          </CardContent>
        </Card>
      </FlexContainer>
    </Container>
  );
};

export default GridConverter;