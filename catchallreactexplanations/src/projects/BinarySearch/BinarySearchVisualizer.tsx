import React, { useState, useEffect } from 'react';
import './BinarySearchVisualizer.css';

interface BinarySearchVisualizerProps {
  arraySize: number;
  maxIncrement: number;
}

const BinarySearchVisualizer: React.FC<BinarySearchVisualizerProps> = ({ arraySize, maxIncrement }) => {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number | null>(null);
  const [left, setLeft] = useState<number>(0);
  const [right, setRight] = useState<number>(arraySize - 1);
  const [mid, setMid] = useState<number | null>(null);
  const [found, setFound] = useState<boolean | null>(null);
  const [stepCount, setStepCount] = useState<number>(0);

  useEffect(() => {
    generateRandomSortedArray();
  }, [arraySize, maxIncrement]);

  const generateRandomSortedArray = () => {
    let newArray: number[] = [];
    let currentNumber = 1;

    for (let i = 0; i < arraySize; i++) {
      currentNumber += Math.floor(Math.random() * maxIncrement) + 1;
      newArray.push(currentNumber);
    }

    setArray(newArray);
    resetSearch();
  };

  const resetSearch = () => {
    setLeft(0);
    setRight(arraySize - 1);
    setMid(null);
    setFound(null);
    setStepCount(0);
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTarget = parseInt(e.target.value);
    setTarget(isNaN(newTarget) ? null : newTarget);
    resetSearch();
  };

  const nextStep = () => {
    if (left <= right && target !== null) {
      const newMid = Math.floor((left + right) / 2);
      setMid(newMid);
      setStepCount((prevCount) => prevCount + 1);

      if (array[newMid] === target) {
        setFound(true);
      } else if (array[newMid] < target) {
        setLeft(newMid + 1);
      } else {
        setRight(newMid - 1);
      }
    } else if (found === null) {
      setFound(false);
    }
  };

  return (
    <div className="binary-search-visualizer">
      <h2>Binary Search Visualizer</h2>
      <div className="control-panel">
        <input
          type="number"
          placeholder="Enter target number"
          onChange={handleTargetChange}
          min={1}
          max={array[arraySize - 1]}
          value={target || ''}
        />
        <button onClick={nextStep} disabled={found !== null || target === null}>
          Next Step
        </button>
        <button onClick={resetSearch}>Reset</button>
        <button onClick={generateRandomSortedArray}>New Array</button>
      </div>
      <div className="array-container">
        {array.map((num, index) => (
          <div
            key={index}
            className={`array-item ${index === mid ? 'mid' : ''} ${
              index >= left && index <= right ? 'in-range' : ''
            } ${num === target ? 'target' : ''}`}
          >
            {num}
          </div>
        ))}
      </div>
      <div className="step-info">
        <p>Step Count: {stepCount}</p>
        <p>Current Range: [{left}, {right}]</p>
        <p>Midpoint: {mid !== null ? array[mid] : 'N/A'}</p>
        {found === true && <p className="success">Target found!</p>}
        {found === false && <p className="failure">Target not found.</p>}
      </div>
    </div>
  );
};

export default BinarySearchVisualizer;