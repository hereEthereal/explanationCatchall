import React, { useState, useEffect } from 'react';

interface TreeNode {
  array: number[];
  pivot: number;
  left: TreeNode | null;
  right: TreeNode | null;
  isComplete: boolean;
}

const NODE_RADIUS = 30;
const VERTICAL_SPACING = 80;
const HORIZONTAL_SPACING = 60;

const QSTreeB: React.FC = () => {
  const testCases = [
    { name: "Mixed Small and Large", array: [15, 3, 27, 8, 40, 2, 19, 1, 33] },
    { name: "Reverse Sorted", array: [20, 18, 16, 14, 12, 10, 8, 6, 4] },
    { name: "With Outliers", array: [7, 12, 3, 9, 23, 42, 5, 1, 30] }
  ];

  const [currentTestCase, setCurrentTestCase] = useState(0);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    resetTree();
  }, [currentTestCase]);

  const resetTree = () => {
    setTreeData(initializeTree(testCases[currentTestCase].array));
    setCurrentStep(0);
  };

  const initializeTree = (arr: number[]): TreeNode => ({
    array: arr,
    pivot: arr[arr.length - 1],
    left: null,
    right: null,
    isComplete: false
  });

  const partitionStep = (node: TreeNode): TreeNode => {
    if (node.isComplete) return node;

    const left = node.array.filter(x => x < node.pivot);
    const right = node.array.filter((x, i) => x >= node.pivot && i < node.array.length - 1);

    return {
      ...node,
      left: left.length > 0 ? { array: left, pivot: left[left.length - 1], left: null, right: null, isComplete: false } : null,
      right: right.length > 0 ? { array: right, pivot: right[right.length - 1], left: null, right: null, isComplete: false } : null,
      isComplete: true
    };
  };

  const step = () => {
    if (!treeData) return;

    const updateTree = (node: TreeNode): TreeNode => {
      if (!node.isComplete) return partitionStep(node);
      return {
        ...node,
        left: node.left ? updateTree(node.left) : null,
        right: node.right ? updateTree(node.right) : null
      };
    };

    setTreeData(updateTree(treeData));
    setCurrentStep(currentStep + 1);
  };

  const getSortedElements = (node: TreeNode | null): number[] => {
    if (!node) return [];
    return [...getSortedElements(node.left), node.pivot, ...getSortedElements(node.right)];
  };

  const renderNode = (
    node: TreeNode,
    depth: number,
    sortedElements: number[],
    xScale: number
  ): JSX.Element => {
    const x = sortedElements.indexOf(node.pivot) * xScale;
    const y = depth * VERTICAL_SPACING;

    return (
      <g key={node.array.join()}>
        <circle cx={x} cy={y} r={NODE_RADIUS} fill="#999" />
        <text x={x} y={y} textAnchor="middle" fill="white" fontSize="12">
          {node.array.join(', ')}
        </text>
        <text x={x} y={y + 15} textAnchor="middle" fill="red" fontSize="10">
          Pivot: {node.pivot}
        </text>
        {node.left && (
          <>
            <line 
              x1={x} y1={y + NODE_RADIUS} 
              x2={sortedElements.indexOf(node.left.pivot) * xScale} 
              y2={y + VERTICAL_SPACING - NODE_RADIUS} 
              stroke="black" 
            />
            {renderNode(node.left, depth + 1, sortedElements, xScale)}
          </>
        )}
        {node.right && (
          <>
            <line 
              x1={x} y1={y + NODE_RADIUS} 
              x2={sortedElements.indexOf(node.right.pivot) * xScale} 
              y2={y + VERTICAL_SPACING - NODE_RADIUS} 
              stroke="black" 
            />
            {renderNode(node.right, depth + 1, sortedElements, xScale)}
          </>
        )}
      </g>
    );
  };

  const renderTree = () => {
    if (!treeData) return null;
    const sortedElements = getSortedElements(treeData);
    const width = sortedElements.length * HORIZONTAL_SPACING;
    const height = getTreeDepth(treeData) * VERTICAL_SPACING;
    const xScale = width / sortedElements.length;

    return (
      <svg width={width} height={height + VERTICAL_SPACING}>
        <g transform={`translate(${HORIZONTAL_SPACING / 2}, ${VERTICAL_SPACING / 2})`}>
          {renderNode(treeData, 0, sortedElements, xScale)}
        </g>
      </svg>
    );
  };

  const getTreeDepth = (node: TreeNode | null): number => {
    if (!node) return 0;
    return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '1200px', overflowX: 'auto', border: '1px solid #ccc' }}>
        {renderTree()}
      </div>
      <div style={{ marginTop: '20px' }}>
        <select 
          value={currentTestCase} 
          onChange={(e) => setCurrentTestCase(Number(e.target.value))}
          style={{ marginRight: '10px' }}
        >
          {testCases.map((testCase, index) => (
            <option key={index} value={index}>{testCase.name}</option>
          ))}
        </select>
        <button onClick={step} style={{ padding: '10px 20px', marginRight: '10px' }}>Next Step</button>
        <button onClick={resetTree} style={{ padding: '10px 20px' }}>Reset</button>
        <p>Current Array: {testCases[currentTestCase].array.join(', ')}</p>
        <p>Step: {currentStep}</p>
      </div>
    </div>
  );
};

export default QSTreeB;