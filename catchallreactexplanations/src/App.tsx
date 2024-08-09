import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate, useLocation } from 'react-router-dom';
// ... (keep all your existing imports)

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
import FibonacciGenerator from "./projects/FibonacciGenerator/FibonacciGenerator";
import path from "path";
import SieveVisualizer from "./projects/SieveVisualizer/SieveVisualizer";
import TrigVisualizer from "./projects/TrigVisualizer/TrigVisualizer";
import SetOperationsVisualizer from "./projects/SetOperationsVisualizer/SetOperationsVisualizer";
import QuadraticSolver from "./projects/QuadraticSolver/QuadraticSolver";
import { LinearRegressionVisualizer } from "./projects/LinearRegressionVisualizer/LinearRegressionVisualizer";
import { HarmonicVisualizer } from "./projects/HarmonicVisualizer/HarmonicVisualizer";
import ArraysHashingFlow from "./projects/ArraysHashingFlow";
import EuclideanGCD from "./projects/EuclideanGCD/EuclideanGCD";
import BasicMatrixOperations from "./projects/BasicMatrixOperations/BasicMatrixOperations";
import SimpleHarmonicMotion from "./projects/SimpleHarmonicMotion/SimpleHarmonicMotion";
import LogicGatesSimulator from "./projects/LogicGatesSimulator/LogicGatesSimulator";
import LinkedListVisualizer from "./projects/LinkedListVisualizer/LinkedListVisualizer";
import RhythmTypingTrainer from "./projects/typing/RhythmTypingTrainer";
import QuickSort from "./projects/QuicksortComponent";
import QuicksortVisualizer from "./projects/QuicksortComponent";
import OrgChartTree from "./projects/OrgTree";
import QSTree from "./projects/QSTree";
import QSTreeA from "./projects/QSTreeA";
// import BinaryTreeCyto from "./projects/BinaryTreeCyto";
import QuickSortVisualizerTree from "./projects/BinaryTreeSortedSVG";
import ExampleA from "./projects/BinaryTreeSortedSVG";
import BinaryTreeSortedSVG from "./projects/BinaryTreeSortedSVG";
import BinaryTreeReact from "./projects/BinaryTreeKonva";
import BinaryTreeKonva from "./projects/BinaryTreeKonva";
import BinarySearchTreeKonvaSearch from "./projects/BinaryTreeKonvaSearch";
import AVLTreeKonva from "./projects/AVLTreeKonva";
import BabylonianMethodSquareVisualizer from "./projects/BabylonianMethodSquareVisualizer";
import BinarySearchTreeKonva from "./projects/BinaryTreeKonva";

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
    element: <BinarySearchVisualizer arraySize={20} maxIncrement={10} />,
  },
  {
    name: "BubbleSortVisualizer",
    path: "BubbleSortVisualizer",
    element: (
      <BubbleSortVisualizer
        initialArray={[64, 34, 25, 12, 22, 11, 90]}
        initialSpeed={300}
      />
    ),
  },
  {
    name: "FibonacciGenerator",
    path: "FibonacciGenerator",
    element: <FibonacciGenerator maxSteps={30} />,
  },
  {
    name: "SieveVisualizer",
    path: "SieveVisualizer",
    element: <SieveVisualizer maxNumber={100} />,
  },
  {
    name: "TrigVisualizer",
    path: "TrigVisualizer",
    element: <TrigVisualizer width={800} height={600} />,
  },
  {
    name: "SetOperationsVisualizer",
    path: "SetOperationsVisualizer",
    element: <SetOperationsVisualizer />,
  },
  {
    name: "QuadraticSolver",
    path: "QuadraticSolver",
    element: <QuadraticSolver />,
  },
  {
    name: "LinearRegressionVisualizer",
    path: "LinearRegressionVisualizer",
    element: <LinearRegressionVisualizer />,
  },
  {
    name: "HarmonicVisualizer",
    path: "HarmonicVisualizer",
    element: <HarmonicVisualizer />,
  },
  {
    name: "ArraysHashingFlow",
    path: "ArraysHashingFlow",
    element: <ArraysHashingFlow />,
  },
  {
    name: "EuclideanGCD",
    path: "EuclideanGCD",
    element: <EuclideanGCD />,
  },
  {
    name: "SimpleHarmonicMotion",
    path: "SimpleHarmonicMotion",
    element: <SimpleHarmonicMotion />,
  },
  {
    name: "LogicGatesSimulator",
    path: "LogicGatesSimulator",
    element: <LogicGatesSimulator />,
  },
  {
    name: "BasicMatrixOperations",
    path: "BasicMatrixOperations",
    element: <BasicMatrixOperations />,
  },
  {
    name: "LinkedListVisualizer",
    path: "LinkedListVisualizer",
    element: <LinkedListVisualizer />,
  },
  {
    name: "RhythmTypingTrainer",
    path: "RhythmTypingTrainer",
    element: <RhythmTypingTrainer />,
  },
  {
    name: "QuicksortComponent",
    path: "QuicksortComponent",
    element: <QuicksortVisualizer />,
  },
  {
    name: "OrgChartTree",
    path: "OrgChartTree",
    element: <OrgChartTree />,
  },
  {
    name: "QSTree",
    path: "QSTree",
    element: <QSTree />,
  },
  {
    name: "QSTreeA",
    path: "QSTreeA",
    element: <QSTreeA />,
  },
  // {
  //   name: "QuickSortB",
  //   path: "QuickSortB",
  //   element: <QuickSortB initialArray={[3,6,2,7,1,8]} />,
  // }, 
  {
    name: "BinaryTreeSortedSVG",
    path: "BinaryTreeSortedSVG",
    element: <BinaryTreeSortedSVG />,
  },  
  {
    name: "BinaryTreeKonva",
    path: "BinaryTreeKonva",
    element: <BinaryTreeKonva />,
  },  
  {
    name: "BinarySearchTreeKonvaSearch",
    path: "BinarySearchTreeKonvaSearch",
    element: <BinarySearchTreeKonvaSearch />,
  },  
  {
    name: "AVLTreeKonva BROKEN",
    path: "AVLTreeKonva",
    element: <AVLTreeKonva />,
  },  
];

