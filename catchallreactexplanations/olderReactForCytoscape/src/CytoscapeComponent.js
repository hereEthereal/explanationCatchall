import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

const CytoscapeComponent = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        // Nodes
        { data: { id: 'node1', label: 'Node 1' } },
        { data: { id: 'node2', label: 'Node 2' } },
        { data: { id: 'node3', label: 'Node 3' } },
        
        // Edges
        { data: { source: 'node1', target: 'node2' } },
        { data: { source: 'node2', target: 'node3' } },
        { data: { source: 'node3', target: 'node1' } },
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(label)'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
      layout: {
        name: 'circle'
      }
    });

    return () => {
      cy.destroy();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
};

export default CytoscapeComponent;