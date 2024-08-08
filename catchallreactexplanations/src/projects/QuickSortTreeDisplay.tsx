import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

const QuickSortTreeLib: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [step, setStep] = useState(0);
  const [isExample, setIsExample] = useState(false);

  useEffect(() => {
    if (isExample) {
      setArray([37, 12, 45, 3, 29, 18, 41, 7, 33, 22]);
      setStep(0);
      setTreeData(null);
    }
  }, [isExample]);

  const quickSort = (arr: number[]): number[] => {
    if (arr.length <= 1) {
      return arr;
    }

    const pivot = arr[arr.length - 1];
    const leftArr: number[] = [];
    const rightArr: number[] = [];

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] < pivot) {
        leftArr.push(arr[i]);
      } else {
        rightArr.push(arr[i]);
      }
    }

    console.log(`Partitioning around ${pivot}:`, { left: leftArr, right: rightArr });

    return [...quickSort(leftArr), pivot, ...quickSort(rightArr)];
  };

  const buildTreeData = (arr: number[]): TreeNode | null => {
    if (arr.length === 0) return null;

    const pivot = arr[arr.length - 1];
    const node: TreeNode = { name: pivot.toString() };

    const leftArr = arr.filter((num) => num < pivot);
    const rightArr = arr.filter((num) => num > pivot);

    node.children = [];
    
    const leftChild = buildTreeData(leftArr);
    if (leftChild) node.children.push(leftChild);
    
    const rightChild = buildTreeData(rightArr);
    if (rightChild) node.children.push(rightChild);

    return node;
  };

  const handleSort = () => {
    const sortedArray = quickSort([...array]);
    console.log('Sorted array:', sortedArray);
    setTreeData(buildTreeData(array));
    setStep(array.length);
  };

  const handleStepSort = () => {
    if (step === 0) {
      setTreeData(buildTreeData(array.slice(0, 1)));
    } else if (step < array.length) {
      setTreeData(buildTreeData(array.slice(0, step + 1)));
    }
    setStep((prevStep) => Math.min(prevStep + 1, array.length));
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ color: '#333' }}>QuickSort Tree Visualization</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={array.join(', ')}
          onChange={(e) => setArray(e.target.value.split(',').map(Number))}
          placeholder="Enter numbers separated by commas"
          style={{ padding: '5px', marginRight: '10px', width: '300px' }}
        />
        <button onClick={handleSort} style={{ padding: '5px 10px', marginRight: '10px' }}>Sort</button>
        <button onClick={handleStepSort} style={{ padding: '5px 10px', marginRight: '10px' }}>Step</button>
        <button onClick={() => setIsExample(!isExample)} style={{ padding: '5px 10px' }}>
          {isExample ? 'Clear Example' : 'Show Example'}
        </button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#555' }}>Original Array:</h2>
        <p>{array.join(', ')}</p>
      </div>
      <div>
        <h2 style={{ color: '#555' }}>QuickSort Tree:</h2>
        <div style={{ width: '100%', height: '500px', border: '1px solid #ddd' }}>
          {treeData && (
            <Tree
              data={treeData}
              orientation="vertical"
              pathFunc="step"
              translate={{ x: 300, y: 50 }}
              separation={{ siblings: 2, nonSiblings: 2 }}
              nodeSize={{ x: 100, y: 100 }}
              rootNodeClassName="node__root"
              branchNodeClassName="node__branch"
              leafNodeClassName="node__leaf"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickSortTreeLib;