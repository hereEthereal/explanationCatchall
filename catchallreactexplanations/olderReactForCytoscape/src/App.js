import React from 'react';
import CytoscapeComponent from './CytoscapeComponent';
import CytoscapeSpiralGraph from './CytoscapeSpiralGraph';
import CytoscapeBinaryTree from './CytoscapeBinaryTree';
import CytoscapeBinaryTreeA from "./CytoscapeBinaryTreeA"

const App = () => {
  return (
    <div>
      <h1>Hello, React!</h1>
      {/* <CytoscapeComponent />
      <CytoscapeSpiralGraph /> */}
      {/* <CytoscapeBinaryTree /> */}
      <CytoscapeBinaryTreeA />
    </div>
  );
};

export default App;