import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';

const ShapeContainer = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const [selectedShape, setSelectedShape] = useState('star');
  const [spawnArea, setSpawnArea] = useState(null);
  const [setSpawnAreaMode, setSetSpawnAreaMode] = useState(false);
  const [isContainerFull, setIsContainerFull] = useState(false);
  const ballsRef = useRef([]);
  const [ballCount, setBallCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [countSpeed, setCountSpeed] = useState(1000); // 1 second default
  const [isFrozen, setIsFrozen] = useState(false);
  const [visibleBalls, setVisibleBalls] = useState([]);

  const shapes = {
    rectangle: 'M -100 -75 L 100 -75 L 100 75 L -100 75 Z',
    star: 'M 0 -100 L 29 -34 L 100 -23 L 50 28 L 62 100 L 0 66 L -62 100 L -50 28 L -100 -23 L -29 -34 Z',
    shamrock: 'M 0 -100 C -40 -90 -40 -50 -20 -30 C -50 -20 -90 -40 -100 0 C -90 40 -50 40 -20 30 C -40 50 -40 90 0 100 C 40 90 40 50 20 30 C 50 40 90 40 100 0 C 90 -40 50 -20 20 -30 C 40 -50 40 -90 0 -100 Z',
    heart: 'M 0 100 C -50 50 -100 0 -100 -50 C -100 -100 -50 -100 0 -50 C 50 -100 100 -100 100 -50 C 100 0 50 50 0 100 Z',
    custom: ''
  };

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1, scale: 0.001 } });
    engineRef.current = engine;

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

    Matter.Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    const shape = createShape(selectedShape);
    Matter.World.add(engine.world, shape);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, []);

  useEffect(() => {
    if (!engineRef.current) return;
    const engine = engineRef.current;
    const bodies = engine.world.bodies.filter(body => body.isStatic && body.label !== 'spawnAreaMarker');
    Matter.World.remove(engine.world, bodies);

    const shape = createShape(selectedShape);
    Matter.World.add(engine.world, shape);

    Matter.Engine.update(engine);
  }, [selectedShape]);

  const createShape = (shapeType) => {
    const centerX = 400;
    const centerY = 300;
    const scale = 1.5;

    const path = shapes[shapeType];
    if (!path) {
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

  const handleClick = useCallback((event) => {
    if (!engineRef.current || !renderRef.current) return;

    const engine = engineRef.current;
    const render = renderRef.current;
    const rect = render.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (setSpawnAreaMode) {
      setSpawnArea({ x, y });
      setSetSpawnAreaMode(false);

      const existingMarkers = engine.world.bodies.filter(body => body.label === 'spawnAreaMarker');
      Matter.World.remove(engine.world, existingMarkers);

      const spawnAreaMarker = Matter.Bodies.circle(x, y, 10, {
        isStatic: true,
        label: 'spawnAreaMarker',
        render: { fillStyle: '#FF0000' }
      });
      Matter.World.add(engine.world, spawnAreaMarker);
    } else if (spawnArea) {
      spawnBall(x, y);
    }
  }, [setSpawnAreaMode, spawnArea]);

  useEffect(() => {
    const canvas = renderRef.current?.canvas;
    if (canvas) {
      canvas.addEventListener('click', handleClick);
      return () => canvas.removeEventListener('click', handleClick);
    }
  }, [handleClick]);

  const checkContainerFullness = useCallback(() => {
    if (!spawnArea || !engineRef.current) return;

    const engine = engineRef.current;
    const spawnAreaBody = engine.world.bodies.find(body => body.label === 'spawnAreaMarker');
    if (!spawnAreaBody) return;

    const balls = ballsRef.current;
    let contactCount = 0;
    let totalContactAngle = 0;

    balls.forEach(ball => {
      const collision = Matter.Collision.collides(spawnAreaBody, ball);
      if (collision) {
        contactCount++;
        const contactPoint = collision.supports[0];
        const contactAngle = Math.atan2(contactPoint.y - spawnAreaBody.position.y, contactPoint.x - spawnAreaBody.position.x);
        totalContactAngle += Math.abs(contactAngle);
      }
    });

    const coveragePercentage = (totalContactAngle / (2 * Math.PI)) * 100;
    const isFull = contactCount >= 5 && coveragePercentage >= 50;

    setIsContainerFull(isFull);
  }, [spawnArea]);

  useEffect(() => {
    const intervalId = setInterval(checkContainerFullness, 100);
    return () => clearInterval(intervalId);
  }, [checkContainerFullness]);

  const spawnBall = (x, y) => {
    if (!engineRef.current) return;
    const engine = engineRef.current;

    const ball = Matter.Bodies.circle(x, y, 10, {
      restitution: 0.8,
      friction: 0.005,
      density: 0.001,
      render: {
        fillStyle: '#4CAF50'
      }
    });

    Matter.World.add(engine.world, ball);
    ballsRef.current.push(ball);
    console.log("Ball spawned. Total balls:", ballsRef.current.length);
  };

  const spawnBalls = () => {
    if (!engineRef.current || !spawnArea) return;

    for (let i = 0; i < 5; i++) {
      const ball = Matter.Bodies.circle(
        spawnArea.x + (Math.random() - 0.5) * 20,
        spawnArea.y,
        10,
        {
          restitution: 0.8,
          friction: 0.005,
          density: 0.001,
          render: { fillStyle: '#4CAF50' }
        }
      );
      Matter.World.add(engineRef.current.world, ball);
      ballsRef.current.push(ball);
    }
    console.log("5 balls spawned. Total balls:", ballsRef.current.length);
  };

  const toggleSetSpawnArea = () => {
    setSetSpawnAreaMode(prev => !prev);
    if (spawnArea) {
      setSpawnArea(null);
      if (engineRef.current) {
        const markers = engineRef.current.world.bodies.filter(body => body.label === 'spawnAreaMarker');
        Matter.World.remove(engineRef.current.world, markers);
      }
    }
  };

  const freezeBalls = () => {
    setIsFrozen(prev => !prev);
    const engine = engineRef.current;
    if (!engine) return;

    ballsRef.current.forEach(ball => {
      if (isFrozen) {
        // Unfreeze
        Matter.Body.setStatic(ball, false);
      } else {
        // Freeze
        Matter.Body.setStatic(ball, true);
      }
    });
  };

  const updateVisibleBalls = useCallback(() => {
    const visible = ballsRef.current.filter(ball => 
      ball.position.x >= 0 && ball.position.x <= 800 &&
      ball.position.y >= 0 && ball.position.y <= 600
    );
    setVisibleBalls(visible);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(updateVisibleBalls, 100); // Update every 100ms
    return () => clearInterval(intervalId);
  }, [updateVisibleBalls]);

  const startCounting = () => {
    console.log("Starting count...");
    setIsCounting(true);
    setBallCount(0);
  };

  const stopCounting = () => {
    console.log("Stopping count...");
    setIsCounting(false);
  };

  const countBalls = useCallback(() => {
    console.log("Counting balls...");
    if (ballCount >= visibleBalls.length) {
      console.log("All visible balls counted. Stopping.");
      stopCounting();
      return;
    }

    const ball = visibleBalls[ballCount];
    if (ball && ball.render) {
      console.log(`Counting ball ${ballCount + 1}`);
      ball.render.fillStyle = '#FF00FF'; // Change color to indicate counted
      setBallCount(prevCount => prevCount + 1);
    } else {
      console.log(`Ball ${ballCount + 1} not found or doesn't have render property`);
    }
  }, [ballCount, visibleBalls]);

  useEffect(() => {
    let intervalId;
    if (isCounting) {
      intervalId = setInterval(countBalls, countSpeed);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCounting, countSpeed, countBalls]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const removeOutOfBoundsBalls = () => {
      const bodiesToRemove = ballsRef.current.filter(ball => 
        ball.position.y > 600 || ball.position.x < 0 || ball.position.x > 800
      );

      Matter.World.remove(engine.world, bodiesToRemove);
      ballsRef.current = ballsRef.current.filter(ball => !bodiesToRemove.includes(ball));
    };

    const intervalId = setInterval(removeOutOfBoundsBalls, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <div ref={sceneRef} style={{ width: '800px', height: '600px' }} />
      <div>
        <button onClick={() => setSelectedShape('rectangle')}>Rectangle</button>
        <button onClick={() => setSelectedShape('star')}>Star</button>
        <button onClick={() => setSelectedShape('shamrock')}>Shamrock</button>
        <button onClick={() => setSelectedShape('heart')}>Heart</button>
        <button onClick={handleCustomShape}>Custom Shape</button>
        <button onClick={toggleSetSpawnArea} style={{backgroundColor: setSpawnAreaMode ? 'lightblue' : 'white'}}>
          {setSpawnAreaMode ? 'Cancel Set Spawn Area' : 'Set Spawn Area'}
        </button>
        <button onClick={spawnBalls} disabled={!spawnArea}>Spawn Balls</button>
        <button onClick={freezeBalls}>{isFrozen ? 'Unfreeze Balls' : 'Freeze Balls'}</button>
        <button onClick={startCounting} disabled={isCounting}>Start Counting</button>
        <button onClick={stopCounting} disabled={!isCounting}>Stop Counting</button>
        <input 
          type="range" 
          min="100" 
          max="2000" 
          value={countSpeed} 
          onChange={(e) => setCountSpeed(Number(e.target.value))}
        />
        <span>Count Speed: {countSpeed}ms</span>
      </div>
      <p>
        {setSpawnAreaMode 
          ? "Click to set the spawn area" 
          : spawnArea
            ? "Click to spawn individual balls, or use 'Spawn Balls' to spawn multiple"
            : "Set a spawn area to start spawning balls"}
      </p>
      {spawnArea && <p>Spawn area set at x: {spawnArea.x.toFixed(2)}, y: {spawnArea.y.toFixed(2)}</p>}
      {isContainerFull && <p style={{color: 'red', fontWeight: 'bold'}}>Container is full!</p>}
      <p>Ball Count: {ballCount}</p>
      <p>Total Balls: {ballsRef.current.length}</p>
      <p>Visible Balls: {visibleBalls.length}</p>
      <p>Counting: {isCounting ? 'Yes' : 'No'}</p>
      <p>Balls Frozen: {isFrozen ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default ShapeContainer;