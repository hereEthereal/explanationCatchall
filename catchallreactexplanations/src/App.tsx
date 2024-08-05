import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import AppA from "./projects/AppA";
import AppB from "./projects/AppB";
import SquareRootB from "./projects/SquareRootB";
import GridTool from "./projects/GridTool";
import { LongFormSubtraction } from "./projects/LongFormSubtraction";
import LongFormAddition from "./projects/LongFormAddition";
import DraggableQuadrilateral from "./projects/DraggableQuadrilateral";
import TrigCircleVisualization from "./projects/AtanTangentTrig";
import ShapeContainer from "./projects/VolumeEstimate";
import MathEquationSolver from "./projects/MathEquationSolver";
import BinarySearchVisualizer from "./projects/BinarySearch/BinarySearchVisualizer";
import BubbleSortVisualizer from "./projects/BubbleSortVisualizer/BubbleSortVisualizer";
import FibonacciGenerator from "./projects/FibonacciGenerator/FibonacciGenerator"
import path from "path";
import SieveVisualizer from "./projects/SieveVisualizer/SieveVisualizer";
import TrigVisualizer from "./projects/TrigVisualizer/TrigVisualizer";
import SetOperationsVisualizer from "./projects/SetOperationsVisualizer/SetOperationsVisualizer";
import QuadraticSolver from "./projects/QuadraticSolver/QuadraticSolver";
import { LinearRegressionVisualizer } from "./projects/LinearRegressionVisualizer/LinearRegressionVisualizer";
import { HarmonicVisualizer } from "./projects/HarmonicVisualizer/HarmonicVisualizer";
import ArraysHashingFlow from "./projects/ArraysHashingFlow";

const projectList = [
  { name: "App A", path: "/app-a", element: <AppA /> },
  { name: "App B", path: "/app-b", element: <AppB /> },
  {
    name: "Babylonian Method Square Visualizer",
    path: "/square-root",
    element: <SquareRootB />,
  },
  { name: "Grid Tool", path: "/grid-tool", element: <GridTool /> },
  {
    name: "Long Form Subtraction",
    path: "/long-form-subtraction",
    element: <LongFormSubtraction />,
  },
  {
    name: "Long Form Addition",
    path: "/long-form-addition",
    element: <LongFormAddition />,
  },
  {
    name: "Draggable Quadrilateral",
    path: "/draggable-quadrilateral",
    element: <DraggableQuadrilateral />,
  },
  {
    name: "Trig Visualization",
    path: "/trig-visualization",
    element: <TrigCircleVisualization />,
  },
  {
    name: "Volume Approximation",
    path: "/volume-approximation",
    element: <ShapeContainer />,
  },
  {
    name: "math-equation-solver",
    path: "/math equation solver",
    element: <MathEquationSolver />,
  },
  {
    name: "BinarySearchVisualizer",
    path: "BinarySearchVisualizer",
    element: <BinarySearchVisualizer arraySize={20} maxIncrement={10} />
    ,
  },
  {
    name: "BubbleSortVisualizer",
    path: "BubbleSortVisualizer",
    element: (
      <BubbleSortVisualizer
        initialArray={[64, 34, 25, 12, 22, 11, 90]}
        speed={300}
      />
    ),
  },
  {
    name: "FibonacciGenerator",
    path: "FibonacciGenerator",
    element: (
      <FibonacciGenerator maxSteps={30} />

    ),
  },
  {
    name: "SieveVisualizer",
    path: "SieveVisualizer",
    element: (
      <SieveVisualizer maxNumber={100} />

    ),
  },
  {
    name: "TrigVisualizer",
    path: "TrigVisualizer",
    element: (
      <TrigVisualizer width={800} height={600} />

    ),
  },
  {
    name: "SetOperationsVisualizer",
    path: "SetOperationsVisualizer",
    element: (
      <SetOperationsVisualizer />

    ),
  },
  {
    name: "QuadraticSolver",
    path: "QuadraticSolver",
    element: (
      <QuadraticSolver />

    ),
  },
  {
    name: "LinearRegressionVisualizer",
    path: "LinearRegressionVisualizer",
    element: (
      <LinearRegressionVisualizer />

    ),
  },
  {
    name: "HarmonicVisualizer",
    path: "HarmonicVisualizer",
    element: (
      <HarmonicVisualizer />

    ),
  },
  {
    name: "ArraysHashingFlow",
    path: "ArraysHashingFlow",
    element: (
      <ArraysHashingFlow />

    ),
  }
];

const Home: React.FC = () => (
  <div>
    <h1>Catchall - My React Projects</h1>
    <ul>
      {projectList.map((project, index) => (
        <li key={index}>
          <Link to={project.path}>{project.name}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          {projectList.map((project, index) => (
            <Route key={index} path={project.path} element={project.element} />
          ))}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
