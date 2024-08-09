import React from 'react';
import CytoscapeComponent from './CytoscapeComponent';
import CytoscapeSpiralGraph from './CytoscapeSpiralGraph';
import CytoscapeBinaryTree from './CytoscapeBinaryTree';
import CytoscapeBinaryTreeA from "./CytoscapeBinaryTreeA"
import GridGraph from "./GridGraph"

const App = () => {
  return (
    <div>
      <h1>Hello, React!</h1>
      <GridGraph />
      {/* <CytoscapeComponent />
      <CytoscapeSpiralGraph /> */}
      {/* <CytoscapeBinaryTree /> */}
      {/* <CytoscapeBinaryTreeA /> */}
    </div>
  );
};

export default App;