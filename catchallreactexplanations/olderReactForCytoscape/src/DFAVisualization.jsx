import React, { useEffect, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import styled from 'styled-components';

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

const TwoSumGraphVisualization = () => {
  const [cy, setCy] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const elements = [
    // Main components
    { data: { id: 'main', label: 'Main App Component' } },
    { data: { id: 'vis', label: 'Visualization Container' } },
    { data: { id: 'target', label: 'Target Number Input' } },
    { data: { id: 'numbers', label: 'Number Array Input' } },
    { data: { id: 'step-button', label: 'Step Button' } },
    { data: { id: 'app-state', label: 'App State' } },
    { data: { id: 'update-display', label: 'Update & Display' } },

    // Algorithm steps
    { data: { id: 'step1', label: 'Step 1: Initialize' } },
    { data: { id: 'step2', label: 'Step 2: Check Conditions' } },
    { data: { id: 'step3', label: 'Step 3: Increment i' } },
    { data: { id: 'step4', label: 'Step 4: Increment j' } },
    { data: { id: 'sum-check', label: 'Sum equals target?' } },
    { data: { id: 'i-check', label: 'i < numbers.length' } },
    { data: { id: 'j-check', label: 'j < numbers.length' } },
    { data: { id: 'solution-found', label: 'Found solution' } },
    { data: { id: 'no-solution', label: 'No solution found' } },
    { data: { id: 'end', label: 'End' } },

    // Edges
    { data: { source: 'main', target: 'vis' } },
    { data: { source: 'main', target: 'target' } },
    { data: { source: 'main', target: 'numbers' } },
    { data: { source: 'main', target: 'step-button' } },
    { data: { source: 'main', target: 'app-state' } },
    { data: { source: 'vis', target: 'update-display' } },
    { data: { source: 'target', target: 'app-state' } },
    { data: { source: 'numbers', target: 'app-state' } },
    { data: { source: 'step-button', target: 'step1', label: 'Initiates' } },
    { data: { source: 'step1', target: 'step2', label: 'Next' } },
    { data: { source: 'step2', target: 'i-check' } },
    { data: { source: 'i-check', target: 'j-check', label: 'Yes' } },
    { data: { source: 'j-check', target: 'sum-check', label: 'Yes' } },
    { data: { source: 'sum-check', target: 'solution-found', label: 'Yes' } },
    { data: { source: 'sum-check', target: 'step4', label: 'No' } },
    { data: { source: 'step4', target: 'j-check', label: 'Update' } },
    { data: { source: 'j-check', target: 'step3', label: 'No' } },
    { data: { source: 'step3', target: 'i-check', label: 'Update' } },
    { data: { source: 'i-check', target: 'no-solution', label: 'No' } },
    { data: { source: 'solution-found', target: 'end' } },
    { data: { source: 'no-solution', target: 'end' } },
    { data: { source: 'end', target: 'update-display' } },
    { data: { source: 'update-display', target: 'step1', label: 'Cycle' } },
  ];

  const layout = {
    name: 'dagre',
    rankDir: 'TB',
    padding: 50,
    spacingFactor: 1.5,
  };

  const style = [
    {
      selector: 'node',
      style: {
        'background-color': '#4a90e2',
        'label': 'data(label)',
        'color': '#fff',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'wrap',
        'text-max-width': '100px',
        'font-size': '10px',
        'width': '80px', // Increased node width
        'height': '80px', // Increased node height
        'padding': '10px'

      }
    },
    {
      selector: 'edge',
      style: {
        'width': 1,
        'line-color': '#9dbaea',
        'target-arrow-color': '#9dbaea',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'label': 'data(label)',
        'font-size': '8px',
        'text-rotation': 'autorotate',
      }
    },
    {
      selector: '.highlighted',
      style: {
        'background-color': '#ff7f50',
        'line-color': '#ff7f50',
        'target-arrow-color': '#ff7f50',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s'
      }
    }
  ];

  useEffect(() => {
    if (cy) {
      cy.elements().removeClass('highlighted');
      highlightStep(currentStep);
    }
  }, [cy, currentStep]);

  const highlightStep = (step) => {
    if (!cy) return;

    const highlightNodes = {
      1: ['step1', 'app-state', 'update-display'],
      2: ['step2', 'i-check', 'j-check', 'sum-check'],
      3: ['step3', 'i-check'],
      4: ['step4', 'j-check'],
    };

    highlightNodes[step].forEach(nodeId => {
      cy.getElementById(nodeId).addClass('highlighted');
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
          style={{ width: '100%', height: '100%' }}
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

export default TwoSumGraphVisualization;