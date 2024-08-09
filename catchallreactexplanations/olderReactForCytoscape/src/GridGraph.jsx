import React, { useEffect, useState, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

const GridGraph = () => {
  const [elements, setElements] = useState([]);
  const [mode, setMode] = useState('none');
  const cyRef = useRef(null);

  useEffect(() => {
    const rows = 8;
    const cols = 10;
    const newElements = [];

    // Create nodes
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        newElements.push({
          data: { id: `node-${i}-${j}` },
          position: { x: j * 100, y: i * 100 }
        });
      }
    }

    // Create edges
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (j < cols - 1) {
          newElements.push({
            data: {
              id: `edge-h-${i}-${j}`,
              source: `node-${i}-${j}`,
              target: `node-${i}-${j+1}`
            }
          });
        }
        if (i < rows - 1) {
          newElements.push({
            data: {
              id: `edge-v-${i}-${j}`,
              source: `node-${i}-${j}`,
              target: `node-${i+1}-${j}`
            }
          });
        }
      }
    }

    setElements(newElements);
  }, []);

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.on('tap', 'node', (event) => {
        const node = event.target;
        if (mode === 'push') {
          pushNodes(node);
        } else if (mode === 'pull') {
          pullNodes(node);
        }
      });
    }
  }, [mode]);

  const pushNodes = (node) => {
    const neighborNodes = node.neighborhood().nodes();
    neighborNodes.forEach((neighbor) => {
      const dx = neighbor.position().x - node.position().x;
      const dy = neighbor.position().y - node.position().y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const pushFactor = 20 / distance;
      neighbor.animate({
        position: {
          x: neighbor.position().x + dx * pushFactor,
          y: neighbor.position().y + dy * pushFactor
        },
        duration: 500
      });
    });
  };

  const pullNodes = (node) => {
    const neighborNodes = node.neighborhood().nodes();
    neighborNodes.forEach((neighbor) => {
      const dx = node.position().x - neighbor.position().x;
      const dy = node.position().y - neighbor.position().y;
      const pullFactor = 0.2;
      neighbor.animate({
        position: {
          x: neighbor.position().x + dx * pullFactor,
          y: neighbor.position().y + dy * pullFactor
        },
        duration: 500
      });
    });
  };

  const layout = {
    name: 'preset'
  };

  const style = [
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
  ];

  return (
    <div>
      <div>
        <button 
          onClick={() => setMode('push')} 
          style={{backgroundColor: mode === 'push' ? 'lightblue' : 'white'}}
        >
          Push
        </button>
        <button 
          onClick={() => setMode('pull')} 
          style={{backgroundColor: mode === 'pull' ? 'lightblue' : 'white'}}
        >
          Pull
        </button>
        <button onClick={() => setMode('none')}>Reset</button>
      </div>
      <CytoscapeComponent
        elements={elements}
        style={{ width: '1200px', height: '900px' }}
        layout={layout}
        stylesheet={style}
        cy={(cy) => { cyRef.current = cy; }}
      />
    </div>
  );
};

export default GridGraph;