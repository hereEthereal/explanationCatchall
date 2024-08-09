import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import AudioPlayer from "./Audio/AudioPlayer";
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
import AudioPlayerComponent from "./Audio/AudioPlayerWrapper";

interface IterationData {
  iteration: number;
  x: number;
  complementary: number;
  average: number;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const SuccessMessage = styled.div<{ show: boolean }>`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4caf50;
  color: white;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: ${(props) => (props.show ? fadeIn : fadeOut)} 0.5s ease-in-out;
  display: ${(props) => (props.show ? "block" : "none")};
`;

const BabylonianMethodSquareVisualizer: React.FC = () => {
  const [S, setS] = useState<number>(100);
  const [initialGuess, setInitialGuess] = useState<number>(2);
  const [currentIteration, setCurrentIteration] = useState<number>(0);
  const [iterations, setIterations] = useState<IterationData[]>([]);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1000);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [manualGuess, setManualGuess] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const isConverged = useCallback(
    (x: number) => {
      return Math.abs(x * x - S) / S < 0.0001; // Relative error
    },
    [S]
  );

  const calculateIterations = useCallback(
    (startGuess: number = initialGuess) => {
      const newIterations: IterationData[] = [];
      let x = startGuess;
      for (let i = 0; i < 20; i++) {
        // Increased max iterations
        const complementary = S / x;
        const newX = (x + complementary) / 2;
        newIterations.push({
          iteration: i,
          x: x,
          complementary: complementary,
          average: newX,
        });
        if (isConverged(newX)) break;
        x = newX;
      }
      setIterations(newIterations);
      setCurrentIteration(0);
      setShowSuccess(false);
    },
    [S, initialGuess, isConverged]
  );

  useEffect(() => {
    calculateIterations();
  }, [S, initialGuess, calculateIterations]);

  useEffect(() => {
    calculateIterations();
  }, [S, initialGuess, calculateIterations]);

  const animate = useCallback(() => {
    setIsAnimating(true);
    setShowSuccess(false);
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < iterations.length - 1) {
        setCurrentIteration(i + 1);
        i++;
      } else {
        clearInterval(intervalId);
        setIsAnimating(false);
        if (isConverged(iterations[i].average)) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }
      }
    }, animationSpeed);
    return () => clearInterval(intervalId);
  }, [iterations, animationSpeed, isConverged]);

  const step = () => {
    if (currentIteration < iterations.length - 1) {
      setCurrentIteration((prev) => {
        const next = prev + 1;
        if (isConverged(iterations[next].average)) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        }
        return next;
      });
    }
  };

  const reset = () => {
    setCurrentIteration(0);
    setShowSuccess(false);
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
      <SuccessMessage show={showSuccess}>
        Success! The algorithm has converged on the square root of {S}.
      </SuccessMessage>

      <div>
        <h1>Central concept: </h1>
        <h2>
          guess times (the area divided by guess) equals the area as represented
          by a rectangle
        </h2>
      </div>

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
        {/* <input
          type="number"
          value={manualGuess}
          onChange={(e) => setManualGuess(e.target.value)}
          placeholder="Enter manual guess"
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleManualGuess}>Use Manual Guess</button> */}
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
      <AudioPlayer />
      <AudioPlayerComponent filePath={"./babylonianSquareRootAlgorithmExplanationLong.mp3"} buttonText={"long explanation"} />
      

      <p> let's learn the Babylonian Method Square algorithm!</p>

      <p>
        {" "}
        Central concept: guess times the area divided by guess equals the area.
      </p>

      <p>
        {" "}
        Let's assign the operation area divided by guess to a variable that's
        more intuitive; we'll call it Guess Complement.
      </p>
      <p>
        {" "}
        An important insight is that our guess times guess complement equals the
        area, and that visually this is represented by a rectangle.
      </p>

      <p> Our goal is to turn this guess rectangle into the answer square.</p>
      <p>
        {" "}
        We can do this iteratively by taking the average of guess and guess
        complement because the average is closer to our answer, as the answer is
        guaranteed to be between guess and guess complement.
      </p>

      <p>
        {" "}
        By taking the average and reassigning it to our next iteration's guess
        and repeating the process, we converge towards our answer; the rectangle
        becomes a square!
      </p>
      <p> ---</p>
      <p>
        {" "}
        to find the square root of a number, simply guess! and then iteratively
        improve your guess. the guess here is visualized as a rectanggle and
        with this clever algorithm discovered by ancient Babylonians, we can
        quickly converge to the square root of any number.`;
      </p>
    </div>
  );
};

export default BabylonianMethodSquareVisualizer;

// let's learn the Babylonian Method Square algorithm!

// Central concept:
// guess times the area divided by guess  equals the area.

// We can see the guesses cancel.

// Let's assign the operation area divided by guess to a variable that's more intuitive; we'll call it Guess Complement.

// An important insight is that our guess times guess complement equals the area, and that visually this is represented by a rectangle.

// Our goal is to turn this guess rectangle into the answer square.

// We can do this iteratively by taking the average of guess and guess complement because the average is closer to our answer, as the answer is guaranteed to be between guess and guess complement.

// By taking the average and reassigning it to our next iteration's guess and repeating the process, we converge towards our answer; the rectangle becomes a square!

// ---

// to find the square root of a number, simply guess! and then iteratively improve your guess. the guess here is visualized as a rectanggle and with this clever algorithm discovered by ancient Babylonians, we can quickly converge to the square root of any number.`;
