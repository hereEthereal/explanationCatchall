import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Interfaces
interface Node {
  id: number;
  x: number;
  y: number;
}

interface Edge {
  source: number;
  target: number;
  weight: number;
}

interface Graph {
  nodes: Node[];
  edges: Edge[];
}

// Styled Components
const StyledGraphVisualization = styled.div`
  width: 500px;
  height: 500px;
  border: 1px solid black;
  position: relative;
`;

const StyledNode = styled.div<{ x: number; y: number; isActive: boolean }>`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.isActive ? 'red' : 'blue'};
`;

const StyledEdge = styled.line`
  stroke: black;
  stroke-width: 2;
`;

const StyledDistanceTable = styled.table`
  border-collapse: collapse;
  margin-top: 20px;
`;

const StyledControlPanel = styled.div`
  margin-top: 20px;
`;

const StyledStepExplanation = styled.div`
  margin-top: 20px;
`;

// Dijkstra's Algorithm Implementation
function dijkstra(graph: Graph, start: number): { distances: number[], previous: number[] } {
  const distances: number[] = new Array(graph.nodes.length).fill(Infinity);
  const previous: number[] = new Array(graph.nodes.length).fill(-1);
  const visited: boolean[] = new Array(graph.nodes.length).fill(false);

  distances[start] = 0;

  for (let i = 0; i < graph.nodes.length; i++) {
    const u = minDistance(distances, visited);
    visited[u] = true;

    for (const edge of graph.edges) {
      if (edge.source === u && !visited[edge.target]) {
        const alt = distances[u] + edge.weight;
        if (alt < distances[edge.target]) {
          distances[edge.target] = alt;
          previous[edge.target] = u;
        }
      }
    }
  }

  return { distances, previous };
}

function minDistance(distances: number[], visited: boolean[]): number {
  let min = Infinity;
  let minIndex = -1;

  for (let v = 0; v < distances.length; v++) {
    if (!visited[v] && distances[v] <= min) {
      min = distances[v];
      minIndex = v;
    }
  }

  return minIndex;
}

// Main Component
const DijkstraComponent: React.FC = () => {
  const [graph, setGraph] = useState<Graph>({
    nodes: [
      { id: 0, x: 50, y: 50 },
      { id: 1, x: 200, y: 100 },
      { id: 2, x: 350, y: 50 },
      { id: 3, x: 200, y: 200 },
    ],
    edges: [
      { source: 0, target: 1, weight: 4 },
      { source: 0, target: 2, weight: 2 },
      { source: 1, target: 2, weight: 1 },
      { source: 1, target: 3, weight: 5 },
      { source: 2, target: 3, weight: 8 },
    ],
  });

  const [startNode, setStartNode] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [distances, setDistances] = useState<number[]>([]);
  const [previous, setPrevious] = useState<number[]>([]);

  useEffect(() => {
    const result = dijkstra(graph, startNode);
    setDistances(result.distances);
    setPrevious(result.previous);
  }, [graph, startNode]);

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, graph.nodes.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  return (
    <div>
      <StyledGraphVisualization>
        <svg width="500" height="500">
          {graph.edges.map((edge, index) => (
            <StyledEdge
              key={index}
              x1={graph.nodes[edge.source].x + 10}
              y1={graph.nodes[edge.source].y + 10}
              x2={graph.nodes[edge.target].x + 10}
              y2={graph.nodes[edge.target].y + 10}
            />
          ))}
        </svg>
        {graph.nodes.map((node, index) => (
          <StyledNode
            key={index}
            x={node.x}
            y={node.y}
            isActive={index === currentStep}
          />
        ))}
      </StyledGraphVisualization>

      <StyledDistanceTable>
        <thead>
          <tr>
            <th>Node</th>
            <th>Distance</th>
            <th>Previous</th>
          </tr>
        </thead>
        <tbody>
          {distances.map((distance, index) => (
            <tr key={index}>
              <td>{index}</td>
              <td>{distance === Infinity ? '∞' : distance}</td>
              <td>{previous[index] === -1 ? '-' : previous[index]}</td>
            </tr>
          ))}
        </tbody>
      </StyledDistanceTable>

      <StyledControlPanel>
        <button onClick={handlePrevStep}>Previous Step</button>
        <button onClick={handleNextStep}>Next Step</button>
        <select
          value={startNode}
          onChange={(e) => setStartNode(Number(e.target.value))}
        >
          {graph.nodes.map((node) => (
            <option key={node.id} value={node.id}>
              Node {node.id}
            </option>
          ))}
        </select>
      </StyledControlPanel>

      <StyledStepExplanation>
        <h3>Step Explanation</h3>
        <p>
          Current step: {currentStep}
          <br />
          {currentStep < graph.nodes.length
            ? `Visiting node ${currentStep} and updating its neighbors.`
            : 'Algorithm completed.'}
        </p>
      </StyledStepExplanation>
    </div>
  );
};

export default DijkstraComponent;