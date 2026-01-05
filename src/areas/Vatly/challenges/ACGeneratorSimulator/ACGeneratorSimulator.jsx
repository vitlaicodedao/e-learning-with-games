import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Home, Play, RotateCw, Trophy, Zap, Activity } from 'lucide-react';
import './ACGeneratorSimulator.css';

/**
 * AC Generator Simulator - Grade 9 Physics Game
 * Demonstrates AC generation through electromagnetic rotation
 * Physics: E = E₀sin(ωt), f = p×n/60, ω = 2πf
 */

const ACGeneratorSimulator = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Game variables
  const [score, setScore] = useState(0);
  const [targetsCompleted, setTargetsCompleted] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  // Generator physics
  const [rotation, setRotation] = useState(0); // Current angle (degrees)
  const [rpm, setRPM] = useState(60); // Revolutions per minute
  const [magneticField, setMagneticField] = useState(1.0); // Tesla
  const [coilTurns, setCoilTurns] = useState(100);
  const [coilArea, setCoilArea] = useState(0.01); // m²
  
  // Output measurements
  const [currentEMF, setCurrentEMF] = useState(0);
  const [frequency, setFrequency] = useState(1);
  const [peakEMF, setPeakEMF] = useState(0);
  const [instantaneousPower, setInstantaneousPower] = useState(0);

  // Waveform history
  const [waveformData, setWaveformData] = useState([]);
  const maxWaveformPoints = 200;

  // Level configurations
  const levels = [
    {
      id: 1,
      name: 'Cơ bản - Tần số thấp',
      description: 'Làm quen với máy phát AC, quay với tốc độ thấp',
      duration: 120,
      targetFrequency: 1.0,
      targetEMFRange: [8, 12],
      targetsNeeded: 3,
      rpmRange: [30, 120],
      magneticFieldRange: [0.5, 2.0],
      coilTurnsRange: [50, 150]
    },
    {
      id: 2,
      name: 'Trung bình - Điều chỉnh thông số',
      description: 'Điều chỉnh từ trường và số vòng dây',
      duration: 150,
      targetFrequency: 2.0,
      targetEMFRange: [18, 25],
      targetsNeeded: 4,
      rpmRange: [60, 180],
      magneticFieldRange: [0.8, 2.5],
      coilTurnsRange: [80, 200]
    },
    {
      id: 3,
      name: 'Nâng cao - Tần số cao',
      description: 'Tạo dòng AC với tần số và điện áp cao',
      duration: 180,
      targetFrequency: 3.0,
      targetEMFRange: [35, 50],
      targetsNeeded: 5,
      rpmRange: [120, 240],
      magneticFieldRange: [1.5, 3.5],
      coilTurnsRange: [150, 300]
    },
    {
      id: 4,
      name: 'Chuyên gia - Tối ưu hóa',
      description: 'Tối ưu hóa công suất và hiệu suất',
      duration: 240,
      targetFrequency: 4.0,
      targetEMFRange: [55, 75],
      targetsNeeded: 6,
      rpmRange: [180, 300],
      magneticFieldRange: [2.0, 5.0],
      coilTurnsRange: [200, 500]
    }
  ];

  const currentLevel = levels[selectedLevel - 1];

  // Calculate physics
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Frequency: f = n/60 (Hz) where n is RPM
    const freq = rpm / 60;
    setFrequency(freq);

    // Angular velocity: ω = 2πf
    const omega = 2 * Math.PI * freq;

    // Peak EMF: E₀ = N×B×S×ω
    const E0 = coilTurns * magneticField * coilArea * omega;
    setPeakEMF(E0);

    // Instantaneous EMF: E = E₀sin(ωt)
    const t = rotation * (Math.PI / 180) / omega; // Convert angle to time
    const emf = E0 * Math.sin(rotation * Math.PI / 180);
    setCurrentEMF(emf);

    // Instantaneous power (assuming load resistance = 10Ω)
    const current = emf / 10;
    const power = emf * current;
    setInstantaneousPower(power);

  }, [rotation, rpm, magneticField, coilTurns, coilArea, gameState]);

  // Update rotation animation
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000; // seconds
      lastTime = now;

      // Rotation increment: degrees per second = (RPM / 60) * 360
      const degreesPerSecond = (rpm / 60) * 360;
      const deltaRotation = degreesPerSecond * deltaTime;

      setRotation(prev => (prev + deltaRotation) % 360);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, rpm]);

  // Update waveform data
  useEffect(() => {
    if (gameState !== 'playing') return;

    setWaveformData(prev => {
      const newData = [...prev, currentEMF];
      if (newData.length > maxWaveformPoints) {
        return newData.slice(-maxWaveformPoints);
      }
      return newData;
    });
  }, [currentEMF, gameState]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('victory');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);

    if (gameState === 'playing') {
      drawGenerator(ctx, width, height);
      drawWaveform(ctx, width, height);
      drawFieldLines(ctx, width, height);
    }
  }, [rotation, waveformData, gameState, magneticField]);

  const drawGenerator = (ctx, width, height) => {
    const centerX = 200;
    const centerY = 250;
    const radius = 80;

    // Magnetic poles (N and S)
    const poleWidth = 60;
    const poleHeight = 120;

    // North pole (left)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(centerX - radius - poleWidth - 20, centerY - poleHeight / 2, poleWidth, poleHeight);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', centerX - radius - poleWidth / 2 - 20, centerY);

    // South pole (right)
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(centerX + radius + 20, centerY - poleHeight / 2, poleWidth, poleHeight);
    ctx.fillStyle = '#fff';
    ctx.fillText('S', centerX + radius + poleWidth / 2 + 20, centerY);

    // Rotating coil
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation * Math.PI / 180);

    // Coil rectangle
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.strokeRect(-radius * 0.6, -radius * 0.8, radius * 1.2, radius * 1.6);

    // Coil winding lines
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const x = -radius * 0.6 + (radius * 1.2 / 6) * (i + 1);
      ctx.beginPath();
      ctx.moveTo(x, -radius * 0.8);
      ctx.lineTo(x, radius * 0.8);
      ctx.stroke();
    }

    // Axis
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Shaft extending from coil
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, 50);
    ctx.stroke();

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Khung dây quay', centerX, 30);
    ctx.fillText(`${coilTurns} vòng`, centerX, 45);
  };

  const drawWaveform = (ctx, width, height) => {
    const waveX = 450;
    const waveY = 50;
    const waveWidth = 330;
    const waveHeight = 180;

    // Background
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(waveX, waveY, waveWidth, waveHeight);

    // Grid lines
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    
    // Horizontal grid
    for (let i = 0; i <= 4; i++) {
      const y = waveY + (waveHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(waveX, y);
      ctx.lineTo(waveX + waveWidth, y);
      ctx.stroke();
    }

    // Zero line (middle)
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(waveX, waveY + waveHeight / 2);
    ctx.lineTo(waveX + waveWidth, waveY + waveHeight / 2);
    ctx.stroke();

    // Draw waveform
    if (waveformData.length > 1) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const pointSpacing = waveWidth / maxWaveformPoints;
      const scale = (waveHeight / 2) / (peakEMF || 1);

      waveformData.forEach((emf, index) => {
        const x = waveX + index * pointSpacing;
        const y = waveY + waveHeight / 2 - emf * scale;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }

    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Đồ thị điện áp AC', waveX + waveWidth / 2, waveY - 10);
    
    // Axis labels
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`+${peakEMF.toFixed(1)}V`, waveX - 40, waveY + 5);
    ctx.fillText('0V', waveX - 25, waveY + waveHeight / 2 + 5);
    ctx.fillText(`-${peakEMF.toFixed(1)}V`, waveX - 40, waveY + waveHeight - 5);
  };

  const drawFieldLines = (ctx, width, height) => {
    const fieldX = 450;
    const fieldY = 280;
    const fieldWidth = 330;
    const fieldHeight = 200;

    // Background
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(fieldX, fieldY, fieldWidth, fieldHeight);

    // Draw magnetic field strength indicator
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;

    const centerY = fieldY + fieldHeight / 2;
    const numLines = 8;

    for (let i = 0; i < numLines; i++) {
      const y = fieldY + 30 + (fieldHeight - 60) * (i / (numLines - 1));
      const startX = fieldX + 20;
      const endX = fieldX + fieldWidth - 20;
      
      // Arrow line
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();

      // Arrowhead
      const arrowSize = 8;
      ctx.beginPath();
      ctx.moveTo(endX, y);
      ctx.lineTo(endX - arrowSize, y - arrowSize / 2);
      ctx.lineTo(endX - arrowSize, y + arrowSize / 2);
      ctx.closePath();
      ctx.fillStyle = '#a855f7';
      ctx.fill();
    }

    // Field strength label
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Từ trường', fieldX + fieldWidth / 2, fieldY + 15);
    ctx.fillText(`B = ${magneticField.toFixed(2)} T`, fieldX + fieldWidth / 2, fieldY + fieldHeight - 10);
  };

  const adjustRPM = (delta) => {
    setRPM(prev => {
      const newRPM = prev + delta;
      return Math.max(currentLevel.rpmRange[0], Math.min(currentLevel.rpmRange[1], newRPM));
    });
  };

  const adjustMagneticField = (delta) => {
    setMagneticField(prev => {
      const newField = prev + delta;
      return Math.max(currentLevel.magneticFieldRange[0], Math.min(currentLevel.magneticFieldRange[1], newField));
    });
  };

  const adjustCoilTurns = (delta) => {
    setCoilTurns(prev => {
      const newTurns = prev + delta;
      return Math.max(currentLevel.coilTurnsRange[0], Math.min(currentLevel.coilTurnsRange[1], newTurns));
    });
  };

  const checkTarget = useCallback(() => {
    const freqMatch = Math.abs(frequency - currentLevel.targetFrequency) < 0.1;
    const emfInRange = peakEMF >= currentLevel.targetEMFRange[0] && 
                       peakEMF <= currentLevel.targetEMFRange[1];

    if (freqMatch && emfInRange) {
      const basePoints = 200;
      const timeBonus = Math.floor((timeLeft / 10)) * 10;
      const points = basePoints + timeBonus;
      
      setScore(prev => prev + points);
      setTargetsCompleted(prev => {
        const newCompleted = prev + 1;
        if (newCompleted >= currentLevel.targetsNeeded) {
          setTimeout(() => setGameState('victory'), 500);
        }
        return newCompleted;
      });

      // Reset waveform for next target
      setWaveformData([]);
      
      return true;
    }
    return false;
  }, [frequency, peakEMF, timeLeft, currentLevel]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTargetsCompleted(0);
    setTimeLeft(currentLevel.duration);
    setRotation(0);
    setRPM(60);
    setMagneticField(1.0);
    setCoilTurns(100);
    setCurrentEMF(0);
    setFrequency(1);
    setPeakEMF(0);
    setWaveformData([]);
  };

  const returnToMenu = () => {
    setGameState('menu');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render menu screen
  if (gameState === 'menu') {
    return (
      <div className="ac-generator-simulator">
        <header className="game-header">
          <button className="back-button" onClick={() => window.history.back()}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <Activity className="title-icon" size={40} />
            Máy Phát Điện AC
          </h1>
        </header>

        <div className="menu-screen">
          <div className="menu-content">
            <Activity className="menu-icon" size={80} />
            <h2>Máy Phát Điện AC</h2>
            <p className="menu-description">
              Tìm hiểu cách tạo ra dòng điện xoay chiều thông qua quay khung dây trong từ trường
            </p>

            <div className="theory-box">
              <h3>📚 Lý thuyết</h3>
              
              <div className="formula-section">
                <div className="formula-item">
                  <div className="formula">E = E₀sin(ωt)</div>
                  <div className="formula-desc">Suất điện động tức thời</div>
                  <div className="formula-desc">E: Điện áp (V)</div>
                  <div className="formula-desc">E₀: Điện áp cực đại</div>
                  <div className="formula-desc">ω: Tần số góc (rad/s)</div>
                </div>

                <div className="formula-item">
                  <div className="formula">E₀ = NBSω</div>
                  <div className="formula-desc">Điện áp cực đại</div>
                  <div className="formula-desc">N: Số vòng dây</div>
                  <div className="formula-desc">B: Từ trường (T)</div>
                  <div className="formula-desc">S: Diện tích (m²)</div>
                </div>

                <div className="formula-item">
                  <div className="formula">f = n/60</div>
                  <div className="formula-desc">Tần số dòng AC</div>
                  <div className="formula-desc">f: Tần số (Hz)</div>
                  <div className="formula-desc">n: Tốc độ quay (RPM)</div>
                  <div className="formula-desc">ω = 2πf</div>
                </div>
              </div>

              <div className="theory-note">
                <strong>Nguyên lý hoạt động:</strong>
                <p>Khi khung dây quay trong từ trường, từ thông qua khung dây thay đổi theo thời gian, 
                tạo ra suất điện động cảm ứng biến thiên điều hòa. Điện áp sinh ra có dạng hình sin 
                với tần số tỷ lệ với tốc độ quay và biên độ tỷ lệ với từ trường và số vòng dây.</p>
              </div>
            </div>

            <div className="level-selector">
              <h3>Chọn cấp độ</h3>
              <div className="level-buttons">
                {levels.map(level => (
                  <button
                    key={level.id}
                    className={`level-btn ${selectedLevel === level.id ? 'active' : ''}`}
                    onClick={() => setSelectedLevel(level.id)}
                  >
                    <span className="level-number">Cấp độ {level.id}</span>
                    <span className="level-name">{level.name}</span>
                    <span className="level-desc">{level.description}</span>
                    <span className="level-desc">
                      🎯 Mục tiêu: {level.targetsNeeded} lần | ⏱️ {level.duration}s
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button className="start-button" onClick={startGame}>
              <Play size={24} />
              <span>Bắt đầu</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render victory screen
  if (gameState === 'victory') {
    return (
      <div className="ac-generator-simulator">
        <header className="game-header">
          <button className="back-button" onClick={returnToMenu}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <Activity className="title-icon" size={40} />
            Máy Phát Điện AC
          </h1>
        </header>

        <div className="victory-screen">
          <div className="victory-content">
            <Trophy className="trophy-icon" size={100} />
            <h2>Hoàn thành!</h2>
            
            <div className="final-stats">
              <div className="final-stat">
                <span className="final-label">Điểm</span>
                <span className="final-value">{score}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Mục tiêu</span>
                <span className="final-value">{targetsCompleted}/{currentLevel.targetsNeeded}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Thời gian còn lại</span>
                <span className="final-value">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="victory-buttons">
              <button className="menu-button" onClick={returnToMenu}>
                <Home size={20} />
                <span>Menu</span>
              </button>
              <button className="replay-button" onClick={startGame}>
                <RotateCw size={20} />
                <span>Chơi lại</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render game screen
  return (
    <div className="ac-generator-simulator">
      <header className="game-header">
        <button className="back-button" onClick={returnToMenu}>
          <Home size={20} />
          <span>Menu</span>
        </button>
        <h1 className="game-title">
          <Activity className="title-icon" size={40} />
          Máy Phát Điện AC - Cấp độ {selectedLevel}
        </h1>
      </header>

      <div className="game-screen">
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Điểm</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Mục tiêu</span>
            <span className="stat-value">{targetsCompleted}/{currentLevel.targetsNeeded}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Thời gian</span>
            <span className="stat-value">{formatTime(timeLeft)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Tần số</span>
            <span className="stat-value">{frequency.toFixed(2)} Hz</span>
          </div>
        </div>

        <div className="game-content">
          <div className="generator-area">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="generator-canvas"
            />
          </div>

          <div className="control-panel">
            <div className="measurements">
              <h3>📊 Đo đạc</h3>
              
              <div className="measure-item">
                <span className="measure-label">Tần số (f):</span>
                <span className={`measure-value ${Math.abs(frequency - currentLevel.targetFrequency) < 0.1 ? 'target-met' : ''}`}>
                  {frequency.toFixed(2)} Hz
                </span>
              </div>

              <div className="measure-item">
                <span className="measure-label">Điện áp cực đại (E₀):</span>
                <span className={`measure-value ${peakEMF >= currentLevel.targetEMFRange[0] && peakEMF <= currentLevel.targetEMFRange[1] ? 'target-met' : ''}`}>
                  {peakEMF.toFixed(2)} V
                </span>
              </div>

              <div className="measure-item">
                <span className="measure-label">Điện áp tức thời (E):</span>
                <span className="measure-value">{currentEMF.toFixed(2)} V</span>
              </div>

              <div className="measure-item">
                <span className="measure-label">Công suất tức thời:</span>
                <span className="measure-value">{instantaneousPower.toFixed(2)} W</span>
              </div>

              <div className="measure-target">
                <strong>🎯 Mục tiêu:</strong>
                <div>Tần số: {currentLevel.targetFrequency.toFixed(1)} Hz (±0.1)</div>
                <div>Điện áp: {currentLevel.targetEMFRange[0]}-{currentLevel.targetEMFRange[1]} V</div>
              </div>
            </div>

            <div className="controls">
              <h3>⚙️ Điều khiển</h3>
              
              <div className="control-section">
                <div className="control-label">
                  Tốc độ quay: {rpm} RPM
                </div>
                <div className="button-group">
                  <button className="control-btn" onClick={() => adjustRPM(-10)}>
                    <span>-10</span>
                  </button>
                  <button className="control-btn" onClick={() => adjustRPM(10)}>
                    <span>+10</span>
                  </button>
                </div>
              </div>

              <div className="control-section">
                <div className="control-label">
                  Từ trường: {magneticField.toFixed(2)} T
                </div>
                <div className="button-group">
                  <button className="control-btn" onClick={() => adjustMagneticField(-0.1)}>
                    <span>-0.1</span>
                  </button>
                  <button className="control-btn" onClick={() => adjustMagneticField(0.1)}>
                    <span>+0.1</span>
                  </button>
                </div>
              </div>

              <div className="control-section">
                <div className="control-label">
                  Số vòng dây: {coilTurns}
                </div>
                <div className="button-group">
                  <button className="control-btn" onClick={() => adjustCoilTurns(-10)}>
                    <span>-10</span>
                  </button>
                  <button className="control-btn" onClick={() => adjustCoilTurns(10)}>
                    <span>+10</span>
                  </button>
                </div>
              </div>

              <button className="check-btn" onClick={checkTarget}>
                <Zap size={20} />
                <span>Kiểm tra</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ACGeneratorSimulator;
