import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';

const CytoscapeShapeTransformer = () => {
  const cyRef = useRef(null);
  const [cy, setCy] = useState(null);

  useEffect(() => {
    const cyInstance = cytoscape({
      container: cyRef.current,
      elements: [
        { data: { id: 'a' } },
        { data: { id: 'b' } },
        { data: { id: 'c' } },
        { data: { id: 'd' } },
        { data: { id: 'e' } },
        { data: { id: 'f' } },
        { data: { id: 'g' } },
        { data: { id: 'h' } },
        { data: { id: 'i' } },
        { data: { id: 'j' } },
        { data: { id: 'ab', source: 'a', target: 'b' } },
        { data: { id: 'bc', source: 'b', target: 'c' } },
        { data: { id: 'cd', source: 'c', target: 'd' } },
        { data: { id: 'de', source: 'd', target: 'e' } },
        { data: { id: 'ef', source: 'e', target: 'f' } },
        { data: { id: 'fg', source: 'f', target: 'g' } },
        { data: { id: 'gh', source: 'g', target: 'h' } },
        { data: { id: 'hi', source: 'h', target: 'i' } },
        { data: { id: 'ij', source: 'i', target: 'j' } },
      ],
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
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
      layout: { name: 'grid', rows: 1 }
    });

    setCy(cyInstance);

    return () => {
      cyInstance.destroy();
    };
  }, []);
  const applyLayout = (layoutName, options = {}) => {
    if (cy) {
      cy.layout({ name: layoutName, ...options }).run();
    }
  };

  const applyLineLayout = () => {
    applyLayout('grid', { rows: 1 });
  };

  const applyCircleLayout = () => {
    applyLayout('circle');
  };


  const applySquareLayout = () => {
    if (cy) {
      const nodes = cy.nodes();
      const centerX = cy.width() / 2;
      const centerY = cy.height() / 2;
      const size = Math.min(cy.width(), cy.height()) * 0.8;
      const nodeCount = nodes.length;
      const nodesPerSide = Math.ceil(nodeCount / 4);

      nodes.forEach((node, index) => {
        let x, y;
        const sideIndex = Math.floor(index / nodesPerSide);
        const positionOnSide = index % nodesPerSide;

        switch (sideIndex) {
          case 0: // Top side
            x = centerX - size / 2 + (positionOnSide / (nodesPerSide - 1)) * size;
            y = centerY - size / 2;
            break;
          case 1: // Right side
            x = centerX + size / 2;
            y = centerY - size / 2 + (positionOnSide / (nodesPerSide - 1)) * size;
            break;
          case 2: // Bottom side
            x = centerX + size / 2 - (positionOnSide / (nodesPerSide - 1)) * size;
            y = centerY + size / 2;
            break;
          case 3: // Left side
            x = centerX - size / 2;
            y = centerY + size / 2 - (positionOnSide / (nodesPerSide - 1)) * size;
            break;
        }

        node.position({ x, y });
      });

      cy.fit();
    }
  };

  const applySineLayout = () => {
    if (cy) {
      const nodes = cy.nodes();
      const width = cy.width();
      const height = cy.height();
      const amplitude = height / 4;
      const frequency = 2 * Math.PI / width;

      nodes.forEach((node, index) => {
        const x = (index / (nodes.length - 1)) * width;
        const y = height / 2 + amplitude * Math.sin(frequency * x);
        node.position({ x, y });
      });

      cy.fit();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div ref={cyRef} style={{ width: '100%', height: '400px', border: '1px solid #ccc' }} />
      <div className="flex gap-2 mt-4">
        <button onClick={applyLineLayout}>Line</button>
        <button onClick={applyCircleLayout}>Circle</button>
        <button onClick={applySquareLayout}>Square</button>
        <button onClick={applySineLayout}>Sine</button>
      </div>
    </div>
  );
};

export default CytoscapeShapeTransformer;