const presentationList = [
  {
    name: "BabylonianMethodSquareVisualizer",
    path: "BabylonianMethodSquareVisualizer",
    element: <BabylonianMethodSquareVisualizer />,
  },  
  {
    name: "BubbleSortVisualizer",
    path: "BubbleSortVisualizer",
    element: <BubbleSortVisualizer   />,
  },  
  {
    name: "BinarySearchTreeKonva",
    path: "BinarySearchTreeKonva",
    element: <BinarySearchTreeKonva   />,
  },  
  {
    name: "BinarySearchTreeKonvaSearch",
    path: "BinarySearchTreeKonvaSearch",
    element: <BinarySearchTreeKonvaSearch />,
  },  
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
    <h2>Presentations</h2>
    <ul>
      {presentationList.map((project, index) => (
        <li key={index}>
          <Link to={project.path}>{project.name}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const App: React.FC = () => {
  const [currentPresentationIndex, setCurrentPresentationIndex] = useState(0);
  const [keyPressTime, setKeyPressTime] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname.slice(1); // Remove leading '/'
    const index = presentationList.findIndex(presentation => presentation.path === currentPath);
    if (index !== -1) {
      setCurrentPresentationIndex(index);
    }
  }, [location]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'w' || e.key === 'e') {
        if (!keyPressTime) {
          setKeyPressTime(Date.now());
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'w' || e.key === 'e') {
        if (keyPressTime && Date.now() - keyPressTime >= 200) {
          navigateToNextPresentation();
        }
        setKeyPressTime(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyPressTime, currentPresentationIndex]);

  const navigateToNextPresentation = () => {
    const nextIndex = (currentPresentationIndex + 1) % presentationList.length;
    navigate('/' + presentationList[nextIndex].path);
  };

  const navigateToPreviousPresentation = () => {
    const previousIndex = (currentPresentationIndex - 1 + presentationList.length) % presentationList.length;
    navigate('/' + presentationList[previousIndex].path);
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <button onClick={navigateToPreviousPresentation}>Previous Presentation</button>
          </li>
          <li>
            <button onClick={navigateToNextPresentation}>Next Presentation</button>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        {projectList.map((project, index) => (
          <Route key={index} path={project.path} element={project.element} />
        ))}
        {presentationList.map((presentation, index) => (
          <Route key={index} path={presentation.path} element={presentation.element} />
        ))}
      </Routes>
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;