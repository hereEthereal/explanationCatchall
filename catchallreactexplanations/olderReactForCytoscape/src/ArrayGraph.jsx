import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

const ArrayGraph = ({ data, highlights = [] }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'width': 'label',
            'height': 'label',
            'padding': '10px',
            'font-size': '45px',
            width: "80px", // Increased node width
            height: "80px", // Increased node height
            padding: "5px",
          }
        },
        {
          selector: 'node.highlight',
          style: {
            'background-color': '#ff0'
          }
        },
        {
          selector: 'node[label = ","]',
          style: {
            'width': '20px',
            'height': '20px',
            'font-size': '18px',
            'padding': '2px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ]
    });

    const elements = [];
    const openBracket = { data: { id: 'open', label: '[' } };
    const closeBracket = { data: { id: 'close', label: ']' } };
    elements.push(openBracket);

    data.forEach((item, index) => {
      const itemNode = {
        data: { id: `item${index}`, label: item.toString() },
        classes: highlights.includes(index) ? 'highlight' : ''
      };
      elements.push(itemNode);

      if (index < data.length - 1) {
        const commaNode = { data: { id: `comma${index}`, label: ',' } };
        elements.push(commaNode);
      }

      if (index > 0) {
        elements.push({ data: { source: `comma${index-1}`, target: `item${index}` } });
      } else {
        elements.push({ data: { source: 'open', target: 'item0' } });
      }

      if (index < data.length - 1) {
        elements.push({ data: { source: `item${index}`, target: `comma${index}` } });
      } else {
        elements.push({ data: { source: `item${index}`, target: 'close' } });
      }
    });

    elements.push(closeBracket);

    cy.add(elements);

    cy.layout({ name: 'grid', rows: 1 }).run();

    cy.fit();

    return () => {
      cy.destroy();
    };
  }, [data, highlights]);

  return <div ref={containerRef} style={{ width: '100%', height: '200px' }} />;
};

export default ArrayGraph;