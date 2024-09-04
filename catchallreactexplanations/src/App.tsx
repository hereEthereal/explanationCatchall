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
import EuclideanGCD from "./projects/EuclideanGCD/EuclideanGCD";
import LinkedListVisualizer from "./projects/LinkedListVisualizer/LinkedListVisualizer";
import RhythmTypingTrainer from "./projects/typing/RhythmTypingTrainer";
import QuickSort from "./projects/QuicksortComponent";
import QuicksortVisualizer from "./projects/QuicksortComponent";
import QSTree from "./projects/QSTree";
// import BinaryTreeCyto from "./projects/BinaryTreeCyto";
import QuickSortVisualizerTree from "./projects/BinaryTreeSortedSVG";
import ExampleA from "./projects/BinaryTreeSortedSVG";
import BinaryTreeSortedSVG from "./projects/BinaryTreeSortedSVG";
import BinaryTreeReact from "./projects/BinaryTreeKonva";
import BinaryTreeKonva from "./projects/BinaryTreeKonva";
import BinarySearchTreeKonvaSearch from "./projects/BinaryTreeKonvaSearch";
import BabylonianMethodSquareVisualizer from "./projects/BabylonianMethodSquareVisualizer";
import BinarySearchTreeKonva from "./projects/BinaryTreeKonva";
import TwoSumNestedLoop from './projects/2SumNestedLoop';
import TwoSumEfficientVisualizer from './projects/TwoSumEfficientVisualizer';
import TwoSumSortedPointerVisualizer from './projects/TwoSumSortedPointerVisualizer';
import MyTwoSum from './projects/MyTwoSum';
import TwoSumWrapper from './projects/TwoSumWrapper';
import QSTreeA from './projects/QSTreeA';
// import QSTreeB from './projects/QSTreeB';
import PathfindingVisualization from './projects/PathfindingVisualization';
import QSTreeB from './projects/QSTreeB';

const projectList = [
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
    name: "EuclideanGCD",
    path: "EuclideanGCD",
    element: <EuclideanGCD />,
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
    name: "QSTree",
    path: "QSTree",
    element: <QSTree />,
  },
  {
    name: "QSTree Dynamic With correct spacing",
    path: "QSTree Dynamic With correct spacing",
    element: <QSTreeB />,
  },
  {
    name: "PathfindingVisualization",
    path: "PathfindingVisualization",
    element: <PathfindingVisualization />,
  },
  // {
  //   name: "QuickSortB",
  //   path: "QuickSortB",
  //   element: <QuickSortB initialArray={[3,6,2,7,1,8]} />,
  // }, 
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
    name: "TwoSumWrapper",
    path: "TwoSumWrapper",
    element: <TwoSumWrapper />,
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
  {
    name: "TwoSumEfficientVisualizer",
    path: "TwoSumEfficientVisualizer",
    element: <TwoSumEfficientVisualizer numbers={[1,2,3,4,100,5,6,50,7,8,9]} target={150} isStartButtonPressed={false} speed={1}/>,
  },  
  {
    name: "TwoSumSortedPointerVisualizer",
    path: "TwoSumSortedPointerVisualizer",
    element: <TwoSumSortedPointerVisualizer numbers={[1,2,3,4,100,5,6,50,7,8,9]} target={150} isStartButtonPressed={false} speed={1} />,
  },   
  {
    name: "MyTwoSum",
    path: "MyTwoSum",
    element: <MyTwoSum />,
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