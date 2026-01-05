import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Zap, Battery, Activity } from 'lucide-react';
import './OhmLawCircuitLab.css';

/**
 * Ohm Law Circuit Lab - Lớp 9 Chương 1: Điện học
 * 
 * Game tương tác về định luật Ôm: I = U/R
 * Học sinh điều chỉnh hiệu điện thế và điện trở để đạt dòng điện mục tiêu
 * 
 * Physics:
 * - Định luật Ôm: I = U/R (A = V/Ω)
 * - Công suất: P = U×I = I²R = U²/R (W)
 * - Năng lượng: A = P×t (J)
 * 
 * 4 Levels:
 * 1. Cơ bản: Điều chỉnh U với R cố định
 * 2. Trung bình: Điều chỉnh cả U và R
 * 3. Khó: Đạt nhiều mục tiêu liên tiếp
 * 4. Chuyên gia: Giới hạn thời gian và độ chính xác cao
 */

const OhmLawCircuitLab = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Game states
  const [gameState, setGameState] = useState('menu'); // menu, playing, victory
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [attempts, setAttempts] = useState(0);

  // Circuit parameters
  const [voltage, setVoltage] = useState(6); // Hiệu điện thế (V)
  const [resistance, setResistance] = useState(10); // Điện trở (Ω)
  const [current, setCurrent] = useState(0); // Dòng điện (A)
  const [power, setPower] = useState(0); // Công suất (W)

  // Target values
  const [targetCurrent, setTargetCurrent] = useState(0.5);
  const [tolerance, setTolerance] = useState(0.05); // Sai số cho phép
  const [targetsCompleted, setTargetsCompleted] = useState(0);

  // Animation particles
  const [electrons, setElectrons] = useState([]);

  // Level configurations
  const levelConfigs = {
    1: {
      name: 'Cơ Bản',
      description: 'Điều chỉnh hiệu điện thế để đạt dòng điện mục tiêu',
      targets: 3,
      timeLimit: 60,
      resistanceFixed: true,
      tolerance: 0.1
    },
    2: {
      name: 'Trung Bình',
      description: 'Điều chỉnh cả U và R để đạt dòng điện mục tiêu',
      targets: 5,
      timeLimit: 90,
      resistanceFixed: false,
      tolerance: 0.08
    },
    3: {
      name: 'Khó',
      description: 'Hoàn thành nhiều mục tiêu liên tiếp với độ chính xác cao',
      targets: 7,
      timeLimit: 120,
      resistanceFixed: false,
      tolerance: 0.05
    },
    4: {
      name: 'Chuyên Gia',
      description: 'Thách thức cuối cùng với thời gian giới hạn',
      targets: 10,
      timeLimit: 150,
      resistanceFixed: false,
      tolerance: 0.03
    }
  };

  // Calculate current and power based on Ohm's Law
  useEffect(() => {
    if (resistance > 0) {
      const calculatedCurrent = voltage / resistance;
      const calculatedPower = voltage * calculatedCurrent;
      setCurrent(calculatedCurrent);
      setPower(calculatedPower);
    }
  }, [voltage, resistance]);

  // Initialize game
  const startGame = useCallback(() => {
    const config = levelConfigs[level];
    setGameState('playing');
    setScore(0);
    setTimeLeft(config.timeLimit);
    setAttempts(0);
    setTargetsCompleted(0);
    setTolerance(config.tolerance);
    
    // Set initial values
    setVoltage(6);
    setResistance(config.resistanceFixed ? 10 : 5);
    
    // Generate random target
    generateNewTarget();
    
    // Initialize electrons
    initializeElectrons();
  }, [level]);

  // Generate new target current
  const generateNewTarget = () => {
    const minCurrent = 0.2;
    const maxCurrent = 2.0;
    const newTarget = minCurrent + Math.random() * (maxCurrent - minCurrent);
    setTargetCurrent(parseFloat(newTarget.toFixed(2)));
  };

  // Initialize electron particles
  const initializeElectrons = () => {
    const particleCount = 50;
    const newElectrons = [];
    
    for (let i = 0; i < particleCount; i++) {
      newElectrons.push({
        id: i,
        x: Math.random() * 600,
        y: Math.random() * 400,
        vx: 0,
        vy: 0,
        phase: Math.random() * Math.PI * 2
      });
    }
    
    setElectrons(newElectrons);
  };

  // Check if current matches target
  const checkTarget = () => {
    const difference = Math.abs(current - targetCurrent);
    const isMatch = difference <= tolerance;
    
    setAttempts(prev => prev + 1);
    
    if (isMatch) {
      // Success!
      const config = levelConfigs[level];
      const timeBonus = Math.floor(timeLeft / 10) * 10;
      const accuracyBonus = Math.floor((1 - difference / tolerance) * 50);
      const earnedPoints = 100 + timeBonus + accuracyBonus;
      
      setScore(prev => prev + earnedPoints);
      setTargetsCompleted(prev => prev + 1);
      
      // Check if level complete
      if (targetsCompleted + 1 >= config.targets) {
        completeLevel();
      } else {
        // Generate new target
        generateNewTarget();
      }
    }
    
    return isMatch;
  };

  // Complete current level
  const completeLevel = () => {
    if (level < 4) {
      setLevel(prev => prev + 1);
      setTimeout(() => startGame(), 1000);
    } else {
      setGameState('victory');
    }
  };

  // Timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
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
    }
  }, [gameState, timeLeft]);

  // Canvas animation
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 400;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw circuit
      drawCircuit(ctx);
      
      // Update and draw electrons
      updateElectrons();
      drawElectrons(ctx);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, electrons, voltage, resistance, current]);

  // Draw circuit components
  const drawCircuit = (ctx) => {
    // Battery
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    
    // Positive terminal
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(50, 180, 30, 40);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('+', 60, 207);
    
    // Negative terminal
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(50, 220, 30, 20);
    ctx.fillStyle = '#fff';
    ctx.fillText('−', 60, 237);
    
    // Battery label
    ctx.fillStyle = '#fbbf24';
    ctx.font = '14px Arial';
    ctx.fillText(`${voltage.toFixed(1)}V`, 50, 260);
    
    // Wire from battery positive to resistor
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 200);
    ctx.lineTo(300, 200);
    ctx.stroke();
    
    // Resistor
    drawResistor(ctx, 300, 200);
    
    // Wire from resistor to battery negative
    ctx.beginPath();
    ctx.moveTo(340, 200);
    ctx.lineTo(550, 200);
    ctx.lineTo(550, 230);
    ctx.lineTo(80, 230);
    ctx.stroke();
    
    // Ammeter (in circuit)
    ctx.strokeStyle = '#10b981';
    ctx.fillStyle = '#064e3b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(420, 200, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('A', 415, 205);
    
    // Current reading
    ctx.fillStyle = '#10b981';
    ctx.font = '14px Arial';
    ctx.fillText(`${current.toFixed(3)}A`, 400, 240);
  };

  // Draw resistor zigzag
  const drawResistor = (ctx, x, y) => {
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const segments = 6;
    const segmentWidth = 40 / segments;
    const height = 15;
    
    ctx.moveTo(x, y);
    
    for (let i = 0; i < segments; i++) {
      const startX = x + i * segmentWidth;
      const endX = startX + segmentWidth;
      const yOffset = (i % 2 === 0) ? -height : height;
      ctx.lineTo(endX, y + yOffset);
    }
    
    ctx.lineTo(x + 40, y);
    ctx.stroke();
    
    // Resistor value label
    ctx.fillStyle = '#8b5cf6';
    ctx.font = '14px Arial';
    ctx.fillText(`${resistance.toFixed(1)}Ω`, x, y - 20);
  };

  // Update electron positions
  const updateElectrons = () => {
    if (current <= 0) return;
    
    setElectrons(prevElectrons => {
      return prevElectrons.map(electron => {
        // Speed based on current
        const speed = current * 2;
        
        // Circular motion along circuit path
        electron.phase += speed * 0.02;
        
        // Circuit path: rectangle
        const pathLength = 1000; // arbitrary units
        const position = (electron.phase * pathLength / (Math.PI * 2)) % pathLength;
        
        let newX, newY;
        
        if (position < 250) {
          // Top side: battery to resistor
          newX = 80 + (position / 250) * 460;
          newY = 200;
        } else if (position < 280) {
          // Right side: going down
          newX = 540;
          newY = 200 + ((position - 250) / 30) * 30;
        } else if (position < 730) {
          // Bottom side: back to battery
          newX = 540 - ((position - 280) / 450) * 460;
          newY = 230;
        } else {
          // Left side: going up
          newX = 80;
          newY = 230 - ((position - 730) / 270) * 30;
        }
        
        return {
          ...electron,
          x: newX,
          y: newY
        };
      });
    });
  };

  // Draw electrons
  const drawElectrons = (ctx) => {
    electrons.forEach(electron => {
      // Glow effect
      const gradient = ctx.createRadialGradient(
        electron.x, electron.y, 0,
        electron.x, electron.y, 4
      );
      gradient.addColorStop(0, '#60a5fa');
      gradient.addColorStop(1, 'rgba(96, 165, 250, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(electron.x, electron.y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Core
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(electron.x, electron.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  // Handle voltage change
  const handleVoltageChange = (e) => {
    setVoltage(parseFloat(e.target.value));
  };

  // Handle resistance change
  const handleResistanceChange = (e) => {
    setResistance(parseFloat(e.target.value));
  };

  const config = levelConfigs[level];

  return (
    <div className="ohm-law-circuit-lab">
      <div className="game-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <h1 className="game-title">
          <Zap className="title-icon" />
          Ohm Law Circuit Lab
        </h1>
      </div>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="menu-content">
            <Battery size={80} className="menu-icon" />
            <h2>Phòng Thí Nghiệm Định Luật Ôm</h2>
            <p className="menu-description">
              Khám phá định luật Ôm: <strong>I = U/R</strong>
            </p>
            
            <div className="theory-box">
              <h3>Lý Thuyết</h3>
              <div className="theory-content">
                <p><strong>Định luật Ôm:</strong></p>
                <p className="formula">I = U / R</p>
                <ul>
                  <li><strong>I:</strong> Cường độ dòng điện (A)</li>
                  <li><strong>U:</strong> Hiệu điện thế (V)</li>
                  <li><strong>R:</strong> Điện trở (Ω)</li>
                </ul>
                <p><strong>Công suất điện:</strong></p>
                <p className="formula">P = U × I = I² × R = U² / R</p>
              </div>
            </div>

            <div className="level-selector">
              <h3>Chọn Độ Khó</h3>
              <div className="level-buttons">
                {[1, 2, 3, 4].map(lvl => (
                  <button
                    key={lvl}
                    className={`level-btn ${level === lvl ? 'active' : ''}`}
                    onClick={() => setLevel(lvl)}
                  >
                    <span className="level-number">Level {lvl}</span>
                    <span className="level-name">{levelConfigs[lvl].name}</span>
                    <span className="level-desc">{levelConfigs[lvl].description}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={startGame} className="start-button">
              <Zap size={20} />
              Bắt Đầu Thí Nghiệm
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-screen">
          <div className="game-stats">
            <div className="stat-item">
              <span className="stat-label">Level</span>
              <span className="stat-value">{level} - {config.name}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Điểm</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Mục tiêu</span>
              <span className="stat-value">{targetsCompleted}/{config.targets}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Thời gian</span>
              <span className="stat-value">{timeLeft}s</span>
            </div>
          </div>

          <div className="game-content">
            <div className="circuit-area">
              <canvas ref={canvasRef} className="circuit-canvas" />
            </div>

            <div className="control-panel">
              <div className="target-display">
                <Activity className="target-icon" />
                <div className="target-info">
                  <h3>Dòng Điện Mục Tiêu</h3>
                  <div className="target-value">{targetCurrent.toFixed(3)} A</div>
                  <div className="target-tolerance">
                    Sai số: ± {(tolerance * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="controls">
                <div className="control-group">
                  <label htmlFor="voltage-slider">
                    <Battery className="control-icon" />
                    Hiệu Điện Thế: <strong>{voltage.toFixed(1)} V</strong>
                  </label>
                  <input
                    id="voltage-slider"
                    type="range"
                    min="1"
                    max="12"
                    step="0.5"
                    value={voltage}
                    onChange={handleVoltageChange}
                    className="slider voltage-slider"
                  />
                  <div className="slider-labels">
                    <span>1V</span>
                    <span>12V</span>
                  </div>
                </div>

                {!config.resistanceFixed && (
                  <div className="control-group">
                    <label htmlFor="resistance-slider">
                      <Zap className="control-icon" />
                      Điện Trở: <strong>{resistance.toFixed(1)} Ω</strong>
                    </label>
                    <input
                      id="resistance-slider"
                      type="range"
                      min="1"
                      max="20"
                      step="0.5"
                      value={resistance}
                      onChange={handleResistanceChange}
                      className="slider resistance-slider"
                    />
                    <div className="slider-labels">
                      <span>1Ω</span>
                      <span>20Ω</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="measurements">
                <div className="measurement-item">
                  <span className="measure-label">Dòng điện hiện tại:</span>
                  <span className="measure-value current">{current.toFixed(3)} A</span>
                </div>
                <div className="measurement-item">
                  <span className="measure-label">Công suất:</span>
                  <span className="measure-value power">{power.toFixed(2)} W</span>
                </div>
                <div className="measurement-item">
                  <span className="measure-label">Sai số:</span>
                  <span className={`measure-value error ${Math.abs(current - targetCurrent) <= tolerance ? 'success' : 'fail'}`}>
                    {Math.abs(current - targetCurrent).toFixed(3)} A
                  </span>
                </div>
              </div>

              <button 
                onClick={checkTarget}
                className={`check-button ${Math.abs(current - targetCurrent) <= tolerance ? 'ready' : ''}`}
              >
                <Zap size={20} />
                Kiểm Tra Kết Quả
              </button>

              {attempts > 0 && (
                <div className="attempts-display">
                  Số lần thử: {attempts}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="victory-screen">
          <div className="victory-content">
            <Trophy size={80} className="trophy-icon" />
            <h2>Hoàn Thành!</h2>
            <div className="final-stats">
              <div className="final-stat">
                <span className="final-label">Điểm Cuối:</span>
                <span className="final-value">{score}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Level Cao Nhất:</span>
                <span className="final-value">{level}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Mục Tiêu Đạt:</span>
                <span className="final-value">{targetsCompleted}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Số Lần Thử:</span>
                <span className="final-value">{attempts}</span>
              </div>
            </div>
            <div className="victory-buttons">
              <button onClick={() => {
                setLevel(1);
                setGameState('menu');
              }} className="menu-button">
                Menu
              </button>
              <button onClick={() => {
                setLevel(1);
                startGame();
              }} className="replay-button">
                <Zap size={20} />
                Chơi Lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OhmLawCircuitLab;
