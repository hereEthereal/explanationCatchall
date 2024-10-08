import React, { useState, useEffect } from 'react';

interface SetOperationsVisualizerProps {
  // Add any props you might need to pass from the parent component
}

const SetOperationsVisualizer: React.FC<SetOperationsVisualizerProps> = () => {
  const [setA, setSetA] = useState<string[]>([]);
  const [setB, setSetB] = useState<string[]>([]);
  const [result, setResult] = useState<string[]>([]);
  const [operation, setOperation] = useState<'union' | 'intersection' | 'difference'>('union');
  const [inputA, setInputA] = useState<string>('');
  const [inputB, setInputB] = useState<string>('');

  const addToSet = (set: 'A' | 'B') => {
    const input = set === 'A' ? inputA : inputB;
    const elements = input.split(' ').map(item => item.trim()).filter(item => item !== '');
    if (set === 'A') {
      setSetA([...setA, ...elements]);
      setInputA('');
    } else {
      setSetB([...setB, ...elements]);
      setInputB('');
    }
  };

  const performOperation = () => {
    switch (operation) {
      case 'union':
        setResult([...new Set([...setA, ...setB])]);
        break;
      case 'intersection':
        setResult(setA.filter(item => setB.includes(item)));
        break;
      case 'difference':
        setResult(setA.filter(item => !setB.includes(item)));
        break;
    }
  };

  useEffect(() => {
    performOperation();
  }, [setA, setB, operation]);

  return (
    <div className="set-operations-visualizer">
      <h2>Set Operations Visualizer</h2>
      
      <div className="set-inputs">
        <div>
          <label htmlFor="setA">Set A:</label>
          <input
            id="setA"
            type="text"
            value={inputA}
            onChange={(e) => setInputA(e.target.value)}
            placeholder="Space-separated items"
          />
          <button onClick={() => addToSet('A')}>Add to Set A</button>
        </div>
        <div>
          <label htmlFor="setB">Set B:</label>
          <input
            id="setB"
            type="text"
            value={inputB}
            onChange={(e) => setInputB(e.target.value)}
            placeholder="Space-separated items"
          />
          <button onClick={() => addToSet('B')}>Add to Set B</button>
        </div>
      </div>

      <div className="operation-controls">
        <button onClick={() => setOperation('union')} className={operation === 'union' ? 'active' : ''}>
          Union
        </button>
        <button onClick={() => setOperation('intersection')} className={operation === 'intersection' ? 'active' : ''}>
          Intersection
        </button>
        <button onClick={() => setOperation('difference')} className={operation === 'difference' ? 'active' : ''}>
          Difference (A - B)
        </button>
      </div>

      <div className="result-display">
        <h3>Result:</h3>
        <p>{result.join(' ')}</p>
      </div>

      <div className="set-display">
        <div>
          <h3>Set A:</h3>
          <p>{setA.join(' ')}</p>
        </div>
        <div>
          <h3>Set B:</h3>
          <p>{setB.join(' ')}</p>
        </div>
      </div>
    </div>
  );
};

export default SetOperationsVisualizer;