import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

const CytoDiagram = () => {
  const cyRef = useRef(null);

  useEffect(() => {
    if (!cyRef.current) return;

    const cy = cytoscape({
      container: cyRef.current,
      elements: [
        // Nodes
        { data: { id: 'main', label: 'Main App Component' } },
        { data: { id: 'ina', label: 'Number Array Input' } },
        { data: { id: 'int', label: 'Target Number Input' } },
        { data: { id: 'vc', label: 'Visualization Controller' } },
        { data: { id: 'gr', label: 'Graph Rendering' } },
        { data: { id: 'lm', label: 'Layout Management' } },
        { data: { id: 'in', label: 'Interaction Handling' } },
        { data: { id: 'sb', label: 'Step Button' } },
        { data: { id: 'sp', label: 'Step Pointer' } },
        { data: { id: 's1', label: 'Step 1: Initialize' } },
        { data: { id: 's2', label: 'Step 2: Check Conditions' } },
        { data: { id: 's3', label: 'Step 3: Increment j' } },
        { data: { id: 's4', label: 'Step 4: Increment i' } },
        { data: { id: 'd', label: 'i < numbers.length - 1' } },
        { data: { id: 'e', label: 'j = i + 1' } },
        { data: { id: 'f', label: 'j < numbers.length' } },
        { data: { id: 'g', label: 'Sum equals target?' } },
        { data: { id: 'h', label: 'Found solution' } },
        { data: { id: 'i', label: 'j++' } },
        { data: { id: 'j', label: 'i++' } },
        { data: { id: 'k', label: 'No solution found' } },
        { data: { id: 'l', label: 'End' } },
        { data: { id: 'm', label: 'Update i display' } },
        { data: { id: 'n', label: 'Update j display' } },
        { data: { id: 'o', label: 'Update sum display' } },
        { data: { id: 'r', label: 'Display result' } },
        { data: { id: 'as', label: 'App State' } },

        // Edges for step cycle
        { data: { source: 's1', target: 's2', label: 'Next' } },
        { data: { source: 's2', target: 's3', label: 'Next' } },
        { data: { source: 's3', target: 's4', label: 'Next' } },
        { data: { source: 's4', target: 's2', label: 'Next' } },

        // Edges for algorithm logic
        { data: { source: 's1', target: 'e', label: 'Initialize' } },
        { data: { source: 's2', target: 'd', label: 'Check' } },
        { data: { source: 's2', target: 'f', label: 'Check' } },
        { data: { source: 's2', target: 'g', label: 'Check' } },
        { data: { source: 's3', target: 'i', label: 'Perform' } },
        { data: { source: 's4', target: 'j', label: 'Perform' } },
        { data: { source: 'd', target: 'f', label: 'Yes' } },
        { data: { source: 'f', target: 'g', label: 'Yes' } },
        { data: { source: 'g', target: 'h', label: 'Yes' } },
        { data: { source: 'g', target: 's3', label: 'No' } },
        { data: { source: 'f', target: 's4', label: 'No' } },
        { data: { source: 'd', target: 'k', label: 'No' } },
        { data: { source: 'h', target: 'l' } },
        { data: { source: 'k', target: 'l' } },

        // UI update edges
        { data: { source: 's2', target: 'o', label: 'Update' } },
        { data: { source: 's3', target: 'n', label: 'Update' } },
        { data: { source: 's4', target: 'm', label: 'Update' } },
        { data: { source: 'h', target: 'r' } },
        { data: { source: 'k', target: 'r' } },

        // App structure edges
        { data: { source: 'main', target: 'ina' } },
        { data: { source: 'main', target: 'int' } },
        { data: { source: 'main', target: 'vc' } },
        { data: { source: 'vc', target: 'gr' } },
        { data: { source: 'vc', target: 'lm' } },
        { data: { source: 'vc', target: 'in' } },
        { data: { source: 'sb', target: 'sp' } },
        { data: { source: 'main', target: 'as' } },
        { data: { source: 'ina', target: 'as' } },
        { data: { source: 'int', target: 'as' } },
      ],
      style: [
        {
          selector: 'node',
          style: {
            'content': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'shape': 'roundrectangle',
            'background-color': '#ddd',
            'padding': '10px',
            'font-size': '10px',
            'width': 'label',
            'height': 'label',
            'text-wrap': 'wrap'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#999',
            'target-arrow-color': '#999',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '8px'
          }
        },
        {
          selector: '.highlighted',
          style: {
            'line-color': '#ff0000',
            'target-arrow-color': '#ff0000',
            'width': 4
          }
        },
        {
          selector: 'edge[label = "Next"]',
          style: {
            'line-color': '#4CAF50',
            'target-arrow-color': '#4CAF50'
          }
        }
      ],
      layout: {
        name: 'dagre',
        rankDir: 'TB',
        nodeSep: 70,
        rankSep: 120,
        fit: true,
        padding: 50
      }
    });

    // Add hover highlighting functionality
    cy.on('mouseover', 'node', function(e) {
      e.target.outgoers('edge').addClass('highlighted');
    });

    cy.on('mouseout', 'node', function(e) {
      e.target.outgoers('edge').removeClass('highlighted');
    });

    // Fit the graph to the container
    cy.fit();

    // Cleanup function
    return () => {
      cy.destroy();
    };
  }, []);

  return <div ref={cyRef} style={{ width: '100%', height: '1000px' }} />;
};

export default CytoDiagram;