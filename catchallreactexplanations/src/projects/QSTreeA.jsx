import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
import styled from 'styled-components';

const Container = styled.div`
  padding: 1rem;
`;

const Card = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const InfoText = styled.p`
  margin: 0.25rem 0;
`;

const TreeContainer = styled.div`
  height: 600px;
  width: 100%;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background-color: #4299e1;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  margin-right: 0.5rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CompletionMessage = styled.p`
  margin-top: 1rem;
  font-weight: bold;
`;

const QSTreeA = () => {
  const [ourArray, setOurArray] = useState([3, 9, 2, 8, 5, 1, 7]);
  const [treeData, setTreeData] = useState({
    name: 'Root',
    attributes: { array: ourArray },
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [leftArray, setLeftArray] = useState([]);
  const [rightArray, setRightArray] = useState([]);
  const [pivot, setPivot] = useState(null);
  const [sortingComplete, setSortingComplete] = useState(false);

  useEffect(() => {
    if (currentStep === 0) {
      initializeSort();
    }
  }, [currentStep]);

  const initializeSort = () => {
    const newTreeData = { ...treeData };
    setPivot(ourArray[ourArray.length - 1]);
    setLeftArray([]);
    setRightArray([]);
    setCurrentNumber(null);
    newTreeData.attributes.pivot = ourArray[ourArray.length - 1];
    setTreeData(newTreeData);
  };

  const step = () => {
    if (currentStep < ourArray.length - 1) {
      highlightCurrentNumber();
    } else if (currentStep === ourArray.length - 1) {
      finalizePivot();
    } else {
      setSortingComplete(true);
    }
    setCurrentStep(currentStep + 1);
  };

  const highlightCurrentNumber = () => {
    const number = ourArray[currentStep];
    setCurrentNumber(number);
  };

  const placeNumber = () => {
    const number = currentNumber;
    if (number < pivot) {
      setLeftArray([...leftArray, number]);
    } else {
      setRightArray([...rightArray, number]);
    }
    setCurrentNumber(null);
  };

  const finalizePivot = () => {
    const newTreeData = { ...treeData };
    newTreeData.children = [
      { name: 'Left', attributes: { array: leftArray } },
      { name: 'Right', attributes: { array: rightArray } },
    ];
    setTreeData(newTreeData);
  };

  const renderCustomNode = ({ nodeDatum }) => (
    <g>
      <circle r={20} fill={nodeDatum.attributes.pivot ? 'lightblue' : 'white'} stroke="black" />
      <text dy=".31em" x={30} strokeWidth="1">
        {nodeDatum.attributes.array.join(', ')}
      </text>
      {nodeDatum.attributes.pivot !== undefined && (
        <text dy="1.31em" x={30} strokeWidth="1">
          Pivot: {nodeDatum.attributes.pivot}
        </text>
      )}
    </g>
  );

  return (
    <Container>
      <Card>
        <Title>QuickSort Visualization</Title>
        <InfoText>Current Step: {currentStep}</InfoText>
        <InfoText>Current Number: {currentNumber !== null ? currentNumber : 'N/A'}</InfoText>
        <InfoText>Pivot: {pivot}</InfoText>
        <InfoText>Left Array: [{leftArray.join(', ')}]</InfoText>
        <InfoText>Right Array: [{rightArray.join(', ')}]</InfoText>
      </Card>
      <TreeContainer>
        <Tree
          data={treeData}
          renderCustomNodeElement={renderCustomNode}
          orientation="vertical"
        />
      </TreeContainer>
      <div>
        <Button onClick={step} disabled={sortingComplete}>
          Next Step
        </Button>
        {currentNumber !== null && (
          <Button onClick={placeNumber}>Place Number</Button>
        )}
      </div>
      {sortingComplete && (
        <CompletionMessage>Sorting completed for this partition!</CompletionMessage>
      )}
    </Container>
  );
};

export default QSTreeA;