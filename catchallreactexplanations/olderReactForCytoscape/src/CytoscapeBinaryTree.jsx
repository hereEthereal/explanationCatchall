import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

const CytoscapeBinaryTree = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const data =     [30,15,45,7,22,37,52,3,11,18,26,33,41,48,56,1,5,9,13,16,20,24,28,31,35,39,43,46,50,54];
    
    const createTreeElements = (arr) => {
      const elements = [];
      const addNode = (value, parent = null) => {
        elements.push({ data: { id: `node${value}`, label: value } });
        if (parent !== null) {
          elements.push({ data: { id: `edge${parent}-${value}`, source: `node${parent}`, target: `node${value}` } });
        }
      };

      const buildTree = (values, parent = null) => {
        if (values.length === 0) return;
        const mid = Math.floor(values.length / 2);
        const value = values[mid];
        addNode(value, parent);
        buildTree(values.slice(0, mid), value);
        buildTree(values.slice(mid + 1), value);
      };

      buildTree(arr.sort((a, b) => a - b));
      return elements;
    };

    const cy = cytoscape({
      container: containerRef.current,
      elements: createTreeElements(data),
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#6FB1FC',
            'label': 'data(label)',
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '12px',
            'width': '30px',
            'height': '30px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#ccc',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        roots: '#node30',
        padding: 10,
        spacingFactor: 1.5
      }
    });

    cy.fit();
    cy.center();

    return () => {
      cy.destroy();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '600px', backgroundColor: '#f0f0f0' }} />;
};

export default CytoscapeBinaryTree;