import React, { useState, useEffect, useRef } from 'react';
import { Home, Play, RotateCw, Trophy, Radio, Zap } from 'lucide-react';
import './UltrasoundApplicationLab.css';

/**
 * Ultrasound Application Lab - Grade 11 Chapter 2: Waves and Sound
 * SONAR, medical ultrasound, distance calculation from echo time
 */

const UltrasoundApplicationLab = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [mode, setMode] = useState('sonar'); // sonar, medical, calculator
  
  // Ultrasound parameters
  const [frequency, setFrequency] = useState(40000); // Hz (20kHz - 100kHz)
  const [soundSpeed, setSoundSpeed] = useState(1500); // m/s (water/tissue)
  const [pulseTime, setPulseTime] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  
  // SONAR mode
  const [targetDistance, setTargetDistance] = useState(500); // m
  const [measuredDistance, setMeasuredDistance] = useState(0);
  const [echoTime, setEchoTime] = useState(0);
  
  // Medical mode
  const [tissueDepth, setTissueDepth] = useState(50); // mm
  const [imagingDepth, setImagingDepth] = useState(150); // mm
  
  // Game mode
  const [gameMode, setGameMode] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    correctMeasurements: 0,
    totalAttempts: 0,
    accuracy: 0
  });

  useEffect(() => {
    if (isScanning && gameState === 'playing') {
      const interval = setInterval(() => {
        setPulseTime(t => {
          const newTime = t + 0.1;
          if (newTime >= echoTime) {
            setIsScanning(false);
            return 0;
          }
          return newTime;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isScanning, gameState, echoTime]);

  useEffect(() => {
    if (gameState === 'playing') {
      drawVisualization();
    }
  }, [gameState, mode, pulseTime, targetDistance, tissueDepth, frequency, imagingDepth]);

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    if (mode === 'sonar') {
      drawSonar(ctx, width, height);
    } else if (mode === 'medical') {
      drawMedicalUltrasound(ctx, width, height);
    } else {
      drawCalculator(ctx, width, height);
    }
  };

  const drawSonar = (ctx, width, height) => {
    const centerX = width / 2;
    const centerY = height - 50;
    
    // Draw submarine/ship
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText('SONAR', centerX - 25, centerY - 30);
    
    // Draw ultrasound beam
    if (isScanning) {
      const maxDistance = 600;
      const currentDistance = (pulseTime / echoTime) * targetDistance;
      const scale = (height - 100) / maxDistance;
      
      // Outgoing pulse
      if (pulseTime < echoTime / 2) {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX, centerY - currentDistance * scale * 2);
        ctx.stroke();
        
        // Pulse circle
        ctx.fillStyle = 'rgba(34, 197, 94, 0.5)';
        ctx.beginPath();
        ctx.arc(centerX, centerY - currentDistance * scale * 2, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Echo return
      if (pulseTime >= echoTime / 2) {
        const returnDistance = targetDistance - (currentDistance - targetDistance);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - targetDistance * scale);
        ctx.lineTo(centerX, centerY - returnDistance * scale);
        ctx.stroke();
        
        // Echo circle
        ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.beginPath();
        ctx.arc(centerX, centerY - returnDistance * scale, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Draw target
    const targetScale = (height - 100) / 600;
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(centerX - 40, centerY - targetDistance * targetScale - 10, 80, 20);
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText(`Target: ${targetDistance}m`, centerX - 35, centerY - targetDistance * targetScale + 5);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 100; i <= 600; i += 100) {
      const y = centerY - i * targetScale;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Arial';
      ctx.fillText(`${i}m`, 10, y - 5);
    }
    
    // Display info
    if (measuredDistance > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(width - 220, 10, 210, 80);
      
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('Kết quả đo:', width - 210, 35);
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.fillText(`Thời gian echo: ${echoTime.toFixed(3)}s`, width - 210, 55);
      ctx.fillText(`Khoảng cách: ${measuredDistance.toFixed(1)}m`, width - 210, 75);
    }
  };

  const drawMedicalUltrasound = (ctx, width, height) => {
    // Draw ultrasound probe
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(width / 2 - 30, 10, 60, 30);
    
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText('Probe', width / 2 - 20, 30);
    
    // Draw ultrasound beam cone
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 30, 40);
    ctx.lineTo(width / 2 - 100, height - 50);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width / 2 + 30, 40);
    ctx.lineTo(width / 2 + 100, height - 50);
    ctx.stroke();
    
    // Draw tissue layers (simulated B-mode imaging)
    const scale = (height - 100) / imagingDepth;
    
    // Skin layer
    ctx.fillStyle = 'rgba(255, 200, 150, 0.3)';
    ctx.fillRect(width / 2 - 100, 40, 200, 20 * scale);
    
    // Fat layer
    ctx.fillStyle = 'rgba(255, 220, 100, 0.3)';
    ctx.fillRect(width / 2 - 100, 40 + 20 * scale, 200, 30 * scale);
    
    // Muscle layer
    ctx.fillStyle = 'rgba(200, 100, 100, 0.3)';
    ctx.fillRect(width / 2 - 100, 40 + 50 * scale, 200, 50 * scale);
    
    // Target tissue/organ
    ctx.fillStyle = 'rgba(100, 150, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(width / 2, 40 + tissueDepth * scale, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Distance marker
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 40);
    ctx.lineTo(width / 2, 40 + tissueDepth * scale);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('Skin', width / 2 + 110, 50);
    ctx.fillText('Fat', width / 2 + 110, 70 + 20 * scale);
    ctx.fillText('Muscle', width / 2 + 110, 90 + 50 * scale);
    ctx.fillText(`Target`, width / 2 + 40, 40 + tissueDepth * scale);
    
    // Depth scale
    for (let i = 0; i <= imagingDepth; i += 20) {
      const y = 40 + i * scale;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 110, y);
      ctx.lineTo(width / 2 - 100, y);
      ctx.stroke();
      
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Arial';
      ctx.fillText(`${i}mm`, width / 2 - 145, y + 5);
    }
    
    // Info box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, height - 100, 250, 90);
    
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Thông số kỹ thuật:', 20, height - 75);
    
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText(`Tần số: ${(frequency / 1000).toFixed(0)} MHz`, 20, height - 55);
    ctx.fillText(`Độ sâu: ${tissueDepth.toFixed(1)} mm`, 20, height - 35);
    ctx.fillText(`Tốc độ âm: ${soundSpeed} m/s`, 20, height - 15);
  };

  const drawCalculator = (ctx, width, height) => {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Distance Calculator', width / 2 - 120, 50);
    
    ctx.font = '18px Arial';
    ctx.fillText('d = (v × t) / 2', width / 2 - 70, 100);
    
    // Draw diagram
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Source
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(centerX - 200, centerY, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('Source', centerX - 225, centerY - 30);
    
    // Target
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(centerX + 200, centerY, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.fillText('Target', centerX + 175, centerY - 30);
    
    // Distance arrow
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - 180, centerY);
    ctx.lineTo(centerX + 180, centerY);
    ctx.stroke();
    
    // Arrow heads
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(centerX + 180, centerY);
    ctx.lineTo(centerX + 170, centerY - 7);
    ctx.lineTo(centerX + 170, centerY + 7);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('d = ?', centerX - 20, centerY - 20);
    
    // Formula explanation
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(50, height - 200, width - 100, 150);
    
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Công thức tính khoảng cách:', 70, height - 170);
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('• d: Khoảng cách đến vật (m)', 70, height - 145);
    ctx.fillText('• v: Tốc độ âm thanh (m/s)', 70, height - 120);
    ctx.fillText('• t: Thời gian echo (s)', 70, height - 95);
    ctx.fillText('• Chia 2 vì sóng đi và về', 70, height - 70);
  };

  const startScan = () => {
    const time = (2 * targetDistance) / soundSpeed;
    setEchoTime(time);
    setPulseTime(0);
    setIsScanning(true);
    
    setTimeout(() => {
      const measured = (soundSpeed * time) / 2;
      setMeasuredDistance(measured);
    }, time * 1000);
  };

  const generateChallenge = () => {
    const challenges = [
      {
        type: 'sonar-distance',
        setup: () => {
          const dist = 100 + Math.random() * 500;
          const speed = 1500;
          const time = (2 * dist) / speed;
          return {
            question: `Tàu ngầm phát sóng siêu âm và nhận echo sau ${time.toFixed(3)}s. Tốc độ âm trong nước là ${speed}m/s. Tính khoảng cách đến vật?`,
            answer: dist.toFixed(0),
            tolerance: 10,
            unit: 'm'
          };
        }
      },
      {
        type: 'medical-depth',
        setup: () => {
          const depth = 20 + Math.random() * 100;
          const speed = 1540;
          const time = (2 * depth / 1000) / speed;
          return {
            question: `Siêu âm y tế nhận được echo sau ${(time * 1000000).toFixed(1)}μs. Với v=${speed}m/s, độ sâu mô là bao nhiêu?`,
            answer: depth.toFixed(0),
            tolerance: 5,
            unit: 'mm'
          };
        }
      },
      {
        type: 'echo-time',
        setup: () => {
          const dist = 200 + Math.random() * 400;
          const speed = 1500;
          const time = (2 * dist) / speed;
          return {
            question: `Vật ở cách nguồn ${dist.toFixed(0)}m. Tốc độ âm ${speed}m/s. Thời gian echo là bao nhiêu?`,
            answer: time.toFixed(3),
            tolerance: 0.01,
            unit: 's'
          };
        }
      }
    ];
    
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    setChallenge(challenge.setup());
    setUserAnswer('');
  };

  const checkAnswer = () => {
    if (!challenge) return;
    
    const userNum = parseFloat(userAnswer);
    const correct = Math.abs(userNum - parseFloat(challenge.answer)) <= challenge.tolerance;
    
    if (correct) {
      setScore(s => s + 100);
      setStats(prev => ({
        correctMeasurements: prev.correctMeasurements + 1,
        totalAttempts: prev.totalAttempts + 1,
        accuracy: ((prev.correctMeasurements + 1) / (prev.totalAttempts + 1) * 100).toFixed(1)
      }));
      alert('Chính xác! +100 điểm');
    } else {
      setStats(prev => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        accuracy: (prev.correctMeasurements / (prev.totalAttempts + 1) * 100).toFixed(1)
      }));
      alert(`Sai rồi! Đáp án: ${challenge.answer} ${challenge.unit}`);
    }
    
    setRound(r => r + 1);
    if (round < 9) {
      generateChallenge();
    } else {
      setGameState('result');
    }
  };

  const startGame = (isGame = false) => {
    setGameState('playing');
    setGameMode(isGame);
    setScore(0);
    setRound(0);
    if (isGame) {
      generateChallenge();
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setGameMode(false);
    setIsScanning(false);
    setMeasuredDistance(0);
  };

  // Menu
  if (gameState === 'menu') {
    return (
      <div className="ultrasound-container">
        <div className="ultrasound-menu">
          <div className="ultrasound-menu-content">
            <div className="ultrasound-title">
              <Radio className="ultrasound-title-icon" />
              <h1>Ultrasound Application Lab</h1>
            </div>
            <p className="ultrasound-description">
              Khám phá ứng dụng siêu âm: SONAR phát hiện vật thể dưới nước, 
              siêu âm y tế chẩn đoán hình ảnh, và tính toán khoảng cách từ thời gian echo.
            </p>
            
            <div className="ultrasound-stats">
              <div className="stat-item">
                <Trophy className="stat-icon" />
                <div>
                  <div className="stat-value">{stats.correctMeasurements}</div>
                  <div className="stat-label">Đo chính xác</div>
                </div>
              </div>
              <div className="stat-item">
                <Radio className="stat-icon" />
                <div>
                  <div className="stat-value">{stats.totalAttempts}</div>
                  <div className="stat-label">Tổng lần đo</div>
                </div>
              </div>
              <div className="stat-item">
                <Trophy className="stat-icon" />
                <div>
                  <div className="stat-value">{stats.accuracy}%</div>
                  <div className="stat-label">Độ chính xác</div>
                </div>
              </div>
            </div>

            <div className="ultrasound-menu-buttons">
              <button className="ultrasound-btn ultrasound-btn-primary" onClick={() => startGame(false)}>
                <Play size={20} />
                Chế độ mô phỏng
              </button>
              <button className="ultrasound-btn ultrasound-btn-secondary" onClick={() => startGame(true)}>
                <Trophy size={20} />
                Thử thách tính toán
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result
  if (gameState === 'result') {
    return (
      <div className="ultrasound-container">
        <div className="ultrasound-menu">
          <div className="ultrasound-menu-content">
            <div className="ultrasound-title">
              <Trophy className="ultrasound-title-icon" />
              <h1>Kết quả</h1>
            </div>
            <div className="result-score">
              <div className="result-value">{score}</div>
              <div className="result-label">Tổng điểm</div>
            </div>
            <div className="ultrasound-menu-buttons">
              <button className="ultrasound-btn ultrasound-btn-primary" onClick={() => startGame(true)}>
                <RotateCw size={20} />
                Chơi lại
              </button>
              <button className="ultrasound-btn ultrasound-btn-secondary" onClick={resetGame}>
                <Home size={20} />
                Về menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  return (
    <div className="ultrasound-container">
      <div className="ultrasound-game">
        <div className="ultrasound-header">
          <div className="ultrasound-header-left">
            <button className="ultrasound-icon-btn" onClick={resetGame}>
              <Home size={24} />
            </button>
            <h2>Ultrasound Application Lab</h2>
          </div>
          <div className="ultrasound-header-right">
            {gameMode && (
              <div className="ultrasound-score">
                Điểm: {score} | Câu: {round + 1}/10
              </div>
            )}
          </div>
        </div>

        <div className="ultrasound-content">
          <div className="ultrasound-canvas-container">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="ultrasound-canvas"
            />
          </div>

          <div className="ultrasound-controls">
            {!gameMode && (
              <div className="control-section">
                <h3>Chế độ</h3>
                <div className="mode-buttons">
                  <button 
                    className={`mode-btn ${mode === 'sonar' ? 'active' : ''}`}
                    onClick={() => setMode('sonar')}
                  >
                    SONAR
                  </button>
                  <button 
                    className={`mode-btn ${mode === 'medical' ? 'active' : ''}`}
                    onClick={() => setMode('medical')}
                  >
                    Y tế
                  </button>
                  <button 
                    className={`mode-btn ${mode === 'calculator' ? 'active' : ''}`}
                    onClick={() => setMode('calculator')}
                  >
                    Công thức
                  </button>
                </div>
              </div>
            )}

            {mode === 'sonar' && !gameMode && (
              <div className="control-section">
                <h3>SONAR</h3>
                <div className="control-group">
                  <label>
                    Khoảng cách mục tiêu: {targetDistance}m
                    <input
                      type="range"
                      min="100"
                      max="600"
                      step="10"
                      value={targetDistance}
                      onChange={(e) => setTargetDistance(parseFloat(e.target.value))}
                    />
                  </label>
                </div>
                <div className="control-group">
                  <label>
                    Tốc độ âm thanh: {soundSpeed}m/s
                    <input
                      type="range"
                      min="1400"
                      max="1600"
                      step="10"
                      value={soundSpeed}
                      onChange={(e) => setSoundSpeed(parseFloat(e.target.value))}
                    />
                  </label>
                </div>
                <div className="control-group">
                  <label>
                    Tần số: {(frequency / 1000).toFixed(0)}kHz
                    <input
                      type="range"
                      min="20000"
                      max="100000"
                      step="5000"
                      value={frequency}
                      onChange={(e) => setFrequency(parseFloat(e.target.value))}
                    />
                  </label>
                </div>
                <button 
                  className="ultrasound-btn ultrasound-btn-primary"
                  onClick={startScan}
                  disabled={isScanning}
                >
                  <Zap size={20} />
                  {isScanning ? 'Đang quét...' : 'Bắt đầu quét'}
                </button>
              </div>
            )}

            {mode === 'medical' && !gameMode && (
              <div className="control-section">
                <h3>Siêu âm Y tế</h3>
                <div className="control-group">
                  <label>
                    Độ sâu mục tiêu: {tissueDepth.toFixed(1)}mm
                    <input
                      type="range"
                      min="10"
                      max="150"
                      step="5"
                      value={tissueDepth}
                      onChange={(e) => setTissueDepth(parseFloat(e.target.value))}
                    />
                  </label>
                </div>
                <div className="control-group">
                  <label>
                    Độ sâu hình ảnh: {imagingDepth}mm
                    <input
                      type="range"
                      min="50"
                      max="200"
                      step="10"
                      value={imagingDepth}
                      onChange={(e) => setImagingDepth(parseFloat(e.target.value))}
                    />
                  </label>
                </div>
                <div className="control-group">
                  <label>
                    Tần số: {(frequency / 1000000).toFixed(1)}MHz
                    <input
                      type="range"
                      min="2000000"
                      max="15000000"
                      step="500000"
                      value={frequency}
                      onChange={(e) => setFrequency(parseFloat(e.target.value))}
                    />
                  </label>
                </div>
                <div className="ultrasound-info-box">
                  <p><strong>B-mode imaging:</strong> Hiển thị cấu trúc mô</p>
                  <p><strong>Tần số cao:</strong> Độ phân giải tốt, độ xuyên sâu thấp</p>
                  <p><strong>Tần số thấp:</strong> Xuyên sâu tốt, độ phân giải thấp</p>
                </div>
              </div>
            )}

            {mode === 'calculator' && !gameMode && (
              <div className="control-section">
                <h3>Máy tính khoảng cách</h3>
                <div className="calculator-inputs">
                  <div className="calc-input-group">
                    <label>Tốc độ âm (v):</label>
                    <input
                      type="number"
                      value={soundSpeed}
                      onChange={(e) => setSoundSpeed(parseFloat(e.target.value))}
                      className="calc-input"
                    />
                    <span>m/s</span>
                  </div>
                  <div className="calc-input-group">
                    <label>Thời gian echo (t):</label>
                    <input
                      type="number"
                      step="0.001"
                      value={echoTime}
                      onChange={(e) => setEchoTime(parseFloat(e.target.value))}
                      className="calc-input"
                    />
                    <span>s</span>
                  </div>
                  <div className="calc-result">
                    <strong>Khoảng cách:</strong>
                    <span className="calc-value">
                      {((soundSpeed * echoTime) / 2).toFixed(2)} m
                    </span>
                  </div>
                </div>
              </div>
            )}

            {gameMode && challenge && (
              <div className="control-section challenge-section">
                <h3>Thử thách {round + 1}/10</h3>
                <p className="challenge-question">{challenge.question}</p>
                <div className="challenge-input-group">
                  <input
                    type="number"
                    step="any"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Nhập câu trả lời"
                    className="challenge-input"
                  />
                  <span className="challenge-unit">{challenge.unit}</span>
                </div>
                <button
                  className="ultrasound-btn ultrasound-btn-primary"
                  onClick={checkAnswer}
                  disabled={!userAnswer}
                >
                  Kiểm tra
                </button>
              </div>
            )}

            <div className="control-section">
              <h3>Ứng dụng siêu âm</h3>
              <div className="ultrasound-info-box">
                <p><strong>SONAR:</strong> Phát hiện vật thể dưới nước (tàu ngầm, cá)</p>
                <p><strong>Y tế:</strong> Chẩn đoán hình ảnh, thai nhi</p>
                <p><strong>Công nghiệp:</strong> Kiểm tra khuyết tật vật liệu</p>
                <p><strong>Tần số:</strong> 20kHz - 100MHz</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltrasoundApplicationLab;
