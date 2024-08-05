import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

// Types
interface DataPoint {
  x: number;
  y: number;
}

interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
}

// Main Component
export const LinearRegressionVisualizer: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [regressionResult, setRegressionResult] = useState<RegressionResult | null>(null);
  const [showResiduals, setShowResiduals] = useState(false);

  useEffect(() => {
    if (dataPoints.length >= 2) {
      const result = calculateRegression(dataPoints);
      setRegressionResult(result);
    } else {
      setRegressionResult(null);
    }
  }, [dataPoints]);

  const addPoint = (point: DataPoint) => {
    setDataPoints([...dataPoints, point]);
  };

  const removeLastPoint = () => {
    setDataPoints(dataPoints.slice(0, -1));
  };

  const clearPoints = () => {
    setDataPoints([]);
  };

  const addRandomPoint = () => {
    const newPoint: DataPoint = {
      x: Math.random() * 100,
      y: Math.random() * 100,
    };
    addPoint(newPoint);
  };

  const toggleResiduals = () => {
    setShowResiduals(!showResiduals);
  };

  const handleChartClick = (event: any) => {
    if (event && event.xValue && event.yValue) {
      addPoint({ x: event.xValue, y: event.yValue });
    }
  };

  return (
    <div className="linear-regression-visualizer">
      <ScatterChart 
        width={400} 
        height={400} 
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        onClick={handleChartClick}
      >
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="X" />
        <YAxis type="number" dataKey="y" name="Y" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="Data Points" data={dataPoints} fill="#8884d8" />
        {regressionResult && (
          <ReferenceLine
            segment={[
              { x: 0, y: regressionResult.intercept },
              { x: 100, y: 100 * regressionResult.slope + regressionResult.intercept },
            ]}
            stroke="red"
            strokeWidth={2}
          />
        )}
        {showResiduals &&
          regressionResult &&
          dataPoints.map((point, index) => (
            <ReferenceLine
              key={index}
              segment={[
                { x: point.x, y: point.y },
                { x: point.x, y: regressionResult.slope * point.x + regressionResult.intercept },
              ]}
              stroke="green"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          ))}
      </ScatterChart>

      <div className="control-panel">
        <button onClick={addRandomPoint}>Add Random Point</button>
        <button onClick={removeLastPoint}>Remove Last Point</button>
        <button onClick={clearPoints}>Clear All Points</button>
        <button onClick={toggleResiduals}>
          {showResiduals ? 'Hide Residuals' : 'Show Residuals'}
        </button>
      </div>

      <div className="statistics-panel">
        {regressionResult ? (
          <>
            <h3>Regression Statistics</h3>
            <p>Equation: y = {regressionResult.slope.toFixed(2)}x + {regressionResult.intercept.toFixed(2)}</p>
            <p>Slope: {regressionResult.slope.toFixed(4)}</p>
            <p>Y-Intercept: {regressionResult.intercept.toFixed(4)}</p>
            <p>R-Squared: {regressionResult.rSquared.toFixed(4)}</p>
          </>
        ) : (
          <p>Add at least two points to see statistics.</p>
        )}
      </div>
    </div>
  );
};

// Utility function
function calculateRegression(data: DataPoint[]): RegressionResult {
  const n = data.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;

  for (const point of data) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXX += point.x * point.x;
    sumYY += point.y * point.y;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const rSquared =
    Math.pow(n * sumXY - sumX * sumY, 2) /
    ((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

  return { slope, intercept, rSquared };
}