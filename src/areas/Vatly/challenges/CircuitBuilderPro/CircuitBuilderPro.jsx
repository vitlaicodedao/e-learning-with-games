import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, CircuitBoard, Lightbulb, Plus, Trash2 } from 'lucide-react';
import './CircuitBuilderPro.css';

/**
 * Circuit Builder Pro - Lớp 9 Chương 1: Điện học
 * 
 * Game xây dựng mạch điện nối tiếp và song song
 * Học sinh kéo thả các linh kiện để tạo mạch điện đạt yêu cầu
 * 
 * Physics:
 * - Mạch nối tiếp: I = const, U_total = U1 + U2 + ..., R_total = R1 + R2 + ...
 * - Mạch song song: U = const, I_total = I1 + I2 + ..., 1/R_total = 1/R1 + 1/R2 + ...
 * - Công suất đèn: P = U×I
 * 
 * 4 Levels:
 * 1. Cơ bản: Mạch nối tiếp đơn giản
 * 2. Trung bình: Mạch song song cơ bản
 * 3. Khó: Mạch hỗn hợp
 * 4. Chuyên gia: Mạch phức tạp với nhiều yêu cầu
 */

const CircuitBuilderPro = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Game states
  const [gameState, setGameState] = useState('menu');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  // Circuit components
  const [components, setComponents] = useState([]);
  const [draggingComponent, setDraggingComponent] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Circuit measurements
  const [totalVoltage] = useState(12); // Pin 12V
  const [totalCurrent, setTotalCurrent] = useState(0);
  const [totalResistance, setTotalResistance] = useState(0);
  const [totalPower, setTotalPower] = useState(0);

  // Target requirements
  const [requirements, setRequirements] = useState({});
  const [bulbsOn, setBulbsOn] = useState(0);

  // Available components
  const availableComponents = [
    { type: 'resistor', value: 2, label: '2Ω', icon: '🔲', color: '#8b5cf6' },
    { type: 'resistor', value: 4, label: '4Ω', icon: '🔲', color: '#a78bfa' },
    { type: 'resistor', value: 6, label: '6Ω', icon: '🔲', color: '#c4b5fd' },
    { type: 'bulb', value: 3, label: '3Ω Đèn', icon: '💡', color: '#fbbf24' },
    { type: 'bulb', value: 6, label: '6Ω Đèn', icon: '💡', color: '#f59e0b' },
    { type: 'wire', value: 0, label: 'Dây dẫn', icon: '━', color: '#10b981' }
  ];

  // Level configurations
  const levelConfigs = {
    1: {
      name: 'Mạch Nối Tiếp',
      description: 'Xây dựng mạch nối tiếp đơn giản',
      requirement: {
        type: 'series',
        minBulbs: 2,
        targetCurrent: [0.8, 1.2],
        targetPower: [8, 12]
      },
      timeLimit: 120
    },
    2: {
      name: 'Mạch Song Song',
      description: 'Xây dựng mạch song song cơ bản',
      requirement: {
        type: 'parallel',
        minBulbs: 2,
        targetCurrent: [4, 6],
        targetPower: [40, 60]
      },
      timeLimit: 150
    },
    3: {
      name: 'Mạch Hỗn Hợp',
      description: 'Kết hợp nối tiếp và song song',
      requirement: {
        type: 'mixed',
        minBulbs: 3,
        targetCurrent: [2, 3],
        targetPower: [24, 36]
      },
      timeLimit: 180
    },
    4: {
      name: 'Mạch Phức Tạp',
      description: 'Thiết kế mạch tối ưu năng lượng',
      requirement: {
        type: 'complex',
        minBulbs: 4,
        targetCurrent: [3, 4],
        targetPower: [36, 48],
        efficiency: 0.8
      },
      timeLimit: 240
    }
  };

  // Initialize game
  const startGame = useCallback(() => {
    const config = levelConfigs[level];
    setGameState('playing');
    setScore(0);
    setTimeLeft(config.timeLimit);
    setComponents([]);
    setSelectedComponent(null);
    setRequirements(config.requirement);
    setBulbsOn(0);
  }, [level]);

  // Calculate circuit properties
  useEffect(() => {
    if (components.length === 0) {
      setTotalResistance(0);
      setTotalCurrent(0);
      setTotalPower(0);
      setBulbsOn(0);
      return;
    }

    // Simplified calculation - assume all in series for now
    // In real implementation, would need topology analysis
    const resistances = components.map(c => c.value);
    const totalR = resistances.reduce((sum, r) => sum + r, 0);
    
    if (totalR > 0) {
      const current = totalVoltage / totalR;
      const power = totalVoltage * current;
      
      setTotalResistance(totalR);
      setTotalCurrent(current);
      setTotalPower(power);
      
      // Count lit bulbs
      const bulbCount = components.filter(c => c.type === 'bulb').length;
      setBulbsOn(bulbCount);
    }
  }, [components, totalVoltage]);

  // Add component to circuit
  const addComponent = (componentType) => {
    const newComponent = {
      id: Date.now(),
      ...componentType,
      x: 300 + Math.random() * 100,
      y: 200 + Math.random() * 100
    };
    
    setComponents(prev => [...prev, newComponent]);
  };

  // Remove component
  const removeComponent = (id) => {
    setComponents(prev => prev.filter(c => c.id !== id));
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  };

  // Check if circuit meets requirements
  const checkCircuit = () => {
    const req = requirements;
    const bulbCount = components.filter(c => c.type === 'bulb').length;
    
    let passed = true;
    let feedback = [];
    
    // Check minimum bulbs
    if (bulbCount < req.minBulbs) {
      passed = false;
      feedback.push(`Cần tối thiểu ${req.minBulbs} bóng đèn`);
    }
    
    // Check current range
    if (totalCurrent < req.targetCurrent[0] || totalCurrent > req.targetCurrent[1]) {
      passed = false;
      feedback.push(`Dòng điện phải trong khoảng ${req.targetCurrent[0]}-${req.targetCurrent[1]}A`);
    }
    
    // Check power range
    if (totalPower < req.targetPower[0] || totalPower > req.targetPower[1]) {
      passed = false;
      feedback.push(`Công suất phải trong khoảng ${req.targetPower[0]}-${req.targetPower[1]}W`);
    }
    
    if (passed) {
      // Success!
      const timeBonus = Math.floor(timeLeft / 10) * 50;
      const componentBonus = Math.max(0, (10 - components.length)) * 20;
      const earnedPoints = 500 + timeBonus + componentBonus;
      
      setScore(prev => prev + earnedPoints);
      
      if (level < 4) {
        setTimeout(() => {
          setLevel(prev => prev + 1);
          startGame();
        }, 2000);
      } else {
        setTimeout(() => setGameState('victory'), 2000);
      }
      
      return { success: true, feedback: ['Hoàn hảo! Mạch điện đạt yêu cầu!'] };
    }
    
    return { success: false, feedback };
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
      
      // Draw grid
      drawGrid(ctx);
      
      // Draw battery
      drawBattery(ctx, 50, 250);
      
      // Draw components
      components.forEach(comp => {
        drawComponent(ctx, comp);
      });
      
      // Draw current flow animation
      if (totalCurrent > 0) {
        drawCurrentFlow(ctx);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, components, totalCurrent]);

  // Draw grid background
  const drawGrid = (ctx) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < 800; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 500);
      ctx.stroke();
    }
    
    for (let y = 0; y < 500; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }
  };

  // Draw battery
  const drawBattery = (ctx, x, y) => {
    // Positive terminal
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x, y - 20, 20, 40);
    
    // Negative terminal
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x + 20, y - 10, 20, 20);
    
    // Label
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('12V', x, y + 50);
  };

  // Draw component
  const drawComponent = (ctx, comp) => {
    const isSelected = selectedComponent?.id === comp.id;
    
    ctx.save();
    ctx.translate(comp.x, comp.y);
    
    // Highlight if selected
    if (isSelected) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.strokeRect(-25, -25, 50, 50);
    }
    
    // Draw based on type
    if (comp.type === 'resistor') {
      drawResistor(ctx, comp);
    } else if (comp.type === 'bulb') {
      drawBulb(ctx, comp);
    } else if (comp.type === 'wire') {
      drawWire(ctx, comp);
    }
    
    ctx.restore();
  };

  // Draw resistor
  const drawResistor = (ctx, comp) => {
    ctx.strokeStyle = comp.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    // Zigzag pattern
    ctx.moveTo(-20, 0);
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(-20 + i * 8, (i % 2 === 0) ? -10 : 10);
    }
    ctx.lineTo(20, 0);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = comp.color;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(comp.label, 0, 25);
  };

  // Draw bulb
  const drawBulb = (ctx, comp) => {
    const isOn = totalCurrent > 0;
    
    // Bulb circle
    if (isOn) {
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
      gradient.addColorStop(0, '#fef08a');
      gradient.addColorStop(0.5, '#fbbf24');
      gradient.addColorStop(1, comp.color);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = '#6b7280';
    }
    
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Filament
    ctx.strokeStyle = isOn ? '#fef08a' : '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, -8);
    ctx.lineTo(8, 8);
    ctx.moveTo(-8, 8);
    ctx.lineTo(8, -8);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = comp.color;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(comp.label, 0, 30);
  };

  // Draw wire
  const drawWire = (ctx, comp) => {
    ctx.strokeStyle = comp.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();
  };

  // Draw current flow
  const drawCurrentFlow = (ctx) => {
    const time = Date.now() / 200;
    const particleCount = Math.floor(totalCurrent * 10);
    
    for (let i = 0; i < particleCount; i++) {
      const offset = (time + i * 50) % 400;
      const x = 100 + offset;
      const y = 250;
      
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const config = levelConfigs[level];
  const req = requirements;

  return (
    <div className="circuit-builder-pro">
      <div className="game-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <h1 className="game-title">
          <CircuitBoard className="title-icon" />
          Circuit Builder Pro
        </h1>
      </div>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="menu-content">
            <CircuitBoard size={80} className="menu-icon" />
            <h2>Thiết Kế Mạch Điện Chuyên Nghiệp</h2>
            <p className="menu-description">
              Xây dựng mạch điện nối tiếp và song song
            </p>
            
            <div className="theory-box">
              <h3>Kiến Thức</h3>
              <div className="theory-grid">
                <div className="theory-item">
                  <h4>Mạch Nối Tiếp</h4>
                  <p>I = const</p>
                  <p>U = U₁ + U₂ + ...</p>
                  <p>R = R₁ + R₂ + ...</p>
                </div>
                <div className="theory-item">
                  <h4>Mạch Song Song</h4>
                  <p>U = const</p>
                  <p>I = I₁ + I₂ + ...</p>
                  <p>1/R = 1/R₁ + 1/R₂ + ...</p>
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
              <CircuitBoard size={20} />
              Bắt Đầu Thiết Kế
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
              <span className="stat-label">Thời gian</span>
              <span className="stat-value">{timeLeft}s</span>
            </div>
          </div>

          <div className="game-content">
            <div className="circuit-workspace">
              <canvas ref={canvasRef} className="circuit-canvas" />
              
              <div className="measurements-overlay">
                <div className="measure">
                  <span className="measure-label">Dòng điện:</span>
                  <span className="measure-value">{totalCurrent.toFixed(2)} A</span>
                </div>
                <div className="measure">
                  <span className="measure-label">Điện trở:</span>
                  <span className="measure-value">{totalResistance.toFixed(1)} Ω</span>
                </div>
                <div className="measure">
                  <span className="measure-label">Công suất:</span>
                  <span className="measure-value">{totalPower.toFixed(1)} W</span>
                </div>
                <div className="measure">
                  <span className="measure-label">Đèn sáng:</span>
                  <span className="measure-value">{bulbsOn}</span>
                </div>
              </div>
            </div>

            <div className="control-sidebar">
              <div className="requirements-panel">
                <h3>Yêu Cầu</h3>
                <ul>
                  <li>Số đèn tối thiểu: <strong>{req.minBulbs}</strong></li>
                  <li>Dòng điện: <strong>{req.targetCurrent?.[0]}-{req.targetCurrent?.[1]} A</strong></li>
                  <li>Công suất: <strong>{req.targetPower?.[0]}-{req.targetPower?.[1]} W</strong></li>
                  {req.efficiency && (
                    <li>Hiệu suất: <strong>&gt; {(req.efficiency * 100).toFixed(0)}%</strong></li>
                  )}
                </ul>
              </div>

              <div className="components-panel">
                <h3>Linh Kiện</h3>
                <div className="component-list">
                  {availableComponents.map((comp, index) => (
                    <button
                      key={index}
                      className="component-btn"
                      onClick={() => addComponent(comp)}
                      style={{ borderColor: comp.color }}
                    >
                      <span className="component-icon">{comp.icon}</span>
                      <span className="component-label">{comp.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="added-components">
                <h3>Đã Thêm ({components.length})</h3>
                <div className="component-chips">
                  {components.map(comp => (
                    <div key={comp.id} className="chip">
                      <span>{comp.icon} {comp.label}</span>
                      <button onClick={() => removeComponent(comp.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={checkCircuit} className="check-circuit-btn">
                <Lightbulb size={20} />
                Kiểm Tra Mạch Điện
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
                <span className="final-label">Level Cao Nhất:</span>
                <span className="final-value">{level}</span>
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
                <CircuitBoard size={20} />
                Chơi Lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CircuitBuilderPro;
