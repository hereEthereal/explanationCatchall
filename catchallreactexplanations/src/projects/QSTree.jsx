import React, { useState } from 'react';
import Tree from 'react-d3-tree';


function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[arr.length - 1];
  const leftArr = [];
  const rightArr = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      leftArr.push(arr[i]);
    } else {
      rightArr.push(arr[i]);
    }
  }

  // Handle Our UI here as well
  return [...quickSort(leftArr), pivot, ...quickSort(rightArr)];
}

const QSTree = () => {
  const [ourArray, setOurArray] = useState([3, 9, 2, 8, 5, 1, 7]);
  const [treeData, setTreeData] = useState({
    name: 'Root',
    attributes: {  array: ourArray },
  });
  const [currentStep, setCurrentStep] = useState(0);
  const sortedResult = quickSort(ourArray)


  const partition = (node) => {
    console.log('Partitioning node:', node);
    if (!node.attributes || node.attributes.array.length <= 1) {
      console.log('Node cannot be partitioned further');
      return false;
    }

    const array = node.attributes.array;
    const pivot = array[array.length - 1];
    const left = array.filter(num => num < pivot);
    const right = array.filter(num => num > pivot);

    console.log(`Pivot: ${pivot}, Left: [${left}], Right: [${right}]`);

    node.attributes.pivot = pivot;
    node.children = [
      { name: 'Left', attributes: { array: left } },
      { name: 'Right', attributes: { array: right } },
    ];

    setTreeData({ ...treeData });
    return true;
  };

  const step = () => {
    console.log('Starting new step');
    const traverse = (node) => {
      console.log('Traversing node:', node);
      if (!node.children) {
        return partition(node);
      }
      for (let i = 0; i < node.children.length; i++) {
        if (traverse(node.children[i])) {
          return true;
        }
      }
      return false;
    };

    if (traverse(treeData)) {
      setCurrentStep(currentStep + 1);
      console.log('Step completed');
    } else {
      console.log('Sorting completed');
    }
  };

  const renderCustomNode = ({ nodeDatum }) => (
    <g>
      <circle r={20} />
      <text dy=".31em" x={30} strokeWidth="1">
        {nodeDatum.attributes.array.join(', ')}
      </text>
      {nodeDatum.attributes.pivot !== undefined && (
        <text dy="1.31em" x={30} strokeWidth="1">
          Pivot: {nodeDatum.attributes.pivot}
        </text>
      )}
    </g>
  );

  return (
    <div>
      <div style={{ height: '800px', width: '100%' }}>
        <Tree
          data={treeData}
          renderCustomNodeElement={renderCustomNode}
          orientation="vertical"
        />
      </div>
      <button onClick={step}>Next Step</button>
      {sortedResult && (
        <div>
          <h3>Sorted Result:</h3>
          <p>{sortedResult.join(', ')}</p>
        </div>
      )}
      <p>Step: {currentStep}</p>
    </div>
  );
};

export default QSTree;