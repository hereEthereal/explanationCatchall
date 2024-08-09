import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

const CytoscapeCircularGraph = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        { data: { id: 'center' } },
        ...Array.from({ length: 20 }, (_, i) => ({ data: { id: `node${i}` } })),
        ...Array.from({ length: 20 }, (_, i) => ({ data: { id: `edge${i}`, source: 'center', target: `node${i}` } }))
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#6FB1FC',
            'label': 'data(id)',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '10px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'straight'
          }
        }
      ],
      layout: {
        name: 'preset',
        fit: true,
        padding: 50
      }
    });

    const createCircularLayout = () => {
      const centerNode = cy.getElementById('center');
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      const radius = Math.min(containerWidth, containerHeight) * 0.4;

      centerNode.position({ x: centerX, y: centerY });

      cy.nodes().not('#center').forEach((node, index) => {
        const angle = (index / 20) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        node.position({ x, y });
      });

      cy.fit();
    };

    createCircularLayout();

    return () => {
      cy.destroy();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '400px', backgroundColor: '#f0f0f0' }} />;
};

export default CytoscapeCircularGraph;