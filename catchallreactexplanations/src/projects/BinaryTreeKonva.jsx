import React, { useState, useCallback, useEffect } from 'react';
import { Stage, Layer, Circle, Line, Text } from 'react-konva';
import AudioPlayerComponent from './Audio/AudioPlayerWrapper';  

import styled from 'styled-components';

// Tree Node class
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Custom hook for managing tree state
const useBinarySearchTree = () => {
  const [root, setRoot] = useState(null);

  const insert = useCallback((value) => {
    const insertNode = (node, val) => {
      if (node === null) {
        return new TreeNode(val);
      }
      if (val < node.value) {
        node.left = insertNode(node.left, val);
      } else if (val > node.value) {
        node.right = insertNode(node.right, val);
      }
      return node;
    };

    setRoot((prevRoot) => {
      if (prevRoot === null) {
        return new TreeNode(value);
      }
      return insertNode({ ...prevRoot }, value);
    });
  }, []);

  return { root, insert };
};

// Helper function to calculate node positions
const calculateNodePositions = (root) => {
  const positions = new Map();
  let leftMost = 0;

  const calculatePositions = (node, depth, position) => {
    if (!node) return null;

    const leftWidth = calculatePositions(node.left, depth + 1, position);
    const rightWidth = calculatePositions(node.right, depth + 1, position + 1 + (leftWidth || 0));

    const width = (leftWidth || 0) + (rightWidth || 0) + 1;
    const x = position + (leftWidth || 0);
    const y = depth;

    positions.set(node, { x, y });
    leftMost = Math.min(leftMost, x);

    return width;
  };

  calculatePositions(root, 0, 0);

  // Adjust x positions to ensure the tree starts from x=0
  positions.forEach((pos) => {
    pos.x -= leftMost;
  });

  return positions;
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
`;

const Button = styled.button`
  background-color: #4299e1;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #3182ce;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const NumberList = styled.div`
  margin-bottom: 1rem;
  max-width: 600px;
  word-wrap: break-word;
`;

// Konva component for rendering tree nodes
const TreeNodeComponent = ({ node, positions, nodeRadius }) => {
  if (!node) return null;
  const pos = positions.get(node);

  return (
    <>
      <Circle x={pos.x} y={pos.y} radius={nodeRadius} fill="white" stroke="black" />
      <Text
        x={pos.x - nodeRadius}
        y={pos.y - nodeRadius / 2}
        width={nodeRadius * 2}
        height={nodeRadius}
        text={node.value.toString()}
        align="center"
        verticalAlign="middle"
      />
      {node.left && (
        <>
          <Line
            points={[pos.x, pos.y + nodeRadius, positions.get(node.left).x, positions.get(node.left).y - nodeRadius]}
            stroke="black"
          />
          <TreeNodeComponent node={node.left} positions={positions} nodeRadius={nodeRadius} />
        </>
      )}
      {node.right && (
        <>
          <Line
            points={[pos.x, pos.y + nodeRadius, positions.get(node.right).x, positions.get(node.right).y - nodeRadius]}
            stroke="black"
          />
          <TreeNodeComponent node={node.right} positions={positions} nodeRadius={nodeRadius} />
        </>
      )}
    </>
  );
};

// Main component
const BinarySearchTreeKonva = () => {
  const { root, insert } = useBinarySearchTree();
  const [inputValue, setInputValue] = useState('');
  const defaultList = [30,15,45,7,22,37,52,3,11,18,26,33,41,48,56,1,5,9,13,16,20,24,28,31,35,39,43,46,50,54];
  const [numberList, setNumberList] = useState(defaultList);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUsingDefault, setIsUsingDefault] = useState(true);

  // Canvas size variables
  const minCanvasWidth = 500;
  const minCanvasHeight = 380;
  const padding = 100; // Padding around the edges of the canvas

  // Node size and spacing variables
  const nodeRadius = 20;
  const levelHeight = 80; // Vertical space between levels

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddToList = (e) => {
    e.preventDefault();
    const numbers = inputValue.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
    if (numbers.length > 0) {
      setNumberList(numbers);
      setIsUsingDefault(false);
      setCurrentIndex(0);
      setInputValue('');
    }
  };

  const handleReset = () => {
    setNumberList(defaultList);
    setIsUsingDefault(true);
    setCurrentIndex(0);
  };

  const handleStep = () => {
    if (currentIndex < numberList.length) {
      insert(numberList[currentIndex]);
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  useEffect(() => {
    // Reset the tree when the number list changes
    setCurrentIndex(0);
  }, [numberList]);

  // Calculate node positions
  const positions = root ? calculateNodePositions(root) : new Map();
  
  // Find the maximum x and y positions
  let maxX = 0;
  let maxY = 0;
  positions.forEach((pos) => {
    maxX = Math.max(maxX, pos.x);
    maxY = Math.max(maxY, pos.y);
  });

  // Calculate the canvas size based on the tree size and padding
  const canvasWidth = Math.max(minCanvasWidth, maxX * nodeRadius * 3 + padding * 2);
  const canvasHeight = Math.max(minCanvasHeight, maxY * levelHeight + padding * 2);

  // Adjust node positions to fit the new canvas size with padding
  positions.forEach((pos) => {
    pos.x = pos.x * nodeRadius * 3 + padding;
    pos.y = pos.y * levelHeight + padding;
  });

  return (
    <Container>
      <Form onSubmit={handleAddToList}>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter numbers (comma-separated) or leave blank for default"
        />
        <Button type="submit">Set Custom List</Button>
        <Button type="button" onClick={handleReset}>Reset to Default</Button>
      </Form>
      <NumberList>
        <strong>{isUsingDefault ? "Default" : "Custom"} Number List:</strong> {numberList.join(', ')}
      </NumberList>
      <AudioPlayerComponent buttonText={"explain"} initialSpeed={1.3} filePath={"./binaryTreeInsertion.mp3"} autoPlay={true}/>
      <Button onClick={handleStep} disabled={currentIndex >= numberList.length}>
        Step {currentIndex + 1} / {numberList.length}
      </Button>
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {root && <TreeNodeComponent node={root} positions={positions} nodeRadius={nodeRadius} />}
        </Layer>
      </Stage>
    </Container>
  );
};

export default BinarySearchTreeKonva;


// In computer science, a binary tree is a tree data structure in which each node has at most two children, referred to as the left child and the right child
// when we want to add new information to this tree, we follow a simple set of rules:

// We always start at the root and compare our new piece of information to it.
// If our new information is smaller than what's at the root, we move to the left.
// If it's larger, we move to the right.
// We keep doing this - moving left for smaller, right for larger - until we find an empty spot.
// Once we find an empty spot, we put our new information there.

// note, without balancing the tree, the tree can be built imbalanced, for example if we entered the values: 1,2,3,4,5, and so on.