import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface QuadraticSolverProps {
  initialA?: number;
  initialB?: number;
  initialC?: number;
}

const QuadraticSolver: React.FC<QuadraticSolverProps> = ({ initialA = 1, initialB = 0, initialC = -1 }) => {
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const [c, setC] = useState(initialC);
  const [roots, setRoots] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [showSteps, setShowSteps] = useState(false);

  useEffect(() => {
    solveEquation();
  }, [a, b, c]);

  const solveEquation = () => {
    const newSteps: string[] = [];
    newSteps.push(`Step 1: Identify the coefficients`);
    newSteps.push(`a = ${a}, b = ${b}, c = ${c}`);

    newSteps.push(`Step 2: Calculate the discriminant`);
    const discriminant = b * b - 4 * a * c;
    newSteps.push(`discriminant = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`);

    newSteps.push(`Step 3: Calculate the roots`);
    if (discriminant > 0) {
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      setRoots([root1.toFixed(2), root2.toFixed(2)]);
      newSteps.push(`Two real roots:`);
      newSteps.push(`x₁ = (-b + √(b² - 4ac)) / (2a) = ${root1.toFixed(2)}`);
      newSteps.push(`x₂ = (-b - √(b² - 4ac)) / (2a) = ${root2.toFixed(2)}`);
    } else if (discriminant === 0) {
      const root = -b / (2 * a);
      setRoots([root.toFixed(2)]);
      newSteps.push(`One real root:`);
      newSteps.push(`x = -b / (2a) = ${root.toFixed(2)}`);
    } else {
      const realPart = -b / (2 * a);
      const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
      setRoots([
        `${realPart.toFixed(2)} + ${imaginaryPart.toFixed(2)}i`,
        `${realPart.toFixed(2)} - ${imaginaryPart.toFixed(2)}i`,
      ]);
      newSteps.push(`Two complex roots:`);
      newSteps.push(`x₁ = ${realPart.toFixed(2)} + ${imaginaryPart.toFixed(2)}i`);
      newSteps.push(`x₂ = ${realPart.toFixed(2)} - ${imaginaryPart.toFixed(2)}i`);
    }

    setSteps(newSteps);
  };

  const generateChartData = () => {
    const xValues = Array.from({ length: 21 }, (_, i) => i - 10);
    const yValues = xValues.map(x => a * x * x + b * x + c);

    return {
      labels: xValues,
      datasets: [
        {
          label: 'Quadratic Function',
          data: yValues,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  };

  return (
    <div className="quadratic-solver">
      <h2>Quadratic Equation Solver</h2>
      <div className="equation-display">
        <span>{a}x² + {b}x + {c} = 0</span>
      </div>
      <div className="coefficient-inputs">
        <label>
          a: <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} />
        </label>
        <label>
          b: <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} />
        </label>
        <label>
          c: <input type="number" value={c} onChange={(e) => setC(Number(e.target.value))} />
        </label>
      </div>
      <div className="graph-visualizer">
        <Line data={generateChartData()} />
      </div>
      <div className="root-display">
        <h3>Roots:</h3>
        <ul>
          {roots.map((root, index) => (
            <li key={index}>{root}</li>
          ))}
        </ul>
      </div>
      <div className="solution-steps">
        <button onClick={() => setShowSteps(!showSteps)}>
          {showSteps ? 'Hide Steps' : 'Show Steps'}
        </button>
        {showSteps && (
          <ol>
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default QuadraticSolver;