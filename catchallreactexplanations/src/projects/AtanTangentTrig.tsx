import React, { useState, useEffect } from 'react';

const TrigCircleVisualization = () => {
  const [angle, setAngle] = useState(0);
  const [showAtan, setShowAtan] = useState(true);
  const [showTan, setShowTan] = useState(true);

  useEffect(() => {
    console.log("TrigCircleVisualization component mounted");
  }, []);

  // Calculate points and values
  const x = Math.cos(angle);
  const y = Math.sin(angle);
  const tanLength = Math.tan(angle);

  console.log("Rendering with angle:", angle);

  return (
    <div style={{padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', border: '2px solid black', minHeight: '400px'}}>
      <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '16px'}}>Unit Circle Visualization</h2>
      <div style={{marginBottom: '16px'}}>
        <label style={{display: 'block', marginBottom: '8px'}}>
          Angle (radians): {angle.toFixed(2)}
        </label>
        <input
          type="range"
          min="-3.14"
          max="3.14"
          step="0.01"
          value={angle}
          onChange={(e) => setAngle(parseFloat(e.target.value))}
          style={{width: '100%'}}
        />
      </div>
      <div style={{marginBottom: '16px'}}>
        <button
          onClick={() => setShowAtan(!showAtan)}
          style={{padding: '8px 16px', marginRight: '8px', backgroundColor: showAtan ? 'blue' : 'gray', color: 'white', border: 'none', borderRadius: '4px'}}
        >
          {showAtan ? 'Hide Atan' : 'Show Atan'}
        </button>
        <button
          onClick={() => setShowTan(!showTan)}
          style={{padding: '8px 16px', backgroundColor: showTan ? 'green' : 'gray', color: 'white', border: 'none', borderRadius: '4px'}}
        >
          {showTan ? 'Hide Tan' : 'Show Tan'}
        </button>
      </div>
      <div style={{position: 'relative', width: '256px', height: '256px', margin: '0 auto', border: '2px solid gray', borderRadius: '50%', backgroundColor: 'white'}}>
        <p style={{position: 'absolute', top: 0, left: 0, fontSize: '12px'}}>Circle should be here</p>
        
        {/* X and Y axes */}
        <div style={{position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', backgroundColor: 'gray'}}></div>
        <div style={{position: 'absolute', top: 0, left: '50%', width: '1px', height: '100%', backgroundColor: 'gray'}}></div>
        
        {/* Point on circle */}
        <div style={{
          position: 'absolute',
          width: '8px',
          height: '8px',
          backgroundColor: 'red',
          borderRadius: '50%',
          top: `${50 - y * 50}%`,
          left: `${50 + x * 50}%`,
          transform: 'translate(-50%, -50%)'
        }}></div>
        
        {/* Atan visualization */}
        {showAtan && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '1px',
            height: '50%',
            backgroundColor: 'blue',
            transformOrigin: 'top',
            transform: `translateX(-50%) rotate(${-angle}rad)`
          }}></div>
        )}
        
        {/* Tan visualization */}
        {showTan && Math.abs(tanLength) <= 50 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            right: 0,
            height: '1px',
            width: `${Math.abs(tanLength) * 32}px`,
            backgroundColor: 'green',
            transform: `translateY(-50%) ${tanLength < 0 ? 'scaleX(-1)' : ''}`
          }}></div>
        )}
      </div>
      <div style={{marginTop: '16px', textAlign: 'center'}}>
        {showAtan && <p>atan({y.toFixed(2)} / {x.toFixed(2)}) = {angle.toFixed(2)} radians</p>}
        {showTan && <p>tan({angle.toFixed(2)}) = {tanLength.toFixed(2)}</p>}
      </div>
    </div>
  );
};

export default TrigCircleVisualization;