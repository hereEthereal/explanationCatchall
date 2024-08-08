import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';

const QuickSortB = ({ initialArray }) => {
  const [originalArray, setOriginalArray] = useState([]);
  const [tree, setTree] = useState(null);
  const [sortedArray, setSortedArray] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepDescription, setStepDescription] = useState('');

  useEffect(() => {
    setOriginalArray([...initialArray]);
    const rootNode = initializeTree(initialArray);
    setTree(rootNode);
    setStepDescription('Initial array loaded. Click "Step" to start QuickSort.');
  }, [initialArray]);

  const initializeTree = (arr) => {
    return {
      name: 'Root',
      attributes: {
        pivot: null,
        inputArray: arr,
      },
      children: [],
    };
  };

  const performStep = () => {
    const newTree = { ...tree };
    const result = quickSortStep(newTree);
    setTree(result.tree);
    setStepDescription(result.description);
    setCurrentStep(currentStep + 1);

    if (result.sorted) {
      const sorted = reconstructSortedArray(result.tree);
      setSortedArray(sorted);
    }
  };

  const quickSortStep = (node) => {
    if (!node.attributes.pivot && node.attributes.inputArray.length > 1) {
      // Choose pivot and partition
      const pivot = node.attributes.inputArray[0];
      const { left, right } = partition(node.attributes.inputArray, pivot);
      
      node.attributes.pivot = pivot;
      node.children = [
        { name: 'Left', attributes: { inputArray: left, pivot: null }, children: [] },
        { name: 'Right', attributes: { inputArray: right, pivot: null }, children: [] },
      ];

      return {
        tree: node,
        description: `Chose pivot ${pivot} and partitioned array.`,
        sorted: false,
      };
    } else if (node.children.length === 2) {
      // Recurse on child nodes
      const leftResult = quickSortStep(node.children[0]);
      if (!leftResult.sorted) return { tree: node, description: leftResult.description, sorted: false };

      const rightResult = quickSortStep(node.children[1]);
      return { tree: node, description: rightResult.description, sorted: rightResult.sorted };
    }

    // Node is fully sorted
    return { tree: node, description: 'Subarray sorted.', sorted: true };
  };

  const partition = (arr, pivot) => {
    const left = arr.filter(x => x < pivot);
    const right = arr.filter(x => x > pivot);
    return { left, right };
  };

  const reconstructSortedArray = (node) => {
    if (!node.children.length) return [node.attributes.pivot];
    const left = node.children[0] ? reconstructSortedArray(node.children[0]) : [];
    const right = node.children[1] ? reconstructSortedArray(node.children[1]) : [];
    return [...left, node.attributes.pivot, ...right].filter(x => x !== null);
  };

  const renderNodeContent = ({ nodeDatum }) => (
    <g>
      <circle r={20} />
      <text dy=".31em" textAnchor="middle" style={{ fill: 'white' }}>
        {nodeDatum.attributes.pivot || 'N/A'}
      </text>
      <text dy="2em" textAnchor="middle" style={{ fontSize: '10px' }}>
        {nodeDatum.attributes.inputArray.join(', ')}
      </text>
    </g>
  );

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2>QuickSort Visualization</h2>
      <div>
        <strong>Original Array:</strong> {originalArray.join(', ')}
      </div>
      <div style={{ height: '500px', border: '1px solid #ccc', margin: '20px 0' }}>
        {tree && (
          <Tree
            data={tree}
            renderCustomNodeElement={renderNodeContent}
            orientation="vertical"
          />
        )}
      </div>
      <div>
        <strong>Step Description:</strong> {stepDescription}
      </div>
      <button onClick={performStep} disabled={sortedArray.length > 0}>
        Step
      </button>
      {sortedArray.length > 0 && (
        <div>
          <strong>Sorted Array:</strong> {sortedArray.join(', ')}
        </div>
      )}
    </div>
  );
};

export default QuickSortB;