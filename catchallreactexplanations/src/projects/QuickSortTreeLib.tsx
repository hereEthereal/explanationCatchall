import React, { useState } from 'react';
import Tree from 'react-d3-tree';

interface TreeNode {
  name: string;
  attributes?: { color?: string };
  children: TreeNode[];
}

function QuickSortTreeLib() {
  const [unsortedArray, setUnsortedArray] = useState<number[]>([37, 12, 45, 3, 29, 18, 41, 7, 33, 22]);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const insertIntoTree = (node: TreeNode | null, value: number, isPivot: boolean): TreeNode => {
    if (node === null) {
      return {
        name: value.toString(),
        attributes: isPivot ? { color: 'red' } : undefined,
        children: []
      };
    }

    if (value < parseInt(node.name)) {
      node.children[0] = insertIntoTree(node.children[0], value, false);
    } else {
      node.children[1] = insertIntoTree(node.children[1], value, false);
    }

    return node;
  };

  const handleStep = () => {
    if (currentIndex < unsortedArray.length) {
      const newTree = tree
        ? insertIntoTree(tree, unsortedArray[currentIndex], false)
        : insertIntoTree(null, unsortedArray[currentIndex], true);
      setTree(newTree);
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h1>QuickSort Visualization</h1>
      <div>
        Original Array: {unsortedArray.map((num, index) => (
          <span key={index} style={{ color: index === currentIndex ? 'red' : 'black' }}>
            {num}{index < unsortedArray.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>
      <button onClick={handleStep} disabled={currentIndex >= unsortedArray.length}>
        Step
      </button>
      <div>Processed: {currentIndex} / {unsortedArray.length}</div>
      <div style={{ height: '500px', width: '100%' }}>
        {tree && (
          <Tree
            data={tree}
            orientation="vertical"
            pathFunc="step"
            translate={{ x: 300, y: 50 }}
            nodeSize={{ x: 100, y: 100 }}
            renderCustomNodeElement={(rd3tProps) =>
              <g>
                <circle
                  r={20}
                  fill={rd3tProps.nodeDatum.attributes?.color?.toString() || 'lightblue'}
                />
                <text fill="black" strokeWidth="1" x="30">
                  {rd3tProps.nodeDatum.name}
                </text>
              </g>
            }
          />
        )}
      </div>
    </div>
  );
}

export default QuickSortTreeLib;