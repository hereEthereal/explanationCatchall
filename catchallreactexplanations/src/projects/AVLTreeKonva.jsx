import React, { useState, useCallback } from 'react';
import { Stage, Layer, Circle, Line, Text } from 'react-konva';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
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
`;

const ExplanationText = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  max-width: 400px;
  text-align: center;
`;

// AVL Tree Node class
class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

// Custom hook for managing AVL tree state
const useAVLTree = () => {
  const [root, setRoot] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [needsRebalancing, setNeedsRebalancing] = useState(false);

  const getHeight = (node) => (node ? node.height : 0);
  const getBalanceFactor = (node) => (node ? getHeight(node.left) - getHeight(node.right) : 0);

  const updateHeight = (node) => {
    if (node) {
      node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
    }
  };

  const rotateRight = (y) => {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    updateHeight(y);
    updateHeight(x);
    return x;
  };

  const rotateLeft = (x) => {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    updateHeight(x);
    updateHeight(y);
    return y;
  };

  const balanceNode = (node) => {
    if (!node) return null;

    updateHeight(node);
    const balance = getBalanceFactor(node);

    if (balance > 1) {
      if (getBalanceFactor(node.left) >= 0) {
        // Left-Left Case
        setExplanation(`Left-Left case: Performing right rotation on ${node.value}`);
        return rotateRight(node);
      } else {
        // Left-Right Case
        setExplanation(`Left-Right case: Performing left rotation on ${node.left.value}, then right rotation on ${node.value}`);
        node.left = rotateLeft(node.left);
        return rotateRight(node);
      }
    }

    if (balance < -1) {
      if (getBalanceFactor(node.right) <= 0) {
        // Right-Right Case
        setExplanation(`Right-Right case: Performing left rotation on ${node.value}`);
        return rotateLeft(node);
      } else {
        // Right-Left Case
        setExplanation(`Right-Left case: Performing right rotation on ${node.right.value}, then left rotation on ${node.value}`);
        node.right = rotateRight(node.right);
        return rotateLeft(node);
      }
    }

    return node;
  };

  const insert = useCallback((value) => {
    const insertNode = (node, val) => {
      if (node === null) {
        setExplanation(`Inserted ${val} as a new leaf node.`);
        return new AVLNode(val);
      }

      if (val < node.value) {
        node.left = insertNode(node.left, val);
      } else if (val > node.value) {
        node.right = insertNode(node.right, val);
      } else {
        setExplanation(`${val} already exists in the tree. No insertion performed.`);
        return node;
      }

      return balanceNode(node);
    };

    setRoot((prevRoot) => {
      const newRoot = insertNode(prevRoot, value);
      setNeedsRebalancing(Math.abs(getBalanceFactor(newRoot)) > 1);
      return newRoot;
    });
  }, []);

  const rebalanceStep = useCallback(() => {
    setRoot((prevRoot) => {
      const newRoot = balanceNode(prevRoot);
      if (Math.abs(getBalanceFactor(newRoot)) <= 1) {
        setNeedsRebalancing(false);
        setExplanation('Tree is now balanced.');
      } else {
        setExplanation('Tree still needs rebalancing. Click Rebalance Step again.');
      }
      return newRoot;
    });
  }, []);

  return { root, insert, rebalanceStep, explanation, needsRebalancing };
};

// Helper function to calculate node positions
const calculateNodePositions = (root) => {
  const positions = new Map();
  const nodeSize = { width: 60, height: 60 };
  let leftMost = 0;

  const calculatePositions = (node, depth, position) => {
    if (!node) return null;

    const leftWidth = calculatePositions(node.left, depth + 1, position);
    const rightWidth = calculatePositions(node.right, depth + 1, position + 1 + (leftWidth || 0));

    const width = (leftWidth || 0) + (rightWidth || 0) + 1;
    const x = position + (leftWidth || 0);
    const y = depth;

    positions.set(node, { x: x * nodeSize.width, y: y * nodeSize.height });
    leftMost = Math.min(leftMost, x * nodeSize.width);

    return width;
  };

  calculatePositions(root, 0, 0);

  positions.forEach((pos) => {
    pos.x -= leftMost;
  });

  return positions;
};

// Konva component for rendering tree nodes
const TreeNodeComponent = ({ node, positions, nodeRadius }) => {
  if (!node || !positions.has(node)) return null;
  const pos = positions.get(node);

  return (
    <>
      <Circle 
        x={pos.x} 
        y={pos.y} 
        radius={nodeRadius} 
        fill="white" 
        stroke="black" 
      />
      <Text
        x={pos.x - nodeRadius}
        y={pos.y - nodeRadius / 2}
        width={nodeRadius * 2}
        height={nodeRadius}
        text={node.value.toString()}
        align="center"
        verticalAlign="middle"
      />
      <Text
        x={pos.x + nodeRadius}
        y={pos.y - nodeRadius}
        text={`(${node.height})`}
        fontSize={12}
      />
      {node.left && positions.has(node.left) && (
        <>
          <Line
            points={[pos.x, pos.y + nodeRadius, positions.get(node.left).x, positions.get(node.left).y - nodeRadius]}
            stroke="black"
          />
          <TreeNodeComponent 
            node={node.left} 
            positions={positions} 
            nodeRadius={nodeRadius} 
          />
        </>
      )}
      {node.right && positions.has(node.right) && (
        <>
          <Line
            points={[pos.x, pos.y + nodeRadius, positions.get(node.right).x, positions.get(node.right).y - nodeRadius]}
            stroke="black"
          />
          <TreeNodeComponent 
            node={node.right} 
            positions={positions} 
            nodeRadius={nodeRadius} 
          />
        </>
      )}
    </>
  );
};

// Main component
const AVLTreeKonva = () => {
  const { root, insert, rebalanceStep, explanation, needsRebalancing } = useAVLTree();
  const [inputValue, setInputValue] = useState('');
  const [numberList, setNumberList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Canvas size variables
  const minCanvasWidth = 800;
  const minCanvasHeight = 600;
  const padding = 100;

  // Node size and spacing variables
  const nodeRadius = 20;
  const levelHeight = 80;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddToList = (e) => {
    e.preventDefault();
    const numbers = inputValue.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
    setNumberList(prevList => [...prevList, ...numbers]);
    setInputValue('');
  };

  const handleStep = () => {
    if (currentIndex < numberList.length) {
      insert(numberList[currentIndex]);
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

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
  const canvasWidth = Math.max(minCanvasWidth, maxX + padding * 2);
  const canvasHeight = Math.max(minCanvasHeight, maxY + padding * 2);

  // Adjust node positions to fit the new canvas size with padding
  positions.forEach((pos) => {
    pos.x = pos.x + padding;
    pos.y = pos.y + padding;
  });

  return (
    <Container>
      <Form onSubmit={handleAddToList}>
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter numbers (comma-separated)"
        />
        <Button type="submit">Add to List</Button>
      </Form>
      <NumberList>
        <strong>Number List:</strong> {numberList.join(', ')}
      </NumberList>
      <Button onClick={handleStep} disabled={currentIndex >= numberList.length}>
        Insert Step
      </Button>
      <Button onClick={rebalanceStep} disabled={!needsRebalancing}>
        Rebalance Step
      </Button>
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {root && (
            <TreeNodeComponent 
              node={root} 
              positions={positions} 
              nodeRadius={nodeRadius} 
            />
          )}
        </Layer>
      </Stage>
      {explanation && (
        <ExplanationText>{explanation}</ExplanationText>
      )}
    </Container>
  );
};

export default AVLTreeKonva;