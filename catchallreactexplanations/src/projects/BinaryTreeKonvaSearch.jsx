import React, { useState, useCallback, useEffect } from 'react';
import { Stage, Layer, Circle, Line, Text } from 'react-konva';
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
  const [searchPath, setSearchPath] = useState([]);
  const [currentSearchNode, setCurrentSearchNode] = useState(null);
  const [searchExplanation, setSearchExplanation] = useState('');

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

  const buildTree = useCallback((values) => {
    setRoot(null);
    values.forEach(value => insert(value));
  }, [insert]);

  const searchStep = useCallback((searchValue) => {
    setSearchPath(prevPath => {
      const newPath = prevPath.length === 0 ? [root] : [...prevPath];
      const currentNode = newPath[newPath.length - 1];

      if (!currentNode) {
        setSearchExplanation('Search complete. Value not found.');
        return newPath;
      }

      if (searchValue === currentNode.value) {
        setSearchExplanation(`Found ${searchValue}!`);
        return newPath;
      }

      if (searchValue < currentNode.value) {
        setSearchExplanation(`${searchValue} is less than ${currentNode.value}. Moving to left child.`);
        newPath.push(currentNode.left);
      } else {
        setSearchExplanation(`${searchValue} is greater than ${currentNode.value}. Moving to right child.`);
        newPath.push(currentNode.right);
      }

      setCurrentSearchNode(newPath[newPath.length - 1]);
      return newPath;
    });
  }, [root]);

  const resetSearch = useCallback(() => {
    setSearchPath([]);
    setCurrentSearchNode(null);
    setSearchExplanation('');
  }, []);

  const resetTree = useCallback(() => {
    setRoot(null);
    resetSearch();
  }, [resetSearch]);

  return { root, insert, buildTree, searchStep, resetSearch, resetTree, searchPath, currentSearchNode, searchExplanation };
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
  font-family: Arial, sans-serif;
  padding: 20px;
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
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #4299e1;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

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
  font-size: 16px;
  max-width: 600px;
  word-wrap: break-word;
`;

const ExplanationText = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  max-width: 400px;
  text-align: center;
  font-size: 16px;
`;

// Konva component for rendering tree nodes
const TreeNodeComponent = ({ node, positions, nodeRadius, searchPath, currentSearchNode }) => {
  if (!node) return null;
  const pos = positions.get(node);
  const isInSearchPath = searchPath.includes(node);
  const isCurrentSearchNode = node === currentSearchNode;

  return (
    <>
      <Circle 
        x={pos.x} 
        y={pos.y} 
        radius={nodeRadius} 
        fill={isCurrentSearchNode ? "yellow" : isInSearchPath ? "lightblue" : "white"} 
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
      {node.left && (
        <>
          <Line
            points={[pos.x, pos.y + nodeRadius, positions.get(node.left).x, positions.get(node.left).y - nodeRadius]}
            stroke="black"
          />
          <TreeNodeComponent 
            node={node.left} 
            positions={positions} 
            nodeRadius={nodeRadius} 
            searchPath={searchPath}
            currentSearchNode={currentSearchNode}
          />
        </>
      )}
      {node.right && (
        <>
          <Line
            points={[pos.x, pos.y + nodeRadius, positions.get(node.right).x, positions.get(node.right).y - nodeRadius]}
            stroke="black"
          />
          <TreeNodeComponent 
            node={node.right} 
            positions={positions} 
            nodeRadius={nodeRadius} 
            searchPath={searchPath}
            currentSearchNode={currentSearchNode}
          />
        </>
      )}
    </>
  );
};

// Main component
const BinarySearchTreeKonva = () => {
  const { root, buildTree, searchStep, resetSearch, resetTree, searchPath, currentSearchNode, searchExplanation } = useBinarySearchTree();
  const [inputValue, setInputValue] = useState('');
  const [numberList, setNumberList] = useState([]);
  const [searchValue, setSearchValue] = useState('9');

  const defaultList = [30,15,45,7,22,37,52,3,11,18,26,33,41,48,56,1,5,9,13,16,20,24,28,31,35,39,43,46,50,54];

  // Use effect to build the tree on component mount
  useEffect(() => {
    buildTree(defaultList);
    setNumberList(defaultList);
  }, [buildTree]);

  // Canvas size variables
  const minCanvasWidth = 500;
  const minCanvasHeight = 380;
  const padding = 100; // Padding around the edges of the canvas
  const nodeRadius = 20;
  const levelHeight = 80; // Vertical space between levels

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddToList = (e) => {
    e.preventDefault();
    const numbers = inputValue.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
    setNumberList(prevList => {
      const newList = [...prevList, ...numbers];
      buildTree(newList);
      return newList;
    });
    setInputValue('');
  };

  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    resetSearch();
    searchStep(parseInt(searchValue, 10));
  };

  const handleSearchStep = () => {
    searchStep(parseInt(searchValue, 10));
  };

  const handleResetList = () => {
    resetTree();
    setNumberList([]);
  };

  const handleUseDefaultList = () => {
    buildTree(defaultList);
    setNumberList(defaultList);
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
          placeholder="Enter numbers (comma-separated)"
        />
        <Button type="submit">Add to List</Button>
      </Form>
      <NumberList>
        <strong>Number List:</strong> {numberList.join(', ')}
      </NumberList>
      <Button onClick={handleResetList}>Reset List</Button>
      <Button onClick={handleUseDefaultList}>Use Default List</Button>
      <Form onSubmit={handleSearch}>
        <Input
          type="number"
          value={searchValue}
          onChange={handleSearchInputChange}
          placeholder="Enter search value"
        />
        <Button type="submit">Search</Button>
      </Form>
      <Button onClick={handleSearchStep} disabled={!searchValue || (searchPath.length > 0 && !currentSearchNode)}>
        Search Step
      </Button>
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          {root && (
            <TreeNodeComponent 
              node={root} 
              positions={positions} 
              nodeRadius={nodeRadius} 
              searchPath={searchPath}
              currentSearchNode={currentSearchNode}
            />
          )}
        </Layer>
      </Stage>
      {searchExplanation && (
        <ExplanationText>{searchExplanation}</ExplanationText>
      )}
    </Container>
  );
};

export default BinarySearchTreeKonva;