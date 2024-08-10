import React from 'react';
import CytoscapeComponent from './CytoscapeComponent';
import CytoscapeSpiralGraph from './CytoscapeSpiralGraph';
import CytoscapeBinaryTree from './CytoscapeBinaryTree';
import CytoscapeBinaryTreeA from "./CytoscapeBinaryTreeA"
import CytoscapeShapeTransformer from './CytoscapeShapeTransformer';   
import TwoSumSolver from "./TwoSumSolver" 
import DFAVisualization  from './DFAVisualization';
import MyTwoSumGraphVisualization  from './MyDFAVisualization.jsx';
import CytoDiagram from './cytoscapeDiagram';
import GridGraph from "./GridGraph"

const App = () => {
  return (
    <div>
      <h1>Hello, React!</h1>

      {/* <TwoSumSolver /> */}
      {/* <CytoDiagram /> */}
      <MyTwoSumGraphVisualization />
      {/* <DFAVisualization /> */}
      {/* <CytoscapeShapeTransformer /> */}
      {/* <GridGraph /> */}
      {/* <CytoscapeComponent />
      <CytoscapeSpiralGraph /> */}
      {/* <CytoscapeBinaryTree /> */}
      {/* <CytoscapeBinaryTreeA /> */}
    </div>
  );
};

export default App;