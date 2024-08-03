import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface IterationData {
  iteration: number;
  x: number;
  complementary: number;
  average: number;
}

const SquareRootB: React.FC = () => {
  const [S, setS] = useState<number>(100);
  const [initialGuess, setInitialGuess] = useState<number>(10);
  const [currentIteration, setCurrentIteration] = useState<number>(0);
  const [iterations, setIterations] = useState<IterationData[]>([]);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1000);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [manualGuess, setManualGuess] = useState<string>("");

  const calculateIterations = useCallback(
    (startGuess: number = initialGuess) => {
      const newIterations: IterationData[] = [];
      let x = startGuess;
      for (let i = 0; i < 10; i++) {
        const complementary = S / x;
        const newX = (x + complementary) / 2;
        newIterations.push({
          iteration: i,
          x: x,
          complementary: complementary,
          average: newX,
        });
        x = newX;
        if (Math.abs(x - complementary) < 0.0001) break;
      }
      setIterations(newIterations);
      setCurrentIteration(0);
    },
    [S, initialGuess]
  );

  useEffect(() => {
    calculateIterations();
  }, [S, initialGuess, calculateIterations]);

  const animate = useCallback(() => {
    setIsAnimating(true);
    let i = currentIteration;
    const intervalId = setInterval(() => {
      if (i < iterations.length - 1) {
        setCurrentIteration(i + 1);
        i++;
      } else {
        clearInterval(intervalId);
        setIsAnimating(false);
      }
    }, animationSpeed);
    return () => clearInterval(intervalId);
  }, [currentIteration, iterations, animationSpeed]);

  const step = () => {
    if (currentIteration < iterations.length - 1) {
      setCurrentIteration(currentIteration + 1);
    }
  };

  const reset = () => {
    setCurrentIteration(0);
  };

  const handleManualGuess = () => {
    const guess = parseFloat(manualGuess);
    if (!isNaN(guess) && guess > 0) {
      calculateIterations(guess);
      setManualGuess("");
    }
  };

  const targetSize = 300;
  const scale = targetSize / Math.sqrt(S);

  const rectangleStyle: React.CSSProperties = {
    width: `${(iterations[currentIteration]?.complementary || 0) * scale}px`,
    height: `${(iterations[currentIteration]?.x || 0) * scale}px`,
    border: "2px solid blue",
    position: "absolute",
    transition: "all 0.5s ease-in-out",
  };

  const squareStyle: React.CSSProperties = {
    width: `${Math.sqrt(S) * scale}px`,
    height: `${Math.sqrt(S) * scale}px`,
    border: "2px dashed red",
    position: "absolute",
  };

  const currentGraphData = useMemo(() => {
    return iterations.slice(0, currentIteration + 1).map((iter) => ({
      ...iter,
      sqrtS: Math.sqrt(S),
    }));
  }, [iterations, currentIteration, S]);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h2>Babylonian Method Square Visualizer</h2>

      <p> Make an initial guess. Guess any positive number x0 </p>
      <p>
        {" "}
        Improve the guess. Apply the formula x1 = (x0 + S / x0) / 2. The number
        x1 is a better approximation to sqrt(S).
      </p>
      <p>
        {" "}
        Iterate until convergence. Apply the formula xn+1 = (xn + S / xn) / 2
        until the process converges. Convergence is achieved when the digits of
        xn+1 and xn agree to as many decimal places as you desire.
      </p>
      <div style={{ marginBottom: "20px" }}>
        <label>
          S:
          <input
            type="number"
            value={S}
            onChange={(e) => setS(Number(e.target.value))}
            style={{ marginLeft: "10px", marginRight: "20px" }}
          />
        </label>
        <label>
          Initial Guess:
          <input
            type="number"
            value={initialGuess}
            onChange={(e) => setInitialGuess(Number(e.target.value))}
            style={{ marginLeft: "10px", marginRight: "20px" }}
          />
        </label>
        <label>
          Animation Speed (ms):
          <input
            type="number"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            style={{ marginLeft: "10px", marginRight: "20px" }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={animate}
          disabled={isAnimating}
          style={{ marginRight: "10px" }}
        >
          {isAnimating ? "Animating..." : "Animate"}
        </button>
        <button
          onClick={step}
          disabled={isAnimating || currentIteration === iterations.length - 1}
          style={{ marginRight: "10px" }}
        >
          Step
        </button>
        <button
          onClick={reset}
          disabled={isAnimating || currentIteration === 0}
          style={{ marginRight: "10px" }}
        >
          Reset
        </button>
        <input
          type="number"
          value={manualGuess}
          onChange={(e) => setManualGuess(e.target.value)}
          placeholder="Enter manual guess"
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleManualGuess}>Use Manual Guess</button>
      </div>
      <div style={{ position: "relative", width: "100%", height: "400px" }}>
        <div style={squareStyle}></div>
        <div style={rectangleStyle}></div>
        <div
          style={{
            position: "absolute",
            top: `${(iterations[currentIteration]?.x || 0) * scale + 5}px`,
            left: "0px",
            transform: "rotate(-90deg)",
            transformOrigin: "top left",
          }}
        >
          x₀ = {iterations[currentIteration]?.x.toFixed(4) || "N/A"}
        </div>
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: "5px",
          }}
        >
          S/x₀ = {S} / {iterations[currentIteration]?.x.toFixed(4) || "N/A"} ={" "}
          {iterations[currentIteration]?.complementary.toFixed(4) || "N/A"}
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h3>Current Iteration: {currentIteration}</h3>
        <p>x₀ = {iterations[currentIteration]?.x.toFixed(6) || "N/A"}</p>
        <p>
          S/x₀ = {S} / {iterations[currentIteration]?.x.toFixed(6) || "N/A"} ={" "}
          {iterations[currentIteration]?.complementary.toFixed(6) || "N/A"}
        </p>
        <p>
          Next x₀ = (x₀ + S/x₀)/2 = (
          {iterations[currentIteration]?.x.toFixed(6) || "N/A"} +{" "}
          {iterations[currentIteration]?.complementary.toFixed(6) || "N/A"})/2 ={" "}
          {iterations[currentIteration]?.average.toFixed(6) || "N/A"}
        </p>
      </div>
      <div style={{ marginTop: "40px" }}>
        <h3>Convergence Graph</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={currentGraphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="iteration" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="x" name="x₀" stroke="#8884d8" />
            <Line
              type="monotone"
              dataKey="complementary"
              name="S/x₀"
              stroke="#82ca9d"
            />
            <Line
              type="monotone"
              dataKey="average"
              name="Next x₀"
              stroke="#ffc658"
            />
            <Line
              type="monotone"
              dataKey="sqrtS"
              name="√S"
              stroke="#ff7300"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SquareRootB;
