import React, { useState } from 'react';
import './BasicMatrixOperations.css';

type Matrix = number[][];

interface Step {
  explanation: string;
  result: Matrix;
  highlightCells: [number, number][];
}

const BasicMatrixOperations: React.FC = () => {
  const [matrixA, setMatrixA] = useState<Matrix>([[1, 2], [3, 4]]);
  const [matrixB, setMatrixB] = useState<Matrix>([[5, 6], [7, 8]]);
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply' | 'scalar'>('add');
  const [scalar, setScalar] = useState<number>(2);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);

  const generateSteps = () => {
    const newSteps: Step[] = [];
    let result: Matrix = [];

    switch (operation) {
      case 'add':
      case 'subtract':
        result = matrixA.map((row, i) =>
          row.map((val, j) => {
            const bVal = matrixB[i][j];
            const newVal = operation === 'add' ? val + bVal : val - bVal;
            newSteps.push({
              explanation: `${val} ${operation === 'add' ? '+' : '-'} ${bVal} = ${newVal}`,
              result: result.map((r, ri) => r.map((c, ci) => (ri === i && ci === j) ? newVal : c)),
              highlightCells: [[i, j]]
            });
            return newVal;
          })
        );
        break;
      case 'multiply':
        result = matrixA.map((row, i) =>
          matrixB[0].map((_, j) => {
            let sum = 0;
            for (let k = 0; k < matrixB.length; k++) {
              sum += row[k] * matrixB[k][j];
              newSteps.push({
                explanation: `${row[k]} * ${matrixB[k][j]} = ${row[k] * matrixB[k][j]}`,
                result: result.map((r, ri) => r.map((c, ci) => (ri === i && ci === j) ? sum : c)),
                highlightCells: [[i, k], [k, j]]
              });
            }
            return sum;
          })
        );
        break;
      case 'scalar':
        result = matrixA.map((row, i) =>
          row.map((val, j) => {
            const newVal = val * scalar;
            newSteps.push({
              explanation: `${val} * ${scalar} = ${newVal}`,
              result: result.map((r, ri) => r.map((c, ci) => (ri === i && ci === j) ? newVal : c)),
              highlightCells: [[i, j]]
            });
            return newVal;
          })
        );
        break;
    }

    setSteps(newSteps);
    setCurrentStep(0);
  };

  const handleStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderMatrix = (matrix: Matrix, highlight: [number, number][] = []) => (
    <table className="matrix">
      <tbody>
        {matrix.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className={highlight.some(([hi, hj]) => hi === i && hj === j) ? 'highlight' : ''}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="basic-matrix-operations">
      <h2>Basic Matrix Operations</h2>
      <div className="matrices">
        <div>
          <h3>Matrix A</h3>
          {renderMatrix(matrixA)}
        </div>
        <div>
          <h3>Matrix B</h3>
          {renderMatrix(matrixB)}
        </div>
      </div>
      <div className="controls">
        <select value={operation} onChange={(e) => setOperation(e.target.value as any)}>
          <option value="add">Addition</option>
          <option value="subtract">Subtraction</option>
          <option value="multiply">Multiplication</option>
          <option value="scalar">Scalar Multiplication</option>
        </select>
        {operation === 'scalar' && (
          <input
            type="number"
            value={scalar}
            onChange={(e) => setScalar(Number(e.target.value))}
            placeholder="Scalar value"
          />
        )}
        <button onClick={generateSteps}>Start</button>
        <button onClick={handleStep} disabled={currentStep === steps.length - 1}>Step</button>
      </div>
      {steps.length > 0 && (
        <div className="result">
          <h3>Result</h3>
          {renderMatrix(steps[currentStep].result, steps[currentStep].highlightCells)}
          <p>{steps[currentStep].explanation}</p>
        </div>
      )}
    </div>
  );
};

export default BasicMatrixOperations;