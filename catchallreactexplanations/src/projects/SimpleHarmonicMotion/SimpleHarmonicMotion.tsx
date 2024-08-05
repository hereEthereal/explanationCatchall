import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Circle, Line } from 'react-konva';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Button, Slider, Typography, Box } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SimpleHarmonicMotion: React.FC = () => {
  const [amplitude, setAmplitude] = useState(100);
  const [frequency, setFrequency] = useState(1);
  const [mass, setMass] = useState(1);
  const [springConstant, setSpringConstant] = useState(10);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [acceleration, setAcceleration] = useState(0);
  const [positionData, setPositionData] = useState<number[]>([]);

  const animationRef = useRef<number>();

  const calculatePosition = (t: number) => {
    return amplitude * Math.cos(2 * Math.PI * frequency * t);
  };

  const calculateVelocity = (t: number) => {
    return -amplitude * 2 * Math.PI * frequency * Math.sin(2 * Math.PI * frequency * t);
  };

  const calculateAcceleration = (t: number) => {
    return -amplitude * Math.pow(2 * Math.PI * frequency, 2) * Math.cos(2 * Math.PI * frequency * t);
  };

  const updateMotion = (t: number) => {
    const newPosition = calculatePosition(t);
    const newVelocity = calculateVelocity(t);
    const newAcceleration = calculateAcceleration(t);

    setPosition(newPosition);
    setVelocity(newVelocity);
    setAcceleration(newAcceleration);
    setPositionData(prevData => [...prevData.slice(-100), newPosition]);
  };

  const animate = (t: number) => {
    updateMotion(t);
    setTime(t);
    animationRef.current = requestAnimationFrame(() => animate(t + 0.016));
  };

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(() => animate(time));
    } else {
      cancelAnimationFrame(animationRef.current!);
    }
    return () => cancelAnimationFrame(animationRef.current!);
  }, [isPlaying]);

  const handleStep = () => {
    updateMotion(time + 0.1);
    setTime(prevTime => prevTime + 0.1);
  };

  const handleReset = () => {
    setTime(0);
    setPosition(0);
    setVelocity(0);
    setAcceleration(0);
    setPositionData([]);
  };

  const chartData = {
    labels: Array.from({ length: positionData.length }, (_, i) => i),
    datasets: [
      {
        label: 'Position',
        data: positionData,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Simple Harmonic Motion
      </Typography>

      <Stage width={400} height={200}>
        <Layer>
          <Line
            points={[200, 100, 200 + position, 100]}
            stroke="black"
            strokeWidth={2}
          />
          <Circle x={200 + position} y={100} radius={10} fill="red" />
        </Layer>
      </Stage>

      <Chart type="line" data={chartData} />

      <Box sx={{ my: 2 }}>
        <Typography>Amplitude: {amplitude}</Typography>
        <Slider
          value={amplitude}
          onChange={(_, value) => setAmplitude(value as number)}
          min={0}
          max={200}
        />

        <Typography>Frequency: {frequency.toFixed(2)} Hz</Typography>
        <Slider
          value={frequency}
          onChange={(_, value) => setFrequency(value as number)}
          min={0.1}
          max={2}
          step={0.1}
        />

        <Typography>Mass: {mass.toFixed(2)} kg</Typography>
        <Slider
          value={mass}
          onChange={(_, value) => setMass(value as number)}
          min={0.1}
          max={10}
          step={0.1}
        />

        <Typography>Spring Constant: {springConstant.toFixed(2)} N/m</Typography>
        <Slider
          value={springConstant}
          onChange={(_, value) => setSpringConstant(value as number)}
          min={1}
          max={100}
          step={1}
        />
      </Box>

      <Box sx={{ my: 2 }}>
        <Button variant="contained" onClick={() => setIsPlaying(!isPlaying)} sx={{ mr: 1 }}>
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button variant="contained" onClick={handleStep} sx={{ mr: 1 }}>
          Step
        </Button>
        <Button variant="contained" onClick={handleReset}>
          Reset
        </Button>
      </Box>

      <Box sx={{ my: 2 }}>
        <Typography>Time: {time.toFixed(2)} s</Typography>
        <Typography>Position: {position.toFixed(2)} m</Typography>
        <Typography>Velocity: {velocity.toFixed(2)} m/s</Typography>
        <Typography>Acceleration: {acceleration.toFixed(2)} m/s²</Typography>
      </Box>

      <Box sx={{ my: 2 }}>
        <Typography variant="h6">Formulas:</Typography>
        <Typography>Position: x(t) = A * cos(2πft)</Typography>
        <Typography>Velocity: v(t) = -A * 2πf * sin(2πft)</Typography>
        <Typography>Acceleration: a(t) = -A * (2πf)² * cos(2πft)</Typography>
        <Typography>Angular frequency: ω = 2πf = √(k/m)</Typography>
      </Box>
    </Box>
  );
};

export default SimpleHarmonicMotion;