import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Interfaces and Types
interface Node {
  id: number;
  neighbors: number[];
}

interface Graph {
  nodes: Node[];
}

type QueueItem = {
  nodeId: number;
  level: number;
};

enum NodeStatus {
  Unexplored,
  InQueue,
  Explored
}

// Styled Components
const StyledGraphVisualization = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const StyledNode = styled.div<{ status: NodeStatus }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => 
    props.status === NodeStatus.Unexplored ? 'lightgray' :
    props.status === NodeStatus.InQueue ? 'yellow' :
    'green'
  };
`;

const StyledQueueVisualization = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const StyledControlPanel = styled.div`
  margin-bottom: 20px;
`;

const StyledStepExplanation = styled.div`
  margin-bottom: 20px;
`;

// BFS Component
const BFSComponent: React.FC = () => {
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

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [explanation, setExplanation] = useState<string>('');

  const initializeBFS = () => {
    setQueue([{ nodeId: 0, level: 0 }]);
    setVisited(new Set([0]));
    setCurrentStep(0);
    setExplanation('BFS initialized. Starting from node 0.');
  };

  const stepBFS = () => {
    if (queue.length === 0) {
      setExplanation('BFS completed.');
      return;
    }

    const { nodeId, level } = queue.shift()!;
    setQueue([...queue]);

    const neighbors = graph.nodes.find(n => n.id === nodeId)?.neighbors || [];
    const newNodes = neighbors.filter(n => !visited.has(n));

    newNodes.forEach(n => {
      queue.push({ nodeId: n, level: level + 1 });
      visited.add(n);
    });

    setQueue([...queue]);
    setVisited(new Set(visited));
    setCurrentStep(currentStep + 1);
    setExplanation(`Explored node ${nodeId}. Added ${newNodes.length} new nodes to the queue.`);
  };

  useEffect(() => {
    initializeBFS();
  }, []);

  return (
    <div>
      <h1>BFS Visualization</h1>
      <StyledGraphVisualization>
        {graph.nodes.map(node => (
          <StyledNode 
            key={node.id} 
            status={
              visited.has(node.id) ? NodeStatus.Explored :
              queue.some(q => q.nodeId === node.id) ? NodeStatus.InQueue :
              NodeStatus.Unexplored
            }
          >
            {node.id}
          </StyledNode>
        ))}
      </StyledGraphVisualization>

      <StyledQueueVisualization>
        Queue: {queue.map(item => item.nodeId).join(' -> ')}
      </StyledQueueVisualization>

      <StyledControlPanel>
        <button onClick={stepBFS}>Step</button>
        <button onClick={initializeBFS}>Reset</button>
      </StyledControlPanel>

      <StyledStepExplanation>
        Step {currentStep}: {explanation}
      </StyledStepExplanation>
    </div>
  );
};

export default BFSComponent;