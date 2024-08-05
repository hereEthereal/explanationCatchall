import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface Node {
  value: number;
  next: number | null;
}

const Container = styled.div`
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
`;

const VisualContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  overflow-x: auto;
`;

const NodeBox = styled.div<{ highlighted: boolean }>`
  border: 2px solid ${props => props.highlighted ? 'red' : 'black'};
  padding: 10px;
  margin-right: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Arrow = styled.div`
  margin: 0 5px;
  font-size: 20px;
`;

const Button = styled.button`
  margin: 5px;
  padding: 5px 10px;
`;

const InfoPanel = styled.div`
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
`;

const LinkedListVisualizer: React.FC = () => {
  const [linkedList, setLinkedList] = useState<Node[]>([]);
  const [currentOperation, setCurrentOperation] = useState<'insert' | 'delete' | 'traverse' | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [infoText, setInfoText] = useState('');

  const resetState = () => {
    setLinkedList([]);
    setCurrentOperation(null);
    setCurrentStep(0);
    setHighlightedNode(null);
    setInputValue('');
    setInfoText('');
  };

  const handleInsert = () => {
    setCurrentOperation('insert');
    setCurrentStep(0);
    setInfoText('Click "Step" to insert the new node at the end of the list.');
  };

  const handleDelete = () => {
    setCurrentOperation('delete');
    setCurrentStep(0);
    setInfoText('Click "Step" to delete the first node of the list.');
  };

  const handleTraverse = () => {
    setCurrentOperation('traverse');
    setCurrentStep(0);
    setHighlightedNode(linkedList.length > 0 ? 0 : null);
    setInfoText('Click "Step" to traverse through the list.');
  };

  const handleStep = () => {
    if (!currentOperation) return;

    if (currentOperation === 'insert') {
      if (currentStep === 0) {
        const newNode: Node = { value: parseInt(inputValue), next: null };
        setLinkedList([...linkedList, newNode]);
        setHighlightedNode(linkedList.length);
        setInfoText('New node added to the end of the list.');
      } else {
        setCurrentOperation(null);
        setHighlightedNode(null);
        setInfoText('Insertion complete.');
      }
    } else if (currentOperation === 'delete') {
      if (linkedList.length === 0) {
        setInfoText('Cannot delete from an empty list.');
        setCurrentOperation(null);
      } else if (currentStep === 0) {
        setLinkedList(linkedList.slice(1));
        setHighlightedNode(0);
        setInfoText('First node removed from the list.');
      } else {
        setCurrentOperation(null);
        setHighlightedNode(null);
        setInfoText('Deletion complete.');
      }
    } else if (currentOperation === 'traverse') {
      if (highlightedNode !== null && highlightedNode < linkedList.length - 1) {
        setHighlightedNode(highlightedNode + 1);
        setInfoText(`Traversing to node ${highlightedNode + 1}`);
      } else {
        setCurrentOperation(null);
        setHighlightedNode(null);
        setInfoText('Traversal complete.');
      }
    }

    setCurrentStep(currentStep + 1);
  };

  return (
    <Container>
      <h1>Linked List Visualizer</h1>
      <VisualContainer>
        {linkedList.map((node, index) => (
          <React.Fragment key={index}>
            <NodeBox highlighted={index === highlightedNode}>
              <div>{node.value}</div>
              <div>{index}</div>
            </NodeBox>
            {index < linkedList.length - 1 && <Arrow>→</Arrow>}
          </React.Fragment>
        ))}
      </VisualContainer>
      <div>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number"
        />
        <Button onClick={handleInsert}>Insert</Button>
        <Button onClick={handleDelete}>Delete</Button>
        <Button onClick={handleTraverse}>Traverse</Button>
        <Button onClick={handleStep} disabled={!currentOperation}>Step</Button>
        <Button onClick={resetState}>Reset</Button>
      </div>
      <InfoPanel>{infoText}</InfoPanel>
    </Container>
  );
};

export default LinkedListVisualizer;