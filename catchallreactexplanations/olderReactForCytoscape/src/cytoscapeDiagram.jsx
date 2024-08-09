import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

const CytoDiagram = () => {
  const cyRef = useRef(null);

  useEffect(() => {
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
        { data: { id: 's1', label: 'Step 1: Check sum' } },
        { data: { id: 's2', label: 'Step 2: Increment j' } },
        { data: { id: 's3', label: 'Step 3: Increment i' } },
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

        // Edges
        { data: { source: 'main', target: 'ina' } },
        { data: { source: 'main', target: 'int' } },
        { data: { source: 'main', target: 'vc' } },
        { data: { source: 'vc', target: 'gr' } },
        { data: { source: 'vc', target: 'lm' } },
        { data: { source: 'vc', target: 'in' } },
        { data: { source: 'sb', target: 'sp' } },
        { data: { source: 'sp', target: 's1' } },
        { data: { source: 's1', target: 's2' } },
        { data: { source: 's2', target: 's1' } },
        { data: { source: 's1', target: 's3' } },
        { data: { source: 's3', target: 's1' } },
        { data: { source: 'd', target: 'e', label: 'Yes' } },
        { data: { source: 'e', target: 'f' } },
        { data: { source: 'f', target: 'g', label: 'Yes' } },
        { data: { source: 'g', target: 'h', label: 'Yes' } },
        { data: { source: 'g', target: 'i', label: 'No' } },
        { data: { source: 'i', target: 'f' } },
        { data: { source: 'f', target: 'j', label: 'No' } },
        { data: { source: 'j', target: 'd' } },
        { data: { source: 'd', target: 'k', label: 'No' } },
        { data: { source: 'h', target: 'l' } },
        { data: { source: 'k', target: 'l' } },
        { data: { source: 's1', target: 'g' } },
        { data: { source: 's2', target: 'i' } },
        { data: { source: 's3', target: 'j' } },
        { data: { source: 's1', target: 'o' } },
        { data: { source: 's2', target: 'n' } },
        { data: { source: 's3', target: 'm' } },
        { data: { source: 'h', target: 'r' } },
        { data: { source: 'k', target: 'r' } },
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
            'padding': '10px'
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
            'label': 'data(label)'
          }
        },
        {
          selector: '.highlighted',
          style: {
            'line-color': '#ff0000',
            'target-arrow-color': '#ff0000',
            'width': 4
          }
        }
      ],
      layout: {
        name: 'dagre',
        rankDir: 'TB',
        nodeSep: 50,
        rankSep: 100
      }
    });

    // Add hover highlighting functionality
    cy.on('mouseover', 'node', function(e) {
      e.target.outgoers('edge').addClass('highlighted');
    });

    cy.on('mouseout', 'node', function(e) {
      e.target.outgoers('edge').removeClass('highlighted');
    });

    // Cleanup function
    return () => {
      cy.destroy();
    };
  }, []);

  return <div ref={cyRef} style={{ width: '100%', height: '1000px' }} />;
};

export default CytoDiagram;