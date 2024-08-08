import React, { useState } from 'react';

// Binary Search Tree node insertion function
const insertNode = (root, value) => {
  if (root === null) {
    return { value, left: null, right: null };
  }
  
  if (value < root.value) {
    root.left = insertNode(root.left, value);
  } else if (value > root.value) {
    root.right = insertNode(root.right, value);
  }
  
  return root;
};

const calculateNodePositions = (root) => {
  let nodePositions = new Map();
  let nextPosition = [0];

  const dfs = (node, depth) => {
    if (!node) return;

    dfs(node.left, depth + 1);

    nodePositions.set(node, {x: nextPosition[0], y: depth * 60});
    nextPosition[0]++;

    dfs(node.right, depth + 1);
  };

  dfs(root, 0);
  return nodePositions;
};

const TreeNode = ({ node, nodePositions }) => {
  const position = nodePositions.get(node);
  const circleRadius = 20;

  return (
    <g>
      <circle cx={position.x * 80} cy={position.y} r={circleRadius} fill="white" stroke="black" />
      <text x={position.x * 80} y={position.y} textAnchor="middle" dominantBaseline="central">{node.value}</text>
      {node.left && (
        <line
          x1={position.x * 80}
          y1={position.y + circleRadius}
          x2={nodePositions.get(node.left).x * 80}
          y2={nodePositions.get(node.left).y - circleRadius}
          stroke="black"
        />
      )}
      {node.right && (
        <line
          x1={position.x * 80}
          y1={position.y + circleRadius}
          x2={nodePositions.get(node.right).x * 80}
          y2={nodePositions.get(node.right).y - circleRadius}
          stroke="black"
        />
      )}
      {node.left && <TreeNode node={node.left} nodePositions={nodePositions} />}
      {node.right && <TreeNode node={node.right} nodePositions={nodePositions} />}
    </g>
  );
};

const BinaryTreeCyto = () => {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const handleInsert = (e) => {
    e.preventDefault();
    const value = parseInt(inputValue, 10);
    if (!isNaN(value)) {
      setRoot(prevRoot => insertNode(prevRoot, value));
      setInputValue('');
    }
  };

  const nodePositions = root ? calculateNodePositions(root) : new Map();
  const maxX = root ? Math.max(...Array.from(nodePositions.values()).map(pos => pos.x)) : 0;
  const maxY = root ? Math.max(...Array.from(nodePositions.values()).map(pos => pos.y)) : 0;

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
      <svg width={(maxX + 1) * 80} height={(maxY + 1) * 60 + 40}>
        {root && <TreeNode node={root} nodePositions={nodePositions} />}
      </svg>
    </div>
  );
};

export default BinaryTreeCyto;
