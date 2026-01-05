import React, { useState, useRef, useEffect } from 'react';
import './PlasmaGame.css';

// Simple test component
function PlasmaGameTest() {
  const canvasRef = useRef(null);
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    setMessage('Game loaded!');
    
    const canvas = canvasRef.current;
    if (!canvas) {
      setMessage('Error: Canvas not found!');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setMessage('Error: Cannot get 2D context!');
      return;
    }

    // Draw a simple test
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(50, 50, 100, 100);
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Test OK!', 60, 110);
    
    setMessage('Canvas is working!');
  }, []);

  return (
    <div className="game-wrapper">
      <div className="game-header">
        <h1>Plasma Game Test</h1>
        <div className="score-board">Status: {message}</div>
      </div>

      <div className="main-content">
        <div className="toolbox">
          <h3>Test Mode</h3>
          <p>If you see a green square on the canvas, everything is working!</p>
        </div>

        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width="700"
            height="450"
            className="simulation-canvas"
            style={{ border: '2px solid #333' }}
          />
        </div>
      </div>
    </div>
  );
}

export default PlasmaGameTest;
