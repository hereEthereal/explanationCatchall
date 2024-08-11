import React, { useState } from 'react';

const MyTwoSum = () => {
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 100, 5, 6, 50, 7, 8, 9]);
  const [target, setTarget] = useState(150);
  const [currentStep, setCurrentStep] = useState(0);
  const [solutionFound, setSolutionFound] = useState(false);
  const [log, setLog] = useState([]);
  const [highlightedNumbers, setHighlightedNumbers] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'numbers') {
      setNumbers(value.split(',').map(Number));
    } else if (name === 'target') {
      setTarget(parseInt(value, 10));
    }
  };

  const runAlgorithm = () => {
    setCurrentStep(0);
    setSolutionFound(false);
    setLog([]);
    setHighlightedNumbers({});
  };

  const handlePlay = () => {
    runAlgorithm();
    stepThroughAlgorithm();
  };

  const stepThroughAlgorithm = () => {
    if (currentStep < numbers.length * (numbers.length - 1) / 2) {
      const i = Math.floor(currentStep / (numbers.length - 1));
      const j = currentStep % (numbers.length - 1);
      setHighlightedNumbers({ [i]: true, [j + i + 1]: true });
      const sum = numbers[i] + numbers[j + i + 1];
      setLog((prevLog) => [...prevLog, `Comparing ${numbers[i]} and ${numbers[j + i + 1]}: ${sum} === ${target}`]);
      if (sum === target) {
        setSolutionFound(true);
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePause = () => {};

  const handleStep = () => {
    stepThroughAlgorithm();
  };

  return (
    <div>
      <h1>2Sum Problem Solver</h1>
      <form>
        <label>
          Numbers (comma-separated):
          <input type="text" name="numbers" value={numbers.join(',')} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Target Sum:
          <input type="number" name="target" value={target} onChange={handleInputChange} />
        </label>
      </form>
      <button onClick={handlePlay}>Play</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleStep}>Step</button>
      {solutionFound ? (
        <p>Solution found: {numbers.join(',')} contains a pair of numbers that sum to {target}.</p>
      ) : (
        <p>No solution found yet...</p>
      )}
            <h2>Numbers:</h2>
      <ul>
        {numbers.map((number, index) => (
          <li
            key={index}
            style={{
              backgroundColor: highlightedNumbers[index] ? 'yellow' : 'white',
              color: highlightedNumbers[index] && solutionFound ? 'red' : 'black',
            }}
          >
            {number}
          </li>
        ))}
      </ul>
      <h2>Log:</h2>
      <ul>
        {log.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyTwoSum;