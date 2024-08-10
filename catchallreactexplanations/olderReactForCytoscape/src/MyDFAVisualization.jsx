import React, { useEffect, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import styled from "styled-components";

cytoscape.use(dagre);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 800px;
`;

const GraphContainer = styled.div`
  width: 100%;
  height: 700px;
  border: 1px solid #ccc;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const StepDescription = styled.p`
  text-align: center;
  margin-bottom: 20px;
`;

const MyTwoSumGraphVisualization = () => {
  const [cy, setCy] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const elements = [
    // Main components

    { data: { id: "fooWrapper", label: "Foo Wrapper" } },

    // Child nodes
    { data: { id: "fooA", label: "Foo A", parent: "fooWrapper" } },
    { data: { id: "fooB", label: "Foo B", parent: "fooWrapper" } },
    { data: { id: "fooC", label: "Foo C", parent: "fooWrapper" } },

    { data: { id: "fooPointer", label: "Foo Pointer" } },

    {
      data: { source: "fooPointer", target: "fooWrapper", label: "points to" },
    },

    { data: { source: "fooA", target: "fooB" } },
    { data: { source: "fooB", target: "fooC" } },
    { data: { source: "fooC", target: "fooA" } },

    { data: { id: "step1", label: "Step 1", parent: "stepWrapper" } },
    { data: { id: "step2", label: "Step 2", parent: "stepWrapper" } },
    { data: { id: "step3", label: "Step 3", parent: "stepWrapper" } },
    { data: { id: "step4", label: "Step 4", parent: "stepWrapper" } },

    { data: { id: "stepWrapper", label: "Step Wrapper" } },
    { data: { id: "stepPointer", label: "Step Pointer" } },
    {
      data: {
        source: "stepPointer",
        target: "stepWrapper",
        label: "points to",
      },
    },

    // { data: { id: 'main', label: 'Main App Component' } },
    // { data: { id: 'vis', label: 'Visualization Container' } },
    // { data: { id: 'target', label: 'Target Number Input' } },
    // { data: { id: 'numbers', label: 'Number Array Input' } },
    // { data: { id: 'step-button', label: 'Step Button' } },
    // { data: { id: 'app-state', label: 'App State' } },
    // { data: { id: 'update-display', label: 'Update & Display' } },

    // // Algorithm steps
    // { data: { id: 'sum-check', label: 'Sum equals target?' } },
    // { data: { id: 'i-check', label: 'i < numbers.length' } },
    // { data: { id: 'j-check', label: 'j < numbers.length' } },
    // { data: { id: 'solution-found', label: 'Found solution' } },
    // { data: { id: 'no-solution', label: 'No solution found' } },
    // { data: { id: 'end', label: 'End' } },



    // Edges
    { data: { source: "step1", target: "step2", label: "Next" } },
    { data: { source: "step2", target: "step3", label: "Next" } },
    { data: { source: "step3", target: "step4", label: "Next" } },
    { data: { source: "step4", target: "step1", label: "Next" } },
  ];

  const layout = {
    name: "dagre",
    rankDir: "TB",
    padding: 50,
    spacingFactor: 1.5,
  };

  const style = [
    {
      selector: "node",
      style: {
        "background-color": "#4a90e2",
        label: "data(label)",
        color: "#fff",
        "text-valign": "center",
        "text-halign": "center",
        "text-wrap": "wrap",
        "text-max-width": "100px",
        "font-size": "10px",
        width: "80px", // Increased node width
        height: "80px", // Increased node height
        padding: "10px",
      },
    },
    {
      selector: "edge",
      style: {
        width: 1,
        "line-color": "#9dbaea",
        "target-arrow-color": "#9dbaea",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        label: "data(label)",
        "font-size": "8px",
        "text-rotation": "autorotate",
      },
    },
    {
      selector: ".highlighted",
      style: {
        "background-color": "#ff7f50",
        "line-color": "#ff7f50",
        "target-arrow-color": "#ff7f50",
        "transition-property":
          "background-color, line-color, target-arrow-color",
        "transition-duration": "0.5s",
      },
    },
    {
      selector: ":parent",
      style: {
        "background-opacity": 0.333,
        "background-color": "#dadada",
        "border-color": "#555",
        "border-width": 3,
        "text-valign": "top",
        "text-halign": "center",
        "text-margin-y": 5,
      },
    },
    {
      selector: "#fooPointer",
      style: {
        "background-color": "#ff7f50",
        shape: "diamond",
      },
    },
  ];

  useEffect(() => {
    if (cy) {
      cy.elements().removeClass("highlighted");
      highlightStep(currentStep);
    }
  }, [cy, currentStep]);

  const highlightStep = (step) => {
    if (!cy) return;

    const highlightNodes = {
      1: ["step1", "app-state", "update-display"],
      2: ["step2", "i-check", "j-check", "sum-check"],
      3: ["step3", "i-check"],
      4: ["step4", "j-check"],
    };

    highlightNodes[step].forEach((nodeId) => {
      cy.getElementById(nodeId).addClass("highlighted");
    });
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => (prevStep % 4) + 1);
  };

  const getStepDescription = (step) => {
    const descriptions = {
      1: "Initialize variables and set up the algorithm",
      2: "Check conditions: i < numbers.length, j < numbers.length, and sum == target",
      3: "Increment i and reset j if needed",
      4: "Increment j and continue searching",
    };
    return descriptions[step];
  };

  return (
    <Container>
      <StepDescription>{getStepDescription(currentStep)}</StepDescription>
      <GraphContainer>
        <CytoscapeComponent
          elements={elements}
          layout={layout}
          style={{ width: "100%", height: "100%" }}
          stylesheet={style}
          cy={(cy) => setCy(cy)}
        />
      </GraphContainer>
      <ControlsContainer>
        <button onClick={handleNextStep}>Next Step</button>
      </ControlsContainer>
    </Container>
  );
};

export default MyTwoSumGraphVisualization;
