import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

const GridGraph = () => {
  const cyRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const gridSize = 5; // 5x5 grid
    const elements = [];

    // Create nodes
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        elements.push({ data: { id: `node-${i}-${j}` } });
      }
    }

    // Create edges (including diagonals)
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Right
        if (j < gridSize - 1) {
          elements.push({ data: { source: `node-${i}-${j}`, target: `node-${i}-${j+1}` } });
        }
        // Down
        if (i < gridSize - 1) {
          elements.push({ data: { source: `node-${i}-${j}`, target: `node-${i+1}-${j}` } });
        }
        // Diagonal down-right
        if (i < gridSize - 1 && j < gridSize - 1) {
          elements.push({ data: { source: `node-${i}-${j}`, target: `node-${i+1}-${j+1}` } });
        }
        // Diagonal down-left
        if (i < gridSize - 1 && j > 0) {
          elements.push({ data: { source: `node-${i}-${j}`, target: `node-${i+1}-${j-1}` } });
        }
      }
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(id)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#ccc'
          }
        }
      ],
      layout: { 
        name: 'grid',
        rows: gridSize,
        cols: gridSize
      }
    });

    cy.journeyMode = false;
    cy.journeyStart = null;
    cy.journeyEnd = null;

    cy.on('tap', 'node', (event) => {
      const node = event.target;
      console.log('Node clicked:', node.id());
      if (cy.journeyMode) {
        if (!cy.journeyStart) {
          cy.journeyStart = node;
          node.style('background-color', 'green');
        } else if (!cy.journeyEnd && node !== cy.journeyStart) {
          cy.journeyEnd = node;
          node.style('background-color', 'red');
        } else {
          // Reset journey if both are already selected
          cy.elements().style('background-color', '#666');
          cy.journeyStart = node;
          cy.journeyEnd = null;
          node.style('background-color', 'green');
        }
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, []);

  const toggleJourneyMode = () => {
    const cy = cyRef.current;
    cy.journeyMode = !cy.journeyMode;
    if (!cy.journeyMode) {
      cy.elements().style('background-color', '#666');
      cy.journeyStart = null;
      cy.journeyEnd = null;
    }
    console.log('Journey Mode:', cy.journeyMode ? 'On' : 'Off');
  };

  const startJourney = () => {
    const cy = cyRef.current;
    if (cy.journeyStart && cy.journeyEnd) {
      const dijkstra = cy.elements().dijkstra(cy.journeyStart);
      const path = dijkstra.pathTo(cy.journeyEnd);
      path.style('background-color', 'yellow');
    } else {
      alert('Please select both start and end nodes before starting the journey.');
    }
  };

  return (
    <div>
      <div ref={containerRef} style={{ width: '100%', height: '400px' }} />
      <div>
        <button onClick={toggleJourneyMode}>Toggle Journey Mode</button>
        <button onClick={startJourney}>Start Journey</button>
      </div>
    </div>
  );
};

export default GridGraph;