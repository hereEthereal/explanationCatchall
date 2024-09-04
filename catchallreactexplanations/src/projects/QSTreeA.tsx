import React, { useState, useEffect } from 'react';

interface TreeNode {
  array: number[];
  pivot: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

const QSTreeB: React.FC = () => {
  const [initialArray] = useState<number[]>([3, 9, 2, 8, 5, 1, 7]);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setTreeData(buildTree(initialArray));
  }, [initialArray]);

  const buildTree = (arr: number[]): TreeNode | null => {
    if (arr.length === 0) return null;
    const pivot = arr[arr.length - 1];
    const left = arr.filter(x => x < pivot);
    const right = arr.filter((x, i) => x >= pivot && i < arr.length - 1);
    return {
      array: arr,
      pivot,
      left: buildTree(left),
      right: buildTree(right)
    };
  };

  const renderNode = (node: TreeNode, x: number, y: number, width: number) => {
    const nodeRadius = 30;
    const verticalSpacing = 80;
    
    return (
      <g key={node.array.join()}>
        <circle cx={x} cy={y} r={nodeRadius} fill="#999" />
        <text x={x} y={y} textAnchor="middle" fill="white" fontSize="12">
          {node.array.join(', ')}
        </text>
        <text x={x} y={y + 15} textAnchor="middle" fill="red" fontSize="10">
          Pivot: {node.pivot}
        </text>
        {node.left && (
          <>
            <line x1={x} y1={y + nodeRadius} x2={x - width/4} y2={y + verticalSpacing - nodeRadius} stroke="black" />
            {renderNode(node.left, x - width/4, y + verticalSpacing, width/2)}
          </>
        )}
        {node.right && (
          <>
            <line x1={x} y1={y + nodeRadius} x2={x + width/4} y2={y + verticalSpacing - nodeRadius} stroke="black" />
            {renderNode(node.right, x + width/4, y + verticalSpacing, width/2)}
          </>
        )}
      </g>
    );
  };

  const renderTree = () => {
    if (!treeData) return null;
    const width = 800;
    const height = 600;
    return (
      <svg width={width} height={height}>
        <g transform={`translate(${width/2}, 50)`}>
          {renderNode(treeData, 0, 0, width)}
        </g>
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div style={{ width: '800px', height: '600px', border: '1px solid #ccc' }}>
        {renderTree()}
      </div>
      <div style={{ marginTop: '20px' }}>
        <p>Initial Array: {initialArray.join(', ')}</p>
        <p>Step: {currentStep}</p>
      </div>
    </div>
  );
};

export default QSTreeB;