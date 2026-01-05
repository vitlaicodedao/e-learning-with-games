import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Sparkles, Zap, Move, RotateCw } from 'lucide-react';
import './ElectromagneticInductionLab.css';

/**
 * Electromagnetic Induction Lab - Lớp 9 Chương 2: Điện từ học
 * 
 * Game thí nghiệm cảm ứng điện từ
 * Tạo dòng điện cảm ứng bằng cách thay đổi từ thông
 * 
 * Physics:
 * - Định luật cảm ứng điện từ Faraday: ε = -dΦ/dt
 * - Từ thông: Φ = B × S × cos(α)
 * - Định luật Lenxơ: Dòng điện cảm ứng sinh ra từ trường chống lại sự biến thiên từ thông
 * - Điều kiện: Từ thông qua mạch kín phải biến thiên
 * 
 * 4 Levels:
 * 1. Cơ bản: Di chuyển nam châm qua cuộn dây
 * 2. Trung bình: Thay đổi góc nghiêng cuộn dây
 * 3. Khó: Tăng/giảm số vòng dây
 * 4. Chuyên gia: Máy phát điện cơ bản
 */

const ElectromagneticInductionLab = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Game states
  const [gameState, setGameState] = useState('menu');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  // Experiment setup
  const [magnet, setMagnet] = useState({ x: 200, y: 250, velocity: 0, moving: false });
  const [coil, setCoil] = useState({ x: 600, y: 250, turns: 100, radius: 40, angle: 0 });
  const [magneticFlux, setMagneticFlux] = useState(0);
  const [inducedEMF, setInducedEMF] = useState(0);
  const [inducedCurrent, setInducedCurrent] = useState(0);
  
  // Challenge tracking
  const [targetEMF, setTargetEMF] = useState(2);
  const [successfulInductions, setSuccessfulInductions] = useState(0);

  // Level configurations
  const levelConfigs = {
    1: {
      name: 'Di Chuyển Nam Châm',
      description: 'Tạo dòng điện cảm ứng bằng cách di chuyển nam châm',
      method: 'move-magnet',
      targets: 3,
      timeLimit: 120
    },
    2: {
      name: 'Xoay Cuộn Dây',
      description: 'Thay đổi góc giữa B và S để tạo EMF',
      method: 'rotate-coil',
      targets: 4,
      timeLimit: 150
    },
    3: {
      name: 'Thay Đổi Số Vòng',
      description: 'Điều chỉnh số vòng dây để tối ưu EMF',
      method: 'adjust-turns',
      targets: 5,
      timeLimit: 180
    },
    4: {
      name: 'Máy Phát Điện',
      description: 'Quay liên tục để phát điện xoay chiều',
      method: 'generator',
      targets: 6,
      timeLimit: 240
    }
  };

  // Initialize game
  const startGame = useCallback(() => {
    const config = levelConfigs[level];
    setGameState('playing');
    setScore(0);
    setTimeLeft(config.timeLimit);
    setMagnet({ x: 200, y: 250, velocity: 0, moving: false });
    setCoil({ x: 600, y: 250, turns: 100, radius: 40, angle: 0 });
    setMagneticFlux(0);
    setInducedEMF(0);
    setInducedCurrent(0);
    setSuccessfulInductions(0);
    setTargetEMF(1.5 + level * 0.5);
  }, [level]);

  // Calculate magnetic flux
  const calculateFlux = useCallback(() => {
    const distance = Math.abs(magnet.x - coil.x);
    
    // Magnetic field strength decreases with distance
    const B = 100 / (distance + 50); // Tesla (simplified)
    
    // Area of coil
    const S = Math.PI * coil.radius * coil.radius / 10000; // m²
    
    // Angle factor
    const angleRad = coil.angle * Math.PI / 180;
    const cosAngle = Math.cos(angleRad);
    
    // Magnetic flux: Φ = B × S × cos(α) × N
    const flux = B * S * cosAngle * coil.turns / 100;
    
    return flux;
  }, [magnet.x, coil.x, coil.radius, coil.angle, coil.turns]);

  // Update physics
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      // Update magnet position if moving
      if (magnet.moving) {
        setMagnet(prev => ({
          ...prev,
          x: prev.x + prev.velocity
        }));
      }

      // Calculate new flux
      const newFlux = calculateFlux();
      
      // Calculate induced EMF: ε = -dΦ/dt
      const deltaFlux = newFlux - magneticFlux;
      const deltaTime = 0.1; // seconds
      const emf = Math.abs(deltaFlux / deltaTime);
      
      setMagneticFlux(newFlux);
      setInducedEMF(emf);
      
      // Calculate induced current (assuming coil resistance = 10Ω)
      const resistance = 10;
      const current = emf / resistance;
      setInducedCurrent(current);

      // Check if target achieved
      if (emf >= targetEMF && emf < targetEMF + 1) {
        // Success trigger could be added here
      }

    }, 100);

    return () => clearInterval(interval);
  }, [gameState, magnet, magneticFlux, calculateFlux, targetEMF]);

  // Move magnet
  const moveMagnet = (direction) => {
    const velocity = direction === 'right' ? 5 : -5;
    setMagnet(prev => ({
      ...prev,
      velocity,
      moving: true
    }));

    setTimeout(() => {
      setMagnet(prev => ({ ...prev, moving: false, velocity: 0 }));
    }, 500);
  };

  // Rotate coil
  const rotateCoil = (delta) => {
    setCoil(prev => ({
      ...prev,
      angle: (prev.angle + delta) % 360
    }));
  };

  // Adjust turns
  const adjustTurns = (delta) => {
    setCoil(prev => ({
      ...prev,
      turns: Math.max(10, Math.min(200, prev.turns + delta))
    }));
  };

  // Check induction success
  const checkInduction = () => {
    if (inducedEMF >= targetEMF && inducedEMF < targetEMF + 1) {
      const earnedPoints = 200 + Math.floor(timeLeft / 10) * 10;
      setScore(prev => prev + earnedPoints);
      setSuccessfulInductions(prev => prev + 1);
      
      const config = levelConfigs[level];
      if (successfulInductions + 1 >= config.targets) {
        if (level < 4) {
          setTimeout(() => {
            setLevel(prev => prev + 1);
            startGame();
          }, 1500);
        } else {
          setTimeout(() => setGameState('victory'), 1500);
        }
      } else {
        // Generate new target
        setTargetEMF(1.5 + Math.random() * level);
      }
      
      return true;
    }
    return false;
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
    canvas.width = 800;
    canvas.height = 500;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw magnet
      drawMagnet(ctx);
      
      // Draw magnetic field lines
      drawFieldLines(ctx);
      
      // Draw coil
      drawCoil(ctx);
      
      // Draw induced current
      if (inducedCurrent > 0.01) {
        drawInducedCurrent(ctx);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, magnet, coil, inducedCurrent]);

  // Draw magnet
  const drawMagnet = (ctx) => {
    ctx.save();
    ctx.translate(magnet.x, magnet.y);
    
    // Magnet body
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(-30, -15, 60, 30);
    
    // North pole
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(10, -15, 20, 30);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('N', 15, 5);
    
    // South pole
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(-30, -15, 20, 30);
    ctx.fillStyle = '#fff';
    ctx.fillText('S', -26, 5);
    
    ctx.restore();
  };

  // Draw field lines
  const drawFieldLines = (ctx) => {
    const fieldLineCount = 8;
    
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < fieldLineCount; i++) {
      const offsetY = -60 + (i * 15);
      
      ctx.beginPath();
      ctx.moveTo(magnet.x + 30, magnet.y + offsetY);
      
      // Curved line to south pole
      const controlX = magnet.x + 60;
      const controlY = magnet.y;
      ctx.quadraticCurveTo(
        controlX, 
        magnet.y + offsetY,
        magnet.x - 30,
        magnet.y - offsetY
      );
      
      ctx.stroke();
    }
  };

  // Draw coil
  const drawCoil = (ctx) => {
    ctx.save();
    ctx.translate(coil.x, coil.y);
    ctx.rotate(coil.angle * Math.PI / 180);
    
    // Coil turns
    const turnCount = Math.min(coil.turns / 10, 10);
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    
    for (let i = 0; i < turnCount; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, coil.radius - i * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Connection wires
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-coil.radius - 10, 0);
    ctx.lineTo(-coil.radius - 40, 0);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(coil.radius + 10, 0);
    ctx.lineTo(coil.radius + 40, 0);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#f97316';
    ctx.font = '14px Arial';
    ctx.fillText(`${coil.turns} vòng`, -30, -coil.radius - 10);
    
    ctx.restore();
  };

  // Draw induced current
  const drawInducedCurrent = (ctx) => {
    const particles = Math.floor(inducedCurrent * 50);
    const time = Date.now() / 200;
    
    for (let i = 0; i < particles; i++) {
      const progress = (time + i * 0.5) % 1;
      const x = coil.x + (progress - 0.5) * 100;
      const y = coil.y - coil.radius - 20;
      
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const config = levelConfigs[level];

  return (
    <div className="electromagnetic-induction-lab">
      <div className="game-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <h1 className="game-title">
          <Sparkles className="title-icon" />
          Electromagnetic Induction Lab
        </h1>
      </div>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="menu-content">
            <Sparkles size={80} className="menu-icon" />
            <h2>Phòng Thí Nghiệm Cảm Ứng Điện Từ</h2>
            <p className="menu-description">
              Tạo dòng điện từ sự biến thiên từ thông
            </p>
            
            <div className="theory-box">
              <h3>Định Luật Cảm Ứng Điện Từ</h3>
              <div className="formula-section">
                <div className="formula-item">
                  <p className="formula">ε = -dΦ/dt</p>
                  <p className="formula-desc">Suất điện động cảm ứng (V)</p>
                </div>
                <div className="formula-item">
                  <p className="formula">Φ = B × S × cos(α)</p>
                  <p className="formula-desc">Từ thông (Wb)</p>
                </div>
                <div className="formula-item">
                  <p className="formula">I = ε / R</p>
                  <p className="formula-desc">Dòng điện cảm ứng (A)</p>
                </div>
              </div>
              <div className="theory-note">
                <strong>Định luật Lenxơ:</strong> Dòng điện cảm ứng có chiều sao cho từ trường 
                do nó sinh ra chống lại sự biến thiên từ thông ban đầu.
              </div>
            </div>

            <div className="level-selector">
              <h3>Chọn Cấp Độ</h3>
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
              <Sparkles size={20} />
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
              <span className="stat-value">{level}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Điểm</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Thành công</span>
              <span className="stat-value">{successfulInductions}/{config.targets}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Thời gian</span>
              <span className="stat-value">{timeLeft}s</span>
            </div>
          </div>

          <div className="game-content">
            <div className="experiment-area">
              <canvas ref={canvasRef} className="experiment-canvas" />
            </div>

            <div className="control-panel">
              <div className="measurements">
                <h3>Đo Lường</h3>
                <div className="measure-item">
                  <span className="measure-label">Từ thông Φ:</span>
                  <span className="measure-value">{magneticFlux.toFixed(3)} Wb</span>
                </div>
                <div className="measure-item">
                  <span className="measure-label">EMF ε:</span>
                  <span className={`measure-value ${inducedEMF >= targetEMF && inducedEMF < targetEMF + 1 ? 'target-met' : ''}`}>
                    {inducedEMF.toFixed(2)} V
                  </span>
                </div>
                <div className="measure-item">
                  <span className="measure-label">Dòng điện I:</span>
                  <span className="measure-value">{inducedCurrent.toFixed(3)} A</span>
                </div>
                <div className="measure-target">
                  <strong>Mục tiêu EMF:</strong> {targetEMF.toFixed(1)} - {(targetEMF + 1).toFixed(1)} V
                </div>
              </div>

              <div className="controls">
                <h3>Điều Khiển</h3>
                
                {config.method === 'move-magnet' && (
                  <div className="control-section">
                    <p className="control-label">Di chuyển nam châm:</p>
                    <div className="button-group">
                      <button onClick={() => moveMagnet('left')} className="control-btn">
                        <Move size={16} />
                        ← Trái
                      </button>
                      <button onClick={() => moveMagnet('right')} className="control-btn">
                        Phải →
                        <Move size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {(config.method === 'rotate-coil' || config.method === 'generator') && (
                  <div className="control-section">
                    <p className="control-label">Xoay cuộn dây: {coil.angle}°</p>
                    <div className="button-group">
                      <button onClick={() => rotateCoil(-15)} className="control-btn">
                        <RotateCw size={16} style={{ transform: 'scaleX(-1)' }} />
                        -15°
                      </button>
                      <button onClick={() => rotateCoil(15)} className="control-btn">
                        +15°
                        <RotateCw size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {config.method === 'adjust-turns' && (
                  <div className="control-section">
                    <p className="control-label">Số vòng dây: {coil.turns}</p>
                    <div className="button-group">
                      <button onClick={() => adjustTurns(-10)} className="control-btn">
                        - 10 vòng
                      </button>
                      <button onClick={() => adjustTurns(10)} className="control-btn">
                        + 10 vòng
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={checkInduction} className="check-btn">
                <Zap size={20} />
                Kiểm Tra EMF
              </button>
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
                <span className="final-label">Level Đạt:</span>
                <span className="final-value">{level}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Cảm ứng thành công:</span>
                <span className="final-value">{successfulInductions}</span>
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
                <Sparkles size={20} />
                Chơi Lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectromagneticInductionLab;
