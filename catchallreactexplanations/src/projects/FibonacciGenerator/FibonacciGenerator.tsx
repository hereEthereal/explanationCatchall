import React, { useState, useEffect } from 'react';

interface FibonacciGeneratorProps {
  maxSteps?: number;
}

const FibonacciGenerator: React.FC<FibonacciGeneratorProps> = ({ maxSteps = 20 }) => {
  const [sequence, setSequence] = useState<number[]>([0, 1]);
  const [currentStep, setCurrentStep] = useState<number>(2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000); // milliseconds

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStep < maxSteps) {
      timer = setTimeout(generateNextNumber, speed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed]);

  const generateNextNumber = () => {
    if (currentStep < maxSteps) {
      const nextNumber = sequence[currentStep - 1] + sequence[currentStep - 2];
      setSequence([...sequence, nextNumber]);
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setSequence([0, 1]);
    setCurrentStep(2);
    setIsPlaying(false);
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(2000 - parseInt(event.target.value));
  };

  return (
    <div className="fibonacci-generator">
      <h2>Fibonacci Sequence Generator</h2>
      <div className="sequence-display">
        {sequence.map((num, index) => (
          <span key={index} className={index === currentStep - 1 ? 'current' : ''}>
            {num}
          </span>
        ))}
      </div>
      <div className="controls">
        <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={generateNextNumber} disabled={currentStep >= maxSteps}>
          Next
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <div className="speed-control">
        <label htmlFor="speed">Speed: </label>
        <input
          type="range"
          id="speed"
          min="0"
          max="1900"
          value={2000 - speed}
          onChange={handleSpeedChange}
        />
      </div>
      <div className="step-info">
        <p>Current Step: {currentStep}</p>
        <p>
          Current Number: {sequence[currentStep - 1]} = {sequence[currentStep - 2]} + {sequence[currentStep - 3]}
        </p>
      </div>
    </div>
  );
};

export default FibonacciGenerator;