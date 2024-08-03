import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const ShapeContainer = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(Matter.Engine.create());
  const [selectedShape, setSelectedShape] = useState('rectangle');

  const shapes = {
    rectangle: 'M 0 0 L 200 0 L 200 150 L 0 150 Z',
    star: 'M 100 0 L 129 66 L 200 77 L 150 128 L 162 200 L 100 166 L 38 200 L 50 128 L 0 77 L 71 66 Z',
    shamrock: 'M 100 0 C 60 10 60 50 80 70 C 50 80 10 60 0 100 C 10 140 50 140 80 130 C 60 150 60 190 100 200 C 140 190 140 150 120 130 C 150 140 190 140 200 100 C 190 60 150 80 120 70 C 140 50 140 10 100 0 Z',
    heart: 'M 100 200 C 50 150 0 100 0 50 C 0 0 50 0 100 50 C 150 0 200 0 200 50 C 200 100 150 150 100 200 Z',
    custom: '' // We'll allow users to input custom SVG paths
  };

  useEffect(() => {
    if (!sceneRef.current) return;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engineRef.current,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: '#f0f0f0',
      },
    });

    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Engine.clear(engineRef.current);
    };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    Matter.World.clear(engine.world, false);

    const shape = createShape(selectedShape);
    Matter.World.add(engine.world, shape);

    Matter.Engine.update(engine);
  }, [selectedShape]);

  const createShape = (shapeType) => {
    const centerX = 400;
    const centerY = 300;
    const scale = 1.5;

    const path = shapes[shapeType];
    if (!path) return Matter.Bodies.rectangle(centerX, centerY, 200, 150, { isStatic: true });

    const vertices = Matter.Vertices.fromPath(path);
    const scaledVertices = vertices.map(v => ({ x: v.x * scale + centerX - 100 * scale, y: v.y * scale + centerY - 100 * scale }));
    
    return Matter.Bodies.fromVertices(centerX, centerY, [scaledVertices], {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'blue',
        lineWidth: 2
      }
    });
  };

  const handleCustomShape = () => {
    const customPath = prompt("Enter a custom SVG path:");
    if (customPath) {
      shapes.custom = customPath;
      setSelectedShape('custom');
    }
  };

  return (
    <div>
      <div ref={sceneRef} style={{ width: '800px', height: '600px' }} />
      <div>
        <button onClick={() => setSelectedShape('rectangle')}>Rectangle</button>
        <button onClick={() => setSelectedShape('star')}>Star</button>
        <button onClick={() => setSelectedShape('shamrock')}>Shamrock</button>
        <button onClick={() => setSelectedShape('heart')}>Heart</button>
        <button onClick={handleCustomShape}>Custom Shape</button>
      </div>
    </div>
  );
};

export default ShapeContainer;