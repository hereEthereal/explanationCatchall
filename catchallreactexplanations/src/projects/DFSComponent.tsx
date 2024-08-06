import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components
const StyledGraphVisualization = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  border: 1px solid #ccc;
`;

const StyledControlPanel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const StyledStepExplanation = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
`;

const StyledNode = styled.div<{ isActive: boolean; isVisited: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  background-color: ${props => 
    props.isActive ? 'red' : props.isVisited ? 'green' : 'blue'};
  color: white;
`;

// TypeScript interfaces
interface Node {
  id: number;
  neighbors: number[];
}

interface Graph {
  nodes: Node[];
}

// DFS algorithm
function dfs(graph: Graph, start: number): number[] {
  const visited: boolean[] = new Array(graph.nodes.length).fill(false);
  const result: number[] = [];

  function dfsHelper(nodeId: number) {
    visited[nodeId] = true;
    result.push(nodeId);

    for (const neighbor of graph.nodes[nodeId].neighbors) {
      if (!visited[neighbor]) {
        dfsHelper(neighbor);
      }
    }
  }

  dfsHelper(start);
  return result;
}

// Main component
const DFSComponent: React.FC = () => {
  const [graph, setGraph] = useState<Graph>({
    nodes: [
      { id: 0, neighbors: [1, 2] },
      { id: 1, neighbors: [0, 3, 4] },
      { id: 2, neighbors: [0, 5] },
      { id: 3, neighbors: [1] },
      { id: 4, neighbors: [1] },
      { id: 5, neighbors: [2] },
    ]
  });

  const [dfsOrder, setDfsOrder] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [explanation, setExplanation] = useState<string>('');

  useEffect(() => {
    const order = dfs(graph, 0);
    setDfsOrder(order);
  }, [graph]);

  const handleNextStep = () => {
    if (currentStep < dfsOrder.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
      setExplanation(`Visiting node ${dfsOrder[currentStep + 1]}`);
    } else {
      setExplanation('DFS traversal complete');
    }
  };

  const handleReset = () => {
    setCurrentStep(-1);
    setExplanation('');
  };

  return (
    <div>
      <StyledGraphVisualization>
        {graph.nodes.map(node => (
          <StyledNode 
            key={node.id}
            isActive={dfsOrder[currentStep] === node.id}
            isVisited={dfsOrder.slice(0, currentStep + 1).includes(node.id)}
          >
            {node.id}
          </StyledNode>
        ))}
      </StyledGraphVisualization>
      <StyledControlPanel>
        <button onClick={handleNextStep} disabled={currentStep === dfsOrder.length - 1}>
          Next Step
        </button>
        <button onClick={handleReset}>Reset</button>
      </StyledControlPanel>
      <StyledStepExplanation>{explanation}</StyledStepExplanation>
    </div>
  );
};

export default DFSComponent;