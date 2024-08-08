import React, { useState, useCallback } from 'react';
import { Stage, Layer, Circle, Line, Text } from 'react-konva';

// Tree Node class (unchanged)
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Custom hook for managing tree state (unchanged)
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
      return insertNode(prevRoot, value);
    });
  }, []);

  return { root, insert };
};

// Improved helper function to calculate node positions
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

  // Adjust x positions to ensure the tree starts from x=0
  positions.forEach((pos) => {
    pos.x -= leftMost;
  });

  return positions;
};

// Konva components for rendering the tree
const TreeNodeComponent = ({ node, positions }) => {
  if (!node) return null;
  const pos = positions.get(node);
  const radius = 20;

  return (
    <>
      <Circle x={pos.x} y={pos.y} radius={radius} fill="white" stroke="black" />
      <Text
        x={pos.x - radius}
        y={pos.y - radius / 2}
        width={radius * 2}
        height={radius}
        text={node.value.toString()}
        align="center"
        verticalAlign="middle"
      />
      {node.left && (
        <>
          <Line
            points={[pos.x, pos.y + radius, positions.get(node.left).x, positions.get(node.left).y - radius]}
            stroke="black"
          />
          <TreeNodeComponent node={node.left} positions={positions} />
        </>
      )}
      {node.right && (
        <>
          <Line
            points={[pos.x, pos.y + radius, positions.get(node.right).x, positions.get(node.right).y - radius]}
            stroke="black"
          />
          <TreeNodeComponent node={node.right} positions={positions} />
        </>
      )}
    </>
  );
};

// Main component
const BinarySearchTreeKonva = () => {
  const { root, insert } = useBinarySearchTree();
  const [inputValue, setInputValue] = useState('');

  const handleInsert = (e) => {
    e.preventDefault();
    const value = parseInt(inputValue, 10);
    if (!isNaN(value)) {
      insert(value);
      setInputValue('');
    }
  };

  const positions = root ? calculateNodePositions(root) : new Map();
  const maxX = root ? Math.max(...Array.from(positions.values()).map((pos) => pos.x)) : 0;
  const maxY = root ? Math.max(...Array.from(positions.values()).map((pos) => pos.y)) : 0;

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleInsert} className="mb-4">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number"
          className="border border-gray-300 rounded px-2 py-1 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
          Insert
        </button>
      </form>
      <Stage width={maxX + 80} height={maxY + 80}>
        <Layer>
          {root && <TreeNodeComponent node={root} positions={positions} />}
        </Layer>
      </Stage>
    </div>
  );
};

export default BinarySearchTreeKonva;