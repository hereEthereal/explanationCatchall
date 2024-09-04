import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Square, XSquare, Circle, Target } from 'lucide-react';

// Define types
type Cell = 'empty' | 'obstacle' | 'agent' | 'goal';
type Grid = Cell[][];
type Point = [number, number];

// Styled components
const Container = styled.div`
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
  margin-bottom: 1rem;
`;

const CellContainer = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
`;

const PathMarker = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #3b82f6;
  border-radius: 50%;
`;

const Button = styled.button`
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

// Efficient priority queue implementation
class PriorityQueue<T> {
  private heap: [number, T][] = [];

  enqueue(priority: number, value: T) {
    this.heap.push([priority, value]);
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop()![1];

    const result = this.heap[0][1];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return result;
  }

  private bubbleUp(index: number) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex][0] <= this.heap[index][0]) break;
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  private bubbleDown(index: number) {
    while (true) {
      let smallestIndex = index;
      const leftIndex = 2 * index + 1;
      const rightIndex = 2 * index + 2;

      if (leftIndex < this.heap.length && this.heap[leftIndex][0] < this.heap[smallestIndex][0]) {
        smallestIndex = leftIndex;
      }

      if (rightIndex < this.heap.length && this.heap[rightIndex][0] < this.heap[smallestIndex][0]) {
        smallestIndex = rightIndex;
      }

      if (smallestIndex === index) break;

      [this.heap[index], this.heap[smallestIndex]] = [this.heap[smallestIndex], this.heap[index]];
      index = smallestIndex;
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

// Helper functions
const manhattan = (a: Point, b: Point) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

const getNeighbors = (point: Point, grid: Grid): Point[] => {
  const [x, y] = point;
  const neighbors: Point[] = [];
  if (x > 0) neighbors.push([x - 1, y]);
  if (x < grid.length - 1) neighbors.push([x + 1, y]);
  if (y > 0) neighbors.push([x, y - 1]);
  if (y < grid[0].length - 1) neighbors.push([x, y + 1]);
  return neighbors.filter(([nx, ny]) => grid[nx][ny] !== 'obstacle');
};

const PathfindingVisualization: React.FC = () => {
  const [grid, setGrid] = useState<Grid>([]);
  const [start, setStart] = useState<Point>([0, 0]);
  const [goal, setGoal] = useState<Point>([9, 9]);
  const [path, setPath] = useState<Point[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    // Initialize grid
    const newGrid: Grid = Array(10).fill(null).map(() => 
      Array(10).fill('empty')
    );
    newGrid[start[0]][start[1]] = 'agent';
    newGrid[goal[0]][goal[1]] = 'goal';
    setGrid(newGrid);
  }, []);

  const findPath = useCallback(() => {
    setIsCalculating(true);
    
    const openSet = new PriorityQueue<Point>();
    openSet.enqueue(0, start);
    
    const cameFrom = new Map<string, Point>();
    const gScore = new Map<string, number>();
    gScore.set(start.toString(), 0);
    
    const fScore = new Map<string, number>();
    fScore.set(start.toString(), manhattan(start, goal));

    while (!openSet.isEmpty()) {
      const current = openSet.dequeue()!;
      
      if (current[0] === goal[0] && current[1] === goal[1]) {
        // Reconstruct path
        const path: Point[] = [current];
        let curr = current;
        while (cameFrom.has(curr.toString())) {
          curr = cameFrom.get(curr.toString())!;
          path.unshift(curr);
        }
        setPath(path);
        setIsCalculating(false);
        return;
      }

      for (const neighbor of getNeighbors(current, grid)) {
        const tentativeGScore = gScore.get(current.toString())! + 1;
        
        if (tentativeGScore < (gScore.get(neighbor.toString()) ?? Infinity)) {
          cameFrom.set(neighbor.toString(), current);
          gScore.set(neighbor.toString(), tentativeGScore);
          const f = tentativeGScore + manhattan(neighbor, goal);
          fScore.set(neighbor.toString(), f);
          openSet.enqueue(f, neighbor);
        }
      }
    }

    // No path found
    setPath([]);
    setIsCalculating(false);
  }, [grid, start, goal]);

  const toggleObstacle = (x: number, y: number) => {
    const newGrid = [...grid];
    if (newGrid[x][y] === 'empty') {
      newGrid[x][y] = 'obstacle';
    } else if (newGrid[x][y] === 'obstacle') {
      newGrid[x][y] = 'empty';
    }
    setGrid(newGrid);
    setPath([]);
  };

  return (
    <Container>
      <Title>Pathfinding Visualization</Title>
      <GridContainer>
        {grid.map((row, x) => 
          row.map((cell, y) => (
            <CellContainer
              key={`${x}-${y}`}
              onClick={() => toggleObstacle(x, y)}
            >
              {cell === 'empty' && <Square size={24} />}
              {cell === 'obstacle' && <XSquare size={24} />}
              {cell === 'agent' && <Circle size={24} />}
              {cell === 'goal' && <Target size={24} />}
              {path.some(([px, py]) => px === x && py === y) && (
                <PathMarker />
              )}
            </CellContainer>
          ))
        )}
      </GridContainer>
      <Button onClick={findPath} disabled={isCalculating}>
        {isCalculating ? 'Calculating...' : 'Find Path'}
      </Button>
    </Container>
  );
};

export default PathfindingVisualization;