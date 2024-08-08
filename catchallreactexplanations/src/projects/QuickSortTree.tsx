import React, { useState, useEffect } from 'react';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  leftBin: number[];
  rightBin: number[];
  range: [number, number];
  sorted: number[];
  currentIndex: number;
  isProcessing: boolean;
}

const QuicksortTree: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [sortingComplete, setSortingComplete] = useState<boolean>(false);
  const [finalSortedArray, setFinalSortedArray] = useState<number[]>([]);
  const [mergePhase, setMergePhase] = useState<boolean>(false);

  useEffect(() => {
    console.log("Component mounted or updated");
    generateRandomArray();
  }, []);

  const generateRandomArray = (): void => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
    console.log("Generated new array:", newArray);
    setArray(newArray);
    const newTree = initializeTree(newArray, 0, newArray.length - 1);
    console.log("Initialized new tree:", JSON.stringify(newTree, null, 2));
    setTree(newTree);
    setCurrentStep(0);
    setSortingComplete(false);
    setMergePhase(false);
    setFinalSortedArray([]);
  };

  const initializeTree = (arr: number[], low: number, high: number): TreeNode | null => {
    if (low > high) {
      console.log(`Skipping tree node initialization for range [${low}, ${high}]`);
      return null;
    }
    const pivot = arr[high];
    console.log(`Initializing tree node: pivot=${pivot}, range=[${low}, ${high}]`);
    return {
      value: pivot,
      left: null,
      right: null,
      leftBin: [],
      rightBin: [],
      range: [low, high],
      sorted: [],
      currentIndex: low,
      isProcessing: true
    };
  };

  const nextStep = (): void => {
    if (!tree) {
      console.log("Next step called but tree is null");
      return;
    }
    
    console.log("---- Next Step ----");
    if (!mergePhase) {
      setTree(prevTree => {
        if (!prevTree) {
          console.log("Previous tree is null, cannot process");
          return null;
        }
        const processedTree = processNode(prevTree);
        console.log("Processed tree:", JSON.stringify(processedTree, null, 2));
        if (isTreeFullySorted(processedTree)) {
          console.log("Tree is fully sorted. Moving to merge phase.");
          setMergePhase(true);
        }
        return processedTree;
      });
    } else {
      mergeSortedArrays();
    }

    setCurrentStep(prevStep => {
      const newStep = prevStep + 1;
      console.log(`Updated current step to ${newStep}`);
      return newStep;
    });
  };

  const processNode = (node: TreeNode): TreeNode => {
    console.log(`Processing node: pivot=${node.value}, range=[${node.range[0]}, ${node.range[1]}], isProcessing=${node.isProcessing}`);
    
    if (node.isProcessing) {
      if (node.currentIndex < node.range[1]) {
        const currentValue = array[node.currentIndex];
        console.log(`Processing value ${currentValue} at index ${node.currentIndex}`);
        if (currentValue < node.value) {
          return {
            ...node,
            leftBin: [...node.leftBin, currentValue],
            currentIndex: node.currentIndex + 1
          };
        } else {
          return {
            ...node,
            rightBin: [...node.rightBin, currentValue],
            currentIndex: node.currentIndex + 1
          };
        }
      } else {
        console.log(`Finished processing node ${node.value}`);
        const newNode = { ...node, isProcessing: false };
        if (newNode.leftBin.length > 0) {
          newNode.left = initializeTree(newNode.leftBin, newNode.range[0], newNode.range[0] + newNode.leftBin.length - 1);
        }
        if (newNode.rightBin.length > 0) {
          newNode.right = initializeTree(newNode.rightBin, newNode.range[0] + newNode.leftBin.length, newNode.range[1] - 1);
        }
        return newNode;
      }
    } else {
      if (node.left && (node.left.isProcessing || node.left.sorted.length === 0)) {
        console.log(`Processing left child of ${node.value}`);
        return { ...node, left: processNode(node.left) };
      } else if (node.right && (node.right.isProcessing || node.right.sorted.length === 0)) {
        console.log(`Processing right child of ${node.value}`);
        return { ...node, right: processNode(node.right) };
      } else if (node.sorted.length === 0) {
        console.log(`Combining results for ${node.value}`);
        const leftSorted = node.left ? node.left.sorted : [];
        const rightSorted = node.right ? node.right.sorted : [];
        const newSorted = [...leftSorted, node.value, ...rightSorted];
        console.log(`New sorted array for ${node.value}: [${newSorted.join(', ')}]`);
        return { ...node, sorted: newSorted };
      } else {
        console.log(`Node ${node.value} is already processed and sorted`);
        return node;
      }
    }
  };
  

  const isTreeFullySorted = (node: TreeNode | null): boolean => {
    if (!node) {
      console.log("Null node encountered in isTreeFullySorted");
      return true;
    }
    if (node.isProcessing) {
      console.log(`Node ${node.value} is still processing`);
      return false;
    }
    if (node.sorted.length === 0) {
      console.log(`Node ${node.value} has empty sorted array`);
      return false;
    }
    const result = isTreeFullySorted(node.left) && isTreeFullySorted(node.right);
    console.log(`Checking if subtree ${node.value} is fully sorted: ${result}`);
    return result;
  };

  const mergeSortedArrays = () => {
    if (tree && tree.sorted.length > 0) {
      const nextElement = tree.sorted[0];
      console.log(`Merging element ${nextElement}`);
      setFinalSortedArray(prev => {
        const newArray = [...prev, nextElement];
        console.log(`Updated final sorted array: [${newArray.join(', ')}]`);
        return newArray;
      });
      setTree(prev => {
        if (prev) {
          const newSorted = prev.sorted.slice(1);
          console.log(`Remaining to merge: [${newSorted.join(', ')}]`);
          return { ...prev, sorted: newSorted };
        }
        console.log("Tree became null during merge");
        return null;
      });
    } else {
      console.log("Cannot merge: tree is null or has empty sorted array");
    }
  };

  const TreeNodeComponent: React.FC<{ node: TreeNode }> = ({ node }) => {
    const style = {
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px',
      margin: '5px',
      display: 'inline-block',
      backgroundColor: node.isProcessing ? '#e6f7ff' : 'white',
    };

    return (
      <div style={{ textAlign: 'center' }}>
        <div style={style}>
          <div>Pivot: {node.value}</div>
          <div>Left Bin: [{node.leftBin.join(', ')}]</div>
          <div>Right Bin: [{node.rightBin.join(', ')}]</div>
          <div>Range: [{node.range[0]}, {node.range[1]}]</div>
          <div>Current Index: {node.currentIndex}</div>
          <div>Is Processing: {node.isProcessing.toString()}</div>
          {node.sorted.length > 0 && <div>Sorted: [{node.sorted.join(', ')}]</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {node.left && <TreeNodeComponent node={node.left} />}
          {node.right && <TreeNodeComponent node={node.right} />}
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Debuggable Tree-based Quicksort Visualizer</h1>
      <div>
        <button onClick={generateRandomArray}>Generate New Array</button>
        <button onClick={nextStep} disabled={finalSortedArray.length === array.length}>
          Next Step
        </button>
      </div>
      <div>Current Step: {currentStep}</div>
      <div>Initial Array: [{array.join(', ')}]</div>
      {tree && (
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <TreeNodeComponent node={tree} />
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <h2>Merge Phase</h2>
        <div>Sorted Array: [{finalSortedArray.join(', ')}]</div>
        {tree && (
          <div>Remaining to merge: [{tree.sorted.join(', ')}]</div>
        )}
      </div>
      {finalSortedArray.length === array.length && <div>Sorting Complete!</div>}
    </div>
  );
};

export default QuicksortTree;