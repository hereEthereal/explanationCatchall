import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { AlertCircle } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SVG = styled.svg`
  border: 1px solid #e2e8f0;
`;

const DraggableCircle = styled.circle`
  cursor: pointer;
  &:hover {
    fill: #f56565;
  }
`;

const AngleText = styled.text`
  font-size: 12px;
  fill: #4a5568;
`;

const FormulaContainer = styled.div`
  margin-top: 1rem;
  font-size: 0.875rem;
`;

const FormulaTitle = styled.h3`
  font-weight: bold;
`;

const Alert = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.375rem;
  background-color: #fed7d7;
  color: #9b2c2c;
`;

const AlertTitle = styled.h4`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const DraggableQuadrilateral: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([
    { x: 100, y: 100 },
    { x: 300, y: 100 },
    { x: 300, y: 300 },
    { x: 100, y: 300 },
  ]);
  const [angles, setAngles] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const calculateAngle = (p1: Point, p2: Point, p3: Point): number => {
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    
    const dot = v1.x * v2.x + v1.y * v2.y;
    const det = v1.x * v2.y - v1.y * v2.x;
    const angle = Math.atan2(det, dot);
    
    // Convert to degrees and ensure it's positive
    let degrees = (angle * 180) / Math.PI;
    if (degrees < 0) degrees += 360;
    
    // Return the interior angle
    return 360 - degrees;
  };

  const calculateAngles = () => {
    const newAngles = points.map((_, i) => {
      const prev = points[(i - 1 + 4) % 4];
      const curr = points[i];
      const next = points[(i + 1) % 4];
      return calculateAngle(prev, curr, next);
    });
    setAngles(newAngles);

    const totalAngle = newAngles.reduce((sum, angle) => sum + angle, 0);
    if (Math.abs(totalAngle - 360) > 0.1) {
      setError(`Warning: Total angle is ${totalAngle.toFixed(2)}°, expected 360°`);
    } else {
      setError(null);
    }
  };

  useEffect(() => {
    calculateAngles();
  }, [points]);

  const handleDrag = (index: number, e: React.MouseEvent<SVGCircleElement>) => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const newX = e.clientX - svgRect.left;
      const newY = e.clientY - svgRect.top;
      
      // Ensure the point stays within the SVG boundaries
      const x = Math.max(0, Math.min(newX, svgRect.width));
      const y = Math.max(0, Math.min(newY, svgRect.height));

      const newPoints = [...points];
      newPoints[index] = { x, y };
      setPoints(newPoints);
    }
  };

  return (
    <Container>
      <SVG width="400" height="400" ref={svgRef}>
        <polygon
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="black"
        />
        {points.map((point, index) => (
          <DraggableCircle
            key={index}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="red"
            onMouseDown={(e) => {
              const handleMouseMove = (moveEvent: MouseEvent) => {
                handleDrag(index, moveEvent as unknown as React.MouseEvent<SVGCircleElement>);
              };
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />
        ))}
        {angles.map((angle, index) => (
          <AngleText key={index} x={points[index].x + 10} y={points[index].y + 10}>
            {angle.toFixed(1)}°
          </AngleText>
        ))}
      </SVG>
      {error && (
        <Alert>
          <AlertTitle>
            <AlertCircle size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Warning
          </AlertTitle>
          <p>{error}</p>
        </Alert>
      )}
      <FormulaContainer>
        <FormulaTitle>Angle Calculation Formula:</FormulaTitle>
        <p>angle = 360° - atan2(det(v1, v2), dot(v1, v2)) * (180 / π)</p>
        <p>where v1 and v2 are vectors formed by three consecutive points</p>
      </FormulaContainer>
    </Container>
  );
};

export default DraggableQuadrilateral;