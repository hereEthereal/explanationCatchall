import React, { useState, useEffect, useCallback } from 'react';
import './SieveVisualizer.css';

interface SieveVisualizerProps {
  maxNumber: number;
}

const SieveVisualizer: React.FC<SieveVisualizerProps> = ({ maxNumber }) => {
  const [numbers, setNumbers] = useState<boolean[]>([]);
  const [currentPrime, setCurrentPrime] = useState<number>(2);
  const [step, setStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);

  useEffect(() => {
    initializeSieve();
  }, [maxNumber]);

  const initializeSieve = () => {
    const initialNumbers = new Array(maxNumber + 1).fill(true);
    initialNumbers[0] = initialNumbers[1] = false;
    setNumbers(initialNumbers);
    setCurrentPrime(2);
    setStep(0);
    setIsRunning(false);
  };

  const nextStep = useCallback(() => {
    if (currentPrime * currentPrime > maxNumber) {
      setIsRunning(false);
      return;
    }

    const newNumbers = [...numbers];
    for (let i = currentPrime * currentPrime; i <= maxNumber; i += currentPrime) {
      newNumbers[i] = false;
    }
    setNumbers(newNumbers);

    let nextPrime = currentPrime + 1;
    while (nextPrime <= maxNumber && !newNumbers[nextPrime]) {
      nextPrime++;
    }
    setCurrentPrime(nextPrime);
    setStep((prevStep) => prevStep + 1);
  }, [currentPrime, maxNumber, numbers]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setTimeout(nextStep, speed);
    }
    return () => clearTimeout(timer);
  }, [isRunning, nextStep, speed]);

  const toggleRunning = () => {
    setIsRunning((prev) => !prev);
  };

  const reset = () => {
    initializeSieve();
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(1000 - parseInt(e.target.value, 10));
  };

  return (
    <div className="sieve-visualizer">
      <div className="control-panel">
        <button onClick={toggleRunning}>{isRunning ? 'Pause' : 'Play'}</button>
        <button onClick={nextStep} disabled={isRunning}>Next Step</button>
        <button onClick={reset}>Reset</button>
        <input
          type="range"
          min="0"
          max="900"
          value={1000 - speed}
          onChange={handleSpeedChange}
        />
      </div>
      <div className="step-info">
        <p>Current Prime: {currentPrime}</p>
        <p>Step: {step}</p>
      </div>
      <div className="number-grid">
        {numbers.map((isPrime, index) => (
          index > 1 && (
            <div
              key={index}
              className={`number ${isPrime ? 'prime' : 'not-prime'} ${index === currentPrime ? 'current' : ''}`}
            >
              {index}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default SieveVisualizer;