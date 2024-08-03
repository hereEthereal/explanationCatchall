const findTop = () => {
    console.log('Finding top of the shape');
    if (!engineRef.current || !renderRef.current) {
      console.error('Engine or render not initialized');
      return;
    }
    const engine = engineRef.current;
    const render = renderRef.current;
  
    console.log('Clearing previous top points and spawn area');
    setTopPoints([]);
    setSpawnArea(null);
    Matter.World.remove(engine.world, engine.world.bodies.filter(body => body.label === 'spawnArea' || body.label === 'visualizer'));
  
    const shape = engine.world.bodies.find(body => body.isStatic && body.label !== 'spawnArea' && body.label !== 'visualizer');
    if (!shape) {
      console.error('No static shape found in the world');
      return;
    }
  
    const bounds = Matter.Bounds.create(shape.vertices);
    const rayCount = 20;
    const newTopPoints = [];
  
    console.log('Performing raycasting');
    for (let i = 0; i < rayCount; i++) {
      const x = Matter.Common.map(i, 0, rayCount - 1, bounds.min.x, bounds.max.x);
      const ray = { x: x, y: bounds.min.y };
      const collisions = Matter.Query.ray([shape], ray, { y: bounds.max.y });
  
      if (collisions.length > 0) {
        newTopPoints.push(collisions[0].point);
        
        console.log('Visualizing raycast at x:', x);
        const rayLine = Matter.Bodies.rectangle(x, (bounds.min.y + collisions[0].point.y) / 2, 2, collisions[0].point.y - bounds.min.y, {
          isStatic: true,
          render: { fillStyle: 'yellow' },
          collisionFilter: { group: -1 },
          label: 'visualizer'
        });
        Matter.World.add(engine.world, rayLine);
  
        // Add a small circle at the collision point
        const collisionPoint = Matter.Bodies.circle(collisions[0].point.x, collisions[0].point.y, 3, {
          isStatic: true,
          render: { fillStyle: 'red' },
          collisionFilter: { group: -1 },
          label: 'visualizer'
        });
        Matter.World.add(engine.world, collisionPoint);
      }
    }
  
    console.log('Setting top points:', newTopPoints.length);
    setTopPoints(newTopPoints);
  
    console.log('Creating spawn area');
    const offset = 20;
    const spawnPoints = newTopPoints.map(point => ({ x: point.x, y: point.y - offset }));
  
    const spawnAreaBodies = spawnPoints.map(point => {
      return Matter.Bodies.circle(point.x, point.y, 5, {
        isStatic: true,
        render: { fillStyle: 'red' },
        isSensor: true,
        label: 'spawnArea'
      });
    });
  
    console.log('Adding spawn area to world');
    Matter.World.add(engine.world, spawnAreaBodies);
    setSpawnArea(spawnAreaBodies);
  
    console.log('Updating render bounds');
    const allBodies = [...engine.world.bodies, ...spawnAreaBodies];
    const allBounds = Matter.Bounds.create(allBodies);
    render.bounds.min.y = Math.min(render.bounds.min.y, allBounds.min.y - 50);
    render.bounds.max.y = Math.max(render.bounds.max.y, allBounds.max.y + 50);
  
    Matter.Engine.update(engine);
    console.log('Top finding process completed');
  };