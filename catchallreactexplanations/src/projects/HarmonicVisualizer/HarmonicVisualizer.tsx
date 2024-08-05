import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface HarmonicVisualizerProps {
  // Add any props if needed
}

export const HarmonicVisualizer: React.FC<HarmonicVisualizerProps> = () => {
  const [mass, setMass] = useState(1);
  const [springConstant, setSpringConstant] = useState(10);
  const [initialDisplacement, setInitialDisplacement] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [systemType, setSystemType] = useState<'spring' | 'pendulum'>('spring');

  const animationRef = useRef<number>();

  const calculatePosition = (t: number) => {
    const omega = Math.sqrt(springConstant / mass);
    return initialDisplacement * Math.cos(omega * t);
  };

  const calculateVelocity = (t: number) => {
    const omega = Math.sqrt(springConstant / mass);
    return -initialDisplacement * omega * Math.sin(omega * t);
  };

  const calculateAcceleration = (t: number) => {
    const omega = Math.sqrt(springConstant / mass);
    return -initialDisplacement * omega * omega * Math.cos(omega * t);
  };

  const animate = (t: number) => {
    setTime(t);
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationRef.current!);
    }
    return () => cancelAnimationFrame(animationRef.current!);
  }, [isPlaying]);

  const handleReset = () => {
    setTime(0);
    setIsPlaying(false);
  };

  const generateData = () => {
    const data = [];
    for (let t = 0; t <= time; t += 0.1) {
      data.push({
        time: t,
        position: calculatePosition(t),
        velocity: calculateVelocity(t),
        acceleration: calculateAcceleration(t),
      });
    }
    return data;
  };

  return (
    <div className="HarmonicVisualizer">
      <div className="motion-HarmonicVisualizer">
        {systemType === 'spring' ? (
          <div className="spring-mass-system" style={{ transform: `translateX(${calculatePosition(time) * 50}px)` }}>
            <div className="spring"></div>
            <div className="mass"></div>
          </div>
        ) : (
          <div className="pendulum" style={{ transform: `rotate(${calculatePosition(time) * 50}deg)` }}>
            <div className="pendulum-arm"></div>
            <div className="pendulum-bob"></div>
          </div>
        )}
      </div>

      <div className="graph-display">
        <LineChart width={600} height={300} data={generateData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="position" stroke="#8884d8" />
          <Line type="monotone" dataKey="velocity" stroke="#82ca9d" />
          <Line type="monotone" dataKey="acceleration" stroke="#ffc658" />
        </LineChart>
      </div>

      <div className="control-panel">
        <div>
          <label>Mass: </label>
          <input type="number" value={mass} onChange={(e) => setMass(Number(e.target.value))} />
        </div>
        <div>
          <label>{systemType === 'spring' ? 'Spring Constant' : 'Pendulum Length'}: </label>
          <input type="number" value={springConstant} onChange={(e) => setSpringConstant(Number(e.target.value))} />
        </div>
        <div>
          <label>Initial Displacement: </label>
          <input type="number" value={initialDisplacement} onChange={(e) => setInitialDisplacement(Number(e.target.value))} />
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={handleReset}>Reset</button>
        <select value={systemType} onChange={(e) => setSystemType(e.target.value as 'spring' | 'pendulum')}>
          <option value="spring">Spring-Mass System</option>
          <option value="pendulum">Pendulum</option>
        </select>
      </div>

      <div className="equation-display">
        <h3>Equations of Motion:</h3>
        {systemType === 'spring' ? (
          <>
            <p>x(t) = A cos(ωt)</p>
            <p>v(t) = -Aω sin(ωt)</p>
            <p>a(t) = -Aω² cos(ωt)</p>
          </>
        ) : (
          <>
            <p>θ(t) = θ₀ cos(ωt)</p>
            <p>ω(t) = -θ₀ω sin(ωt)</p>
            <p>α(t) = -θ₀ω² cos(ωt)</p>
          </>
        )}
        <p>ω = √(k/m) = {Math.sqrt(springConstant / mass).toFixed(2)} rad/s</p>
        <h3>Current Values:</h3>
        <p>Position: {calculatePosition(time).toFixed(2)}</p>
        <p>Velocity: {calculateVelocity(time).toFixed(2)}</p>
        <p>Acceleration: {calculateAcceleration(time).toFixed(2)}</p>
      </div>
    </div>
  );
};