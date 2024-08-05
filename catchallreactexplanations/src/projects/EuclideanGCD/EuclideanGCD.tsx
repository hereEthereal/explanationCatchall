import React, { useState, useEffect } from 'react';

interface Step {
  a: number;
  b: number;
  remainder: number;
  quotient: number;
}

const EuclideanGCD: React.FC = () => {
  const [numberA, setNumberA] = useState<number>(0);
  const [numberB, setNumberB] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const calculateGCD = (a: number, b: number): Step[] => {
    const steps: Step[] = [];
    while (b !== 0) {
      const remainder = a % b;
      const quotient = Math.floor(a / b);
      steps.push({ a, b, remainder, quotient });
      a = b;
      b = remainder;
    }
    return steps;
  };

  const handleStart = () => {
    if (numberA > 0 && numberB > 0) {
      const calculatedSteps = calculateGCD(numberA, numberB);
      setSteps(calculatedSteps);
      setCurrentStep(0);
      setIsComplete(false);
    }
  };

  const handleStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  useEffect(() => {
    if (steps.length > 0 && currentStep === steps.length - 1) {
      setIsComplete(true);
    }
  }, [currentStep, steps]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Euclidean Algorithm for GCD</h1>
      <div>
        <input
          type="number"
          value={numberA}
          onChange={(e) => setNumberA(Number(e.target.value))}
          placeholder="Enter number A"
          style={{ marginRight: '10px' }}
        />
        <input
          type="number"
          value={numberB}
          onChange={(e) => setNumberB(Number(e.target.value))}
          placeholder="Enter number B"
          style={{ marginRight: '10px' }}
        />
        <button onClick={handleStart}>Start</button>
      </div>

      {steps.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Visualization</h2>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div
              style={{
                width: `${(steps[currentStep].a / Math.max(numberA, numberB)) * 100}%`,
                height: '30px',
                backgroundColor: 'blue',
                marginRight: '10px',
              }}
            ></div>
            <span>{steps[currentStep].a}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div
              style={{
                width: `${(steps[currentStep].b / Math.max(numberA, numberB)) * 100}%`,
                height: '30px',
                backgroundColor: 'green',
                marginRight: '10px',
              }}
            ></div>
            <span>{steps[currentStep].b}</span>
          </div>
          <div>
            <h3>Step Information</h3>
            <p>Step: {currentStep + 1}</p>
            <p>
              Equation: {steps[currentStep].a} = {steps[currentStep].b} * {steps[currentStep].quotient} + {steps[currentStep].remainder}
            </p>
            <p>
              Explanation: We divide {steps[currentStep].a} by {steps[currentStep].b}. 
              The quotient is {steps[currentStep].quotient} and the remainder is {steps[currentStep].remainder}.
            </p>
          </div>
          <button onClick={handleStep} disabled={isComplete}>
            {isComplete ? 'Complete' : 'Next Step'}
          </button>
          {isComplete && (
            <p>
              The GCD of {numberA} and {numberB} is {steps[steps.length - 1].b}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EuclideanGCD;