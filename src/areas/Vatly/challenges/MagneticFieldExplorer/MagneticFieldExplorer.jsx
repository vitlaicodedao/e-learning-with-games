import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Magnet, Compass, Sparkles } from 'lucide-react';
import './MagneticFieldExplorer.css';

/**
 * Magnetic Field Explorer - Lớp 9 Chương 2: Điện từ học
 * 
 * Game khám phá từ trường của nam châm và dòng điện
 * Học sinh thí nghiệm với nam châm, kim nam châm, và dòng điện tạo từ trường
 * 
 * Physics:
 * - Từ trường của nam châm: Có 2 cực N-S, đường sức từ từ N → S
 * - Từ trường của dòng điện thẳng: Quy tắc nắm tay phải
 * - Từ trường của ống dây: B = μ₀×n×I (n: số vòng/m)
 * - Lực từ: F = B×I×L×sin(α)
 * 
 * 4 Levels:
 * 1. Cơ bản: Nam châm vĩnh cửu và từ phổ
 * 2. Trung bình: Từ trường của dòng điện thẳng
 * 3. Khó: Từ trường của ống dây điện
 * 4. Chuyên gia: Tương tác từ phức tạp
 */

const MagneticFieldExplorer = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Game states
  const [gameState, setGameState] = useState('menu');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  // Magnets and compasses
  const [magnets, setMagnets] = useState([]);
  const [compasses, setCompasses] = useState([]);
  const [currentWire, setCurrentWire] = useState(null);
  const [solenoid, setSolenoid] = useState(null);

  // Challenge data
  const [targetPattern, setTargetPattern] = useState(null);
  const [currentPattern, setCurrentPattern] = useState([]);
  const [tasksCompleted, setTasksCompleted] = useState(0);

  // Interaction
  const [draggingItem, setDraggingItem] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Level configurations
  const levelConfigs = {
    1: {
      name: 'Nam Châm Vĩnh Cửu',
      description: 'Khám phá từ phổ và đường sức từ',
      type: 'permanent-magnet',
      tasks: 3,
      timeLimit: 120
    },
    2: {
      name: 'Dòng Điện Thẳng',
      description: 'Từ trường xung quanh dây dẫn có dòng điện',
      type: 'straight-wire',
      tasks: 4,
      timeLimit: 150
    },
    3: {
      name: 'Ống Dây Điện',
      description: 'Tạo nam châm điện từ ống dây',
      type: 'solenoid',
      tasks: 5,
      timeLimit: 180
    },
    4: {
      name: 'Tương Tác Từ',
      description: 'Hệ thống từ trường phức tạp',
      type: 'complex',
      tasks: 6,
      timeLimit: 240
    }
  };

  // Initialize game
  const startGame = useCallback(() => {
    const config = levelConfigs[level];
    setGameState('playing');
    setScore(0);
    setTimeLeft(config.timeLimit);
    setMagnets([]);
    setCompasses([]);
    setCurrentWire(null);
    setSolenoid(null);
    setTasksCompleted(0);
    
    // Initialize compasses for field visualization
    initializeCompasses();
    
    // Set initial challenge
    if (config.type === 'permanent-magnet') {
      setMagnets([
        { id: 1, x: 400, y: 250, angle: 0, strength: 1 }
      ]);
    } else if (config.type === 'straight-wire') {
      setCurrentWire({ x: 400, y: 250, current: 2, direction: 'up' });
    } else if (config.type === 'solenoid') {
      setSolenoid({ x: 400, y: 250, turns: 10, current: 1, length: 100 });
    }
  }, [level]);

  // Initialize compass needles
  const initializeCompasses = () => {
    const newCompasses = [];
    const gridSize = 50;
    
    for (let y = 50; y < 450; y += gridSize) {
      for (let x = 50; x < 750; x += gridSize) {
        newCompasses.push({
          id: `${x}-${y}`,
          x,
          y,
          angle: 0
        });
      }
    }
    
    setCompasses(newCompasses);
  };

  // Calculate magnetic field at a point
  const calculateFieldAtPoint = useCallback((x, y) => {
    let Bx = 0;
    let By = 0;

    // Contribution from permanent magnets
    magnets.forEach(magnet => {
      const dx = x - magnet.x;
      const dy = y - magnet.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      
      if (r > 10) {
        const strength = magnet.strength * 1000 / (r * r);
        const angleRad = magnet.angle * Math.PI / 180;
        
        // North pole contribution (pointing right in magnet's frame)
        const northX = magnet.x + 30 * Math.cos(angleRad);
        const northY = magnet.y + 30 * Math.sin(angleRad);
        const dnx = x - northX;
        const dny = y - northY;
        const rn = Math.sqrt(dnx * dnx + dny * dny);
        
        if (rn > 5) {
          Bx += strength * dnx / (rn * rn * rn);
          By += strength * dny / (rn * rn * rn);
        }
        
        // South pole contribution (pointing left in magnet's frame)
        const southX = magnet.x - 30 * Math.cos(angleRad);
        const southY = magnet.y - 30 * Math.sin(angleRad);
        const dsx = x - southX;
        const dsy = y - southY;
        const rs = Math.sqrt(dsx * dsx + dsy * dsy);
        
        if (rs > 5) {
          Bx -= strength * dsx / (rs * rs * rs);
          By -= strength * dsy / (rs * rs * rs);
        }
      }
    });

    // Contribution from straight wire with current
    if (currentWire) {
      const dx = x - currentWire.x;
      const dy = y - currentWire.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      
      if (r > 5) {
        // Magnetic field circles around wire (right-hand rule)
        const B = (currentWire.current * 200) / r;
        const directionFactor = currentWire.direction === 'up' ? 1 : -1;
        Bx += -B * dy / r * directionFactor;
        By += B * dx / r * directionFactor;
      }
    }

    // Contribution from solenoid
    if (solenoid) {
      const dx = x - solenoid.x;
      const dy = y - solenoid.y;
      
      // Inside solenoid: uniform field
      if (Math.abs(dx) < solenoid.length / 2 && Math.abs(dy) < 20) {
        Bx += solenoid.turns * solenoid.current * 0.5;
      }
      
      // Outside: dipole-like field
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r > solenoid.length / 2) {
        const strength = solenoid.turns * solenoid.current * 100;
        Bx += strength * dx / (r * r * r);
        By += strength * dy / (r * r * r);
      }
    }

    return { Bx, By };
  }, [magnets, currentWire, solenoid]);

  // Update compass orientations based on magnetic field
  useEffect(() => {
    if (gameState !== 'playing') return;

    const updatedCompasses = compasses.map(compass => {
      const field = calculateFieldAtPoint(compass.x, compass.y);
      const angle = Math.atan2(field.By, field.Bx) * 180 / Math.PI;
      return { ...compass, angle };
    });

    setCompasses(updatedCompasses);
  }, [magnets, currentWire, solenoid, gameState]);

  // Check task completion
  const checkTask = () => {
    const config = levelConfigs[level];
    
    // Simple completion check - in real game would verify specific patterns
    const completed = Math.random() > 0.3; // Placeholder
    
    if (completed) {
      const earnedPoints = 200 + Math.floor(timeLeft / 10) * 10;
      setScore(prev => prev + earnedPoints);
      setTasksCompleted(prev => prev + 1);
      
      if (tasksCompleted + 1 >= config.tasks) {
        if (level < 4) {
          setTimeout(() => {
            setLevel(prev => prev + 1);
            startGame();
          }, 1500);
        } else {
          setTimeout(() => setGameState('victory'), 1500);
        }
      }
    }
  };

  // Add magnet
  const addMagnet = () => {
    const newMagnet = {
      id: Date.now(),
      x: 400,
      y: 250,
      angle: 0,
      strength: 1
    };
    setMagnets(prev => [...prev, newMagnet]);
  };

  // Rotate magnet
  const rotateMagnet = (id, delta) => {
    setMagnets(prev => prev.map(m => 
      m.id === id ? { ...m, angle: (m.angle + delta) % 360 } : m
    ));
  };

  // Adjust current
  const adjustCurrent = (delta) => {
    if (currentWire) {
      setCurrentWire(prev => ({
        ...prev,
        current: Math.max(0, Math.min(5, prev.current + delta))
      }));
    }
    if (solenoid) {
      setSolenoid(prev => ({
        ...prev,
        current: Math.max(0, Math.min(3, prev.current + delta))
      }));
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
    canvas.width = 800;
    canvas.height = 500;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw magnetic field lines
      drawFieldLines(ctx);
      
      // Draw compasses
      drawCompasses(ctx);
      
      // Draw magnets
      magnets.forEach(magnet => drawMagnet(ctx, magnet));
      
      // Draw current wire
      if (currentWire) drawCurrentWire(ctx, currentWire);
      
      // Draw solenoid
      if (solenoid) drawSolenoid(ctx, solenoid);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, magnets, compasses, currentWire, solenoid]);

  // Draw magnetic field lines
  const drawFieldLines = (ctx) => {
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.lineWidth = 1;
    
    // Simplified field lines - would trace actual field in full implementation
    for (let i = 0; i < 10; i++) {
      const startY = 50 + i * 40;
      ctx.beginPath();
      
      for (let x = 50; x < 750; x += 5) {
        const field = calculateFieldAtPoint(x, startY);
        const y = startY + Math.sin(x * 0.02) * 30;
        
        if (x === 50) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    }
  };

  // Draw compass needles
  const drawCompasses = (ctx) => {
    compasses.forEach(compass => {
      ctx.save();
      ctx.translate(compass.x, compass.y);
      ctx.rotate(compass.angle * Math.PI / 180);
      
      // North end (red)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(12, 0);
      ctx.stroke();
      
      // South end (blue)
      ctx.strokeStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-12, 0);
      ctx.stroke();
      
      ctx.restore();
    });
  };

  // Draw permanent magnet
  const drawMagnet = (ctx, magnet) => {
    ctx.save();
    ctx.translate(magnet.x, magnet.y);
    ctx.rotate(magnet.angle * Math.PI / 180);
    
    // Magnet body
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(-40, -15, 80, 30);
    
    // North pole (red)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(10, -15, 30, 30);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('N', 20, 5);
    
    // South pole (blue)
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(-40, -15, 30, 30);
    ctx.fillStyle = '#fff';
    ctx.fillText('S', -35, 5);
    
    ctx.restore();
  };

  // Draw current-carrying wire
  const drawCurrentWire = (ctx, wire) => {
    // Wire
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(wire.x, 50);
    ctx.lineTo(wire.x, 450);
    ctx.stroke();
    
    // Current direction indicator
    const arrowY = wire.direction === 'up' ? 100 : 400;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    if (wire.direction === 'up') {
      ctx.moveTo(wire.x, arrowY);
      ctx.lineTo(wire.x - 10, arrowY + 15);
      ctx.lineTo(wire.x + 10, arrowY + 15);
    } else {
      ctx.moveTo(wire.x, arrowY);
      ctx.lineTo(wire.x - 10, arrowY - 15);
      ctx.lineTo(wire.x + 10, arrowY - 15);
    }
    ctx.fill();
    
    // Current value
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`I = ${wire.current.toFixed(1)}A`, wire.x + 20, 80);
  };

  // Draw solenoid
  const drawSolenoid = (ctx, sol) => {
    const coils = 8;
    const coilWidth = sol.length / coils;
    
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    
    // Draw coils
    for (let i = 0; i < coils; i++) {
      const x = sol.x - sol.length / 2 + i * coilWidth;
      
      ctx.beginPath();
      ctx.arc(x + coilWidth / 2, sol.y - 20, 10, 0, Math.PI, false);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(x + coilWidth / 2, sol.y + 20, 10, Math.PI, 0, false);
      ctx.stroke();
    }
    
    // Poles
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(sol.x + sol.length / 2, sol.y - 15, 20, 30);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('N', sol.x + sol.length / 2 + 5, sol.y + 5);
    
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(sol.x - sol.length / 2 - 20, sol.y - 15, 20, 30);
    ctx.fillStyle = '#fff';
    ctx.fillText('S', sol.x - sol.length / 2 - 15, sol.y + 5);
    
    // Info
    ctx.fillStyle = '#f97316';
    ctx.font = '16px Arial';
    ctx.fillText(`n=${sol.turns} vòng/m`, sol.x - 40, sol.y - 40);
    ctx.fillText(`I=${sol.current.toFixed(1)}A`, sol.x - 30, sol.y - 55);
  };

  const config = levelConfigs[level];

  return (
    <div className="magnetic-field-explorer">
      <div className="game-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <h1 className="game-title">
          <Magnet className="title-icon" />
          Magnetic Field Explorer
        </h1>
      </div>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="menu-content">
            <Magnet size={80} className="menu-icon" />
            <h2>Khám Phá Từ Trường</h2>
            <p className="menu-description">
              Thí nghiệm với nam châm và dòng điện
            </p>
            
            <div className="theory-box">
              <h3>Kiến Thức Từ Trường</h3>
              <div className="theory-content">
                <div className="theory-item">
                  <Compass className="theory-icon" />
                  <div>
                    <h4>Nam Châm Vĩnh Cửu</h4>
                    <p>Có 2 cực N-S, đường sức từ từ N → S</p>
                  </div>
                </div>
                <div className="theory-item">
                  <Sparkles className="theory-icon" />
                  <div>
                    <h4>Từ Trường Dòng Điện</h4>
                    <p>Quy tắc nắm tay phải: 4 ngón theo I, ngón cái theo B</p>
                  </div>
                </div>
                <div className="theory-item">
                  <Magnet className="theory-icon" />
                  <div>
                    <h4>Ống Dây Điện</h4>
                    <p>B = μ₀ × n × I (n: số vòng dây/m)</p>
                  </div>
                </div>
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
              <Magnet size={20} />
              Bắt Đầu Khám Phá
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
              <span className="stat-label">Nhiệm vụ</span>
              <span className="stat-value">{tasksCompleted}/{config.tasks}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Thời gian</span>
              <span className="stat-value">{timeLeft}s</span>
            </div>
          </div>

          <div className="game-content">
            <div className="field-view">
              <canvas ref={canvasRef} className="field-canvas" />
            </div>

            <div className="control-panel">
              <div className="info-panel">
                <h3>Hướng Dẫn</h3>
                <p>{config.description}</p>
                <p className="task-progress">
                  Hoàn thành: {tasksCompleted}/{config.tasks} nhiệm vụ
                </p>
              </div>

              {config.type === 'permanent-magnet' && (
                <div className="controls-section">
                  <h3>Điều Khiển Nam Châm</h3>
                  <button onClick={addMagnet} className="control-btn">
                    <Magnet size={16} />
                    Thêm Nam Châm
                  </button>
                  {magnets.length > 0 && (
                    <>
                      <button onClick={() => rotateMagnet(magnets[0].id, 15)} className="control-btn">
                        Xoay Phải 15°
                      </button>
                      <button onClick={() => rotateMagnet(magnets[0].id, -15)} className="control-btn">
                        Xoay Trái 15°
                      </button>
                    </>
                  )}
                </div>
              )}

              {(config.type === 'straight-wire' || config.type === 'solenoid') && (
                <div className="controls-section">
                  <h3>Điều Chỉnh Dòng Điện</h3>
                  <div className="current-controls">
                    <button onClick={() => adjustCurrent(-0.5)} className="control-btn">
                      - Giảm I
                    </button>
                    <span className="current-display">
                      {currentWire ? currentWire.current.toFixed(1) : solenoid?.current.toFixed(1)} A
                    </span>
                    <button onClick={() => adjustCurrent(0.5)} className="control-btn">
                      + Tăng I
                    </button>
                  </div>
                </div>
              )}

              <button onClick={checkTask} className="check-btn">
                <Sparkles size={20} />
                Kiểm Tra Nhiệm Vụ
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
                <span className="final-label">Nhiệm Vụ:</span>
                <span className="final-value">{tasksCompleted}</span>
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
                <Magnet size={20} />
                Chơi Lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagneticFieldExplorer;
