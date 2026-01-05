import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Sparkles, Award, Target } from 'lucide-react';
import './LightInterferenceSimulator.css';

const LightInterferenceSimulator = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const patternCanvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);

  // Young's double slit parameters
  const [slitDistance, setSlitDistance] = useState(0.5); // mm
  const [screenDistance, setScreenDistance] = useState(1000); // mm
  const [wavelength, setWavelength] = useState(550); // nm (green light)
  const [slitWidth, setSlitWidth] = useState(0.1); // mm

  // Calculated values
  const [fringeSpacing, setFringeSpacing] = useState(0);
  const [numBrightFringes, setNumBrightFringes] = useState(0);

  // Challenges
  const [challenges, setChallenges] = useState([
    { id: 1, text: 'Tạo khoảng vân i = 1.1 mm', target: 1.1, tolerance: 0.1, completed: false },
    { id: 2, text: 'Ánh sáng đỏ (λ = 650 nm), i = 1.3 mm', target: 1.3, tolerance: 0.1, wavelengthTarget: 650, completed: false },
    { id: 3, text: 'Đếm 9 vân sáng trên màn', target: 9, tolerance: 0, completed: false }
  ]);
  const [currentChallenge, setCurrentChallenge] = useState(0);

  // Calculate fringe spacing: i = λD/d
  useEffect(() => {
    const lambda = wavelength * 1e-6; // Convert nm to mm
    const d = slitDistance; // mm
    const D = screenDistance; // mm
    const i = (lambda * D) / d; // mm
    setFringeSpacing(i);

    // Calculate number of visible fringes on a 20mm screen
    const screenHeight = 20; // mm
    const numFringes = Math.floor(screenHeight / i) + 1;
    setNumBrightFringes(numFringes);
  }, [wavelength, slitDistance, screenDistance]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || gameState !== 'playing') return;

    const animate = () => {
      setTime(t => t + 0.02);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, gameState]);

  // Draw double slit setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, width, height);

    // Draw slits
    const slitX = 100;
    const centerY = height / 2;
    const slitSep = slitDistance * 50; // Scale for visualization

    // Barrier
    ctx.fillStyle = '#475569';
    ctx.fillRect(slitX - 10, 0, 10, height);

    // Slits (gaps)
    ctx.fillStyle = '#0a0e27';
    const slitH = slitWidth * 100;
    ctx.fillRect(slitX - 10, centerY - slitSep/2 - slitH/2, 10, slitH);
    ctx.fillRect(slitX - 10, centerY + slitSep/2 - slitH/2, 10, slitH);

    // Screen
    const screenX = width - 100;
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(screenX, 0);
    ctx.lineTo(screenX, height);
    ctx.stroke();

    // Draw waves from slits
    if (isPlaying) {
      const numWaves = 8;
      for (let i = 0; i < numWaves; i++) {
        const radius = (time * 100 + i * 30) % 300;
        
        // Slit 1
        ctx.strokeStyle = `rgba(96, 165, 250, ${0.5 - radius/600})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(slitX, centerY - slitSep/2, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Slit 2
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.5 - radius/600})`;
        ctx.beginPath();
        ctx.arc(slitX, centerY + slitSep/2, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Labels
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Khe đôi', slitX - 30, height - 20);
    ctx.fillText('Màn', screenX - 20, height - 20);
    
    // Distance labels
    ctx.font = '12px Arial';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(`d = ${slitDistance} mm`, slitX + 10, centerY);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`D = ${screenDistance} mm`, width/2, height - 40);

    // Draw arrow for D
    ctx.strokeStyle = '#fbbf24';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(slitX, height - 50);
    ctx.lineTo(screenX, height - 50);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [time, slitDistance, screenDistance, slitWidth, isPlaying]);

  // Draw interference pattern
  useEffect(() => {
    const canvas = patternCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Calculate intensity pattern
    const lambda = wavelength * 1e-6; // mm
    const d = slitDistance;
    const D = screenDistance;
    const i = fringeSpacing;

    for (let y = 0; y < height; y++) {
      // Position on screen (mm from center)
      const yPos = ((y - height/2) / height) * 20; // 20mm screen height
      
      // Path difference: Δ = d·y/D
      const pathDiff = (d * yPos) / D;
      
      // Phase difference: δ = 2π·Δ/λ
      const phaseDiff = (2 * Math.PI * pathDiff) / lambda;
      
      // Intensity: I = I₀·cos²(δ/2)
      const intensity = Math.pow(Math.cos(phaseDiff / 2), 2);
      
      // Get color based on wavelength
      const rgb = wavelengthToRGB(wavelength);
      const r = Math.floor(rgb.r * intensity);
      const g = Math.floor(rgb.g * intensity);
      const b = Math.floor(rgb.b * intensity);
      
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, y, width, 1);
    }

    // Draw fringe markers
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    
    const centerY = height / 2;
    const pixelsPerMM = height / 20;
    
    // Central maximum
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Other maxima
    for (let n = 1; n <= 10; n++) {
      const yUp = centerY - n * i * pixelsPerMM;
      const yDown = centerY + n * i * pixelsPerMM;
      
      if (yUp >= 0) {
        ctx.beginPath();
        ctx.moveTo(0, yUp);
        ctx.lineTo(width, yUp);
        ctx.stroke();
      }
      
      if (yDown <= height) {
        ctx.beginPath();
        ctx.moveTo(0, yDown);
        ctx.lineTo(width, yDown);
        ctx.stroke();
      }
    }
    
    ctx.setLineDash([]);

  }, [wavelength, slitDistance, screenDistance, fringeSpacing]);

  // Convert wavelength (nm) to RGB
  const wavelengthToRGB = (lambda) => {
    if (lambda < 440) {
      return { r: 138, g: 43, b: 226 }; // Violet
    } else if (lambda < 490) {
      return { r: 0, g: 0, b: 255 }; // Blue
    } else if (lambda < 510) {
      return { r: 0, g: 255, b: 255 }; // Cyan
    } else if (lambda < 580) {
      return { r: 0, g: 255, b: 0 }; // Green
    } else if (lambda < 645) {
      return { r: 255, g: 255, b: 0 }; // Yellow
    } else if (lambda < 700) {
      return { r: 255, g: 140, b: 0 }; // Orange
    } else {
      return { r: 255, g: 0, b: 0 }; // Red
    }
  };

  // Check challenges
  useEffect(() => {
    if (gameState !== 'playing') return;

    const challenge = challenges[currentChallenge];
    if (!challenge || challenge.completed) return;

    let achieved = false;

    if (challenge.id === 1) {
      achieved = Math.abs(fringeSpacing - challenge.target) <= challenge.tolerance;
    } else if (challenge.id === 2) {
      const correctWavelength = Math.abs(wavelength - challenge.wavelengthTarget) <= 10;
      const correctSpacing = Math.abs(fringeSpacing - challenge.target) <= challenge.tolerance;
      achieved = correctWavelength && correctSpacing;
    } else if (challenge.id === 3) {
      achieved = numBrightFringes === challenge.target;
    }

    if (achieved) {
      const newChallenges = [...challenges];
      newChallenges[currentChallenge].completed = true;
      setChallenges(newChallenges);
      setScore(prev => prev + 200);
      
      if (currentChallenge < challenges.length - 1) {
        setTimeout(() => setCurrentChallenge(prev => prev + 1), 1000);
      } else {
        setTimeout(() => finishGame(), 2000);
      }
    }
  }, [fringeSpacing, wavelength, numBrightFringes, currentChallenge, gameState]);

  const startGame = () => {
    setGameState('playing');
    setIsPlaying(false);
    setTime(0);
    setScore(0);
    setCurrentChallenge(0);
    setChallenges(challenges.map(c => ({ ...c, completed: false })));
  };

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const resetSimulation = () => { setTime(0); setIsPlaying(false); };
  const finishGame = () => { setIsPlaying(false); setGameState('result'); };

  return (
    <div className="light-interference-container">
      <div className="light-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={24} />
        </button>
        <h1 className="light-title">
          <Sparkles className="title-icon" />
          Light Interference Simulator
        </h1>
        <div className="score-display">
          <Award size={20} />
          <span>{score}</span>
        </div>
      </div>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="menu-content">
            <Sparkles size={80} className="menu-icon" />
            <h2>Thí Nghiệm Giao Thoa Ánh Sáng Young</h2>
            <p className="menu-description">
              Khám phá hiện tượng giao thoa ánh sáng với thí nghiệm khe Young. Điều chỉnh khoảng
              cách khe, bước sóng để quan sát vân giao thoa. Công thức: i = λD/d
            </p>
            <div className="menu-features">
              <div className="feature-item">
                <Sparkles size={24} />
                <span>Mô phỏng khe Young 3D</span>
              </div>
              <div className="feature-item">
                <Target size={24} />
                <span>Vân giao thoa thời gian thực</span>
              </div>
            </div>
            <button onClick={startGame} className="start-button">
              <Play size={24} />
              Bắt đầu thí nghiệm
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="playing-screen">
          <div className="main-grid">
            <div className="setup-panel">
              <h3>Sơ Đồ Thí Nghiệm</h3>
              <canvas ref={canvasRef} width={600} height={400} className="setup-canvas" />
              
              <div className="controls">
                <button onClick={togglePlayPause} className="control-btn">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  {isPlaying ? 'Dừng' : 'Chạy'}
                </button>
                <button onClick={resetSimulation} className="control-btn">
                  <RotateCcw size={20} />
                  Reset
                </button>
              </div>

              <div className="info-panel">
                <div className="info-item">
                  <span>Khoảng vân:</span>
                  <strong>{fringeSpacing.toFixed(3)} mm</strong>
                </div>
                <div className="info-item">
                  <span>Số vân sáng:</span>
                  <strong>{numBrightFringes}</strong>
                </div>
              </div>
            </div>

            <div className="pattern-panel">
              <h3>Vân Giao Thoa</h3>
              <canvas ref={patternCanvasRef} width={150} height={400} className="pattern-canvas" />
              
              <div className="parameters">
                <div className="param-control">
                  <label>Khoảng cách khe d: {slitDistance.toFixed(2)} mm</label>
                  <input type="range" min="0.1" max="2" step="0.05" value={slitDistance}
                    onChange={(e) => setSlitDistance(parseFloat(e.target.value))} className="slider" />
                </div>

                <div className="param-control">
                  <label>Khoảng cách màn D: {screenDistance} mm</label>
                  <input type="range" min="500" max="2000" step="50" value={screenDistance}
                    onChange={(e) => setScreenDistance(parseFloat(e.target.value))} className="slider" />
                </div>

                <div className="param-control">
                  <label>Bước sóng λ: {wavelength} nm</label>
                  <input type="range" min="400" max="700" step="5" value={wavelength}
                    onChange={(e) => setWavelength(parseFloat(e.target.value))} className="slider" />
                  <div className="color-indicator" style={{ background: `rgb(${wavelengthToRGB(wavelength).r},${wavelengthToRGB(wavelength).g},${wavelengthToRGB(wavelength).b})` }}></div>
                </div>
              </div>

              <div className="challenge-box">
                <h3><Target size={20} /> Thử thách {currentChallenge + 1}/3</h3>
                {challenges[currentChallenge] && (
                  <div className={`challenge-item ${challenges[currentChallenge].completed ? 'completed' : ''}`}>
                    <p>{challenges[currentChallenge].text}</p>
                    {challenges[currentChallenge].completed && (
                      <span className="completed-badge">✓ +200</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'result' && (
        <div className="result-screen">
          <div className="result-content">
            <Award size={100} className="result-icon" />
            <h2>Thí Nghiệm Thành Công!</h2>
            <div className="result-score">
              <span className="score-label">Điểm:</span>
              <span className="score-value">{score}</span>
            </div>
            <div className="result-buttons">
              <button onClick={startGame} className="retry-button">Thử lại</button>
              <button onClick={() => navigate(-1)} className="home-button">Về trang chủ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LightInterferenceSimulator;
