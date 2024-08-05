import React, { useState, useEffect, useRef } from 'react';

interface VisualizerProps {
  width: number;
  height: number;
}

const TrigVisualizer: React.FC<VisualizerProps> = ({ width, height }) => {
  const [angle, setAngle] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawVisualization(ctx);
      }
    }
  }, [angle]);

  useEffect(() => {
    let animationId: number;
    if (isPlaying) {
      const animate = () => {
        setAngle((prevAngle) => (prevAngle + 1) % 360);
        animationId = requestAnimationFrame(animate);
      };
      animationId = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  const drawVisualization = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);
    
    // Draw unit circle
    const centerX = width / 4;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw angle line
    const radians = angle * (Math.PI / 180);
    const x = centerX + radius * Math.cos(radians);
    const y = centerY - radius * Math.sin(radians);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Draw sin, cos, tan lines
    ctx.beginPath();
    ctx.moveTo(x, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'red';
    ctx.stroke();

    if (Math.abs(Math.cos(radians)) > 0.01) {
      ctx.beginPath();
      ctx.moveTo(centerX + radius, centerY);
      ctx.lineTo(centerX + radius, centerY - radius * Math.tan(radians));
      ctx.strokeStyle = 'green';
      ctx.stroke();
    }

    // Draw graphs
    drawGraph(ctx, Math.sin, 'blue', width / 2, 0, width / 2, height / 3);
    drawGraph(ctx, Math.cos, 'red', width / 2, height / 3, width / 2, height / 3);
    drawGraph(ctx, Math.tan, 'green', width / 2, 2 * height / 3, width / 2, height / 3);

    // Draw values
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText(`Angle: ${angle}°`, 10, 20);
    ctx.fillText(`Sin: ${Math.sin(radians).toFixed(2)}`, 10, 40);
    ctx.fillText(`Cos: ${Math.cos(radians).toFixed(2)}`, 10, 60);
    ctx.fillText(`Tan: ${Math.tan(radians).toFixed(2)}`, 10, 80);
  };

  const drawGraph = (
    ctx: CanvasRenderingContext2D,
    func: (x: number) => number,
    color: string,
    startX: number,
    startY: number,
    width: number,
    height: number
  ) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    for (let i = 0; i <= width; i++) {
      const x = (i / width) * 2 * Math.PI;
      const y = func(x);
      ctx.lineTo(startX + i, startY + height / 2 - (y * height) / 2);
    }
    ctx.stroke();

    // Draw current point
    const currentX = startX + (angle / 360) * width;
    const currentY = startY + height / 2 - (func(angle * (Math.PI / 180)) * height) / 2;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const handleAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAngle(Number(e.target.value));
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} />
      <div>
        <input
          type="range"
          min="0"
          max="359"
          value={angle}
          onChange={handleAngleChange}
        />
        <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
      </div>
    </div>
  );
};

export default TrigVisualizer;