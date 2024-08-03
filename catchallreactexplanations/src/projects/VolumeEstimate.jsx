import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const ShapeContainer = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const [selectedShape, setSelectedShape] = useState('star');

  const shapes = {
    rectangle: 'M -100 -75 L 100 -75 L 100 75 L -100 75 Z',
    star: 'M 0 -100 L 29 -34 L 100 -23 L 50 28 L 62 100 L 0 66 L -62 100 L -50 28 L -100 -23 L -29 -34 Z',
    shamrock: 'M 0 -100 C -40 -90 -40 -50 -20 -30 C -50 -20 -90 -40 -100 0 C -90 40 -50 40 -20 30 C -40 50 -40 90 0 100 C 40 90 40 50 20 30 C 50 40 90 40 100 0 C 90 -40 50 -20 20 -30 C 40 -50 40 -90 0 -100 Z',
    heart: 'M 0 100 C -50 50 -100 0 -100 -50 C -100 -100 -50 -100 0 -50 C 50 -100 100 -100 100 -50 C 100 0 50 50 0 100 Z',
    custom: ''
  };

  useEffect(() => {
    console.log('Component mounted');
    if (!sceneRef.current) {
      console.error('Scene ref is null');
      return;
    }

    console.log('Creating engine');
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1, scale: 0.001 } });
    engineRef.current = engine;

    console.log('Creating renderer');
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: '#f0f0f0',
      },
    });
    renderRef.current = render;

    console.log('Running renderer');
    Matter.Render.run(render);

    console.log('Creating runner');
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    console.log('Adding click event listener');
    render.canvas.addEventListener('click', handleClick);

    console.log('Creating initial shape');
    const shape = createShape(selectedShape);
    Matter.World.add(engine.world, shape);

    return () => {
      console.log('Cleaning up');
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    console.log('Selected shape changed:', selectedShape);
    if (!engineRef.current) {
      console.error('Engine ref is null');
      return;
    }
    const engine = engineRef.current;
    const bodies = engine.world.bodies.filter(body => body.isStatic);
    Matter.World.remove(engine.world, bodies);

    const shape = createShape(selectedShape);
    Matter.World.add(engine.world, shape);

    Matter.Engine.update(engine);
  }, [selectedShape]);

  const createShape = (shapeType) => {
    console.log('Creating shape:', shapeType);
    const centerX = 400;
    const centerY = 300;
    const scale = 1.5;

    const path = shapes[shapeType];
    if (!path) {
      console.warn('No path found for shape type:', shapeType);
      return [Matter.Bodies.rectangle(centerX, centerY, 200, 150, { isStatic: true })];
    }

    const vertices = Matter.Vertices.fromPath(path);
    const scaledVertices = vertices.map(v => ({ x: v.x * scale + centerX, y: v.y * scale + centerY }));
    
    const walls = [];
    for (let i = 0; i < scaledVertices.length; i++) {
      const currentVertex = scaledVertices[i];
      const nextVertex = scaledVertices[(i + 1) % scaledVertices.length];
      
      const wall = Matter.Bodies.rectangle(
        (currentVertex.x + nextVertex.x) / 2,
        (currentVertex.y + nextVertex.y) / 2,
        Math.sqrt(Math.pow(nextVertex.x - currentVertex.x, 2) + Math.pow(nextVertex.y - currentVertex.y, 2)),
        5,
        {
          angle: Math.atan2(nextVertex.y - currentVertex.y, nextVertex.x - currentVertex.x),
          isStatic: true,
          render: {
            fillStyle: 'blue'
          }
        }
      );
      
      walls.push(wall);
    }

    return walls;
  };

  const handleCustomShape = () => {
    const customPath = prompt("Enter a custom SVG path:");
    if (customPath) {
      shapes.custom = customPath;
      setSelectedShape('custom');
    }
  };

  const handleClick = (event) => {
    console.log('Click event triggered');
    if (!engineRef.current || !renderRef.current) {
      console.error('Engine or render ref is null in click handler');
      return;
    }
    const engine = engineRef.current;
    const render = renderRef.current;
    const rect = render.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    console.log('Creating ball at:', x, y);
    const ball = Matter.Bodies.circle(x, y, 10, {
      restitution: 0.8,
      friction: 0.005,
      density: 0.001,
      render: {
        fillStyle: '#4CAF50'
      }
    });

    Matter.World.add(engine.world, ball);
    console.log('Ball added to world');
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
      <p>Click inside or outside the shape to spawn balls!</p>
    </div>
  );
};

export default ShapeContainer;