import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Home, Play, RotateCw, Trophy, ArrowDown, Zap } from 'lucide-react';
import './FreeFallLab.css';

/**
 * Free Fall Lab - Grade 10 Chapter 1: Kinematics
 * Game thí nghiệm rơi tự do và ném theo phương thẳng đứng
 * Physics: h = h0 - 0.5*g*t², v = v0 - g*t, g = 9.8 m/s²
 */

const FreeFallLab = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Game stats
  const [score, setScore] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);

  // Physics constants
  const g = 9.8; // m/s²

  // Motion parameters
  const [motionType, setMotionType] = useState('free-fall'); // free-fall, throw-up, throw-down
  const [h0, setH0] = useState(50); // Initial height (m)
  const [v0, setV0] = useState(0); // Initial velocity (m/s)
  const [targetTime, setTargetTime] = useState(0); // Target time to hit ground (s)
  const [targetHeight, setTargetHeight] = useState(0); // Target max height for throw-up (m)

  // Simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(h0);
  const [currentVelocity, setCurrentVelocity] = useState(0);
  const [maxHeight, setMaxHeight] = useState(h0);

  // Animation data
  const [trajectoryData, setTrajectoryData] = useState([]);

  // Level configurations
  const levels = [
    {
      id: 1,
      name: 'Cơ bản - Rơi tự do',
      description: 'Thả vật từ độ cao, tính thời gian chạm đất',
      duration: 180,
      challengesNeeded: 3,
      motionTypes: ['free-fall'],
      heightRange: [20, 80],
      velocityRange: [0, 0]
    },
    {
      id: 2,
      name: 'Trung bình - Ném lên cao',
      description: 'Ném vật lên, tính độ cao cực đại',
      duration: 240,
      challengesNeeded: 4,
      motionTypes: ['throw-up'],
      heightRange: [0, 10],
      velocityRange: [10, 30]
    },
    {
      id: 3,
      name: 'Nâng cao - Ném xuống',
      description: 'Ném vật xuống, tính vận tốc chạm đất',
      duration: 300,
      challengesNeeded: 5,
      motionTypes: ['throw-down'],
      heightRange: [30, 80],
      velocityRange: [5, 20]
    },
    {
      id: 4,
      name: 'Chuyên gia - Tổng hợp',
      description: 'Kết hợp tất cả các loại chuyển động',
      duration: 360,
      challengesNeeded: 6,
      motionTypes: ['free-fall', 'throw-up', 'throw-down'],
      heightRange: [10, 80],
      velocityRange: [0, 30]
    }
  ];

  const currentLevel = levels[selectedLevel - 1];

  // Physics calculations
  const calculateHeight = (t) => {
    // h = h0 + v0*t - 0.5*g*t²
    return h0 + v0 * t - 0.5 * g * t * t;
  };

  const calculateVelocity = (t) => {
    // v = v0 - g*t (positive up, negative down)
    return v0 - g * t;
  };

  const calculateTimeToGround = () => {
    // Solve: 0 = h0 + v0*t - 0.5*g*t²
    // -0.5*g*t² + v0*t + h0 = 0
    // t = (-v0 ± √(v0² + 2*g*h0)) / (-g)
    const discriminant = v0 * v0 + 2 * g * h0;
    if (discriminant < 0) return 0;
    
    const t1 = (-v0 + Math.sqrt(discriminant)) / g;
    const t2 = (-v0 - Math.sqrt(discriminant)) / g;
    
    return Math.max(t1, t2);
  };

  const calculateMaxHeight = () => {
    if (v0 <= 0) return h0;
    
    // Time to reach max height: v = 0 => t = v0/g
    const tMax = v0 / g;
    return calculateHeight(tMax);
  };

  const calculateVelocityAtGround = () => {
    // v² = v0² + 2*g*h0
    return Math.sqrt(v0 * v0 + 2 * g * h0);
  };

  // Generate new challenge
  const generateChallenge = useCallback(() => {
    const types = currentLevel.motionTypes;
    const type = types[Math.floor(Math.random() * types.length)];
    
    const [minHeight, maxHeight] = currentLevel.heightRange;
    const [minV, maxV] = currentLevel.velocityRange;
    
    const newH0 = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
    let newV0 = 0;
    
    if (type === 'free-fall') {
      newV0 = 0;
    } else if (type === 'throw-up') {
      newV0 = Math.floor(Math.random() * (maxV - minV + 1)) + minV;
    } else if (type === 'throw-down') {
      newV0 = -(Math.floor(Math.random() * (maxV - minV + 1)) + minV);
    }
    
    setMotionType(type);
    setH0(newH0);
    setV0(newV0);
    
    // Calculate targets
    const timeToGround = calculateTimeToGroundWith(newH0, newV0);
    const maxHeightTarget = calculateMaxHeightWith(newH0, newV0);
    
    setTargetTime(timeToGround);
    setTargetHeight(maxHeightTarget);
    
    resetSimulation();
  }, [currentLevel]);

  const calculateTimeToGroundWith = (height, velocity) => {
    const discriminant = velocity * velocity + 2 * g * height;
    if (discriminant < 0) return 0;
    const t1 = (-velocity + Math.sqrt(discriminant)) / g;
    const t2 = (-velocity - Math.sqrt(discriminant)) / g;
    return Math.max(t1, t2);
  };

  const calculateMaxHeightWith = (height, velocity) => {
    if (velocity <= 0) return height;
    const tMax = velocity / g;
    return height + velocity * tMax - 0.5 * g * tMax * tMax;
  };

  // Start simulation
  const startSimulation = () => {
    setIsRunning(true);
    setCurrentTime(0);
    setCurrentHeight(h0);
    setCurrentVelocity(v0);
    setMaxHeight(h0);
    setTrajectoryData([{ t: 0, h: h0, v: v0 }]);
  };

  // Simulation loop
  useEffect(() => {
    if (!isRunning || gameState !== 'playing') return;

    const dt = 0.02; // Time step (20ms)
    const interval = setInterval(() => {
      setCurrentTime(t => {
        const newT = t + dt;
        const newH = calculateHeight(newT);
        const newV = calculateVelocity(newT);
        
        // Stop if hit ground
        if (newH <= 0) {
          setIsRunning(false);
          setCurrentHeight(0);
          setCurrentVelocity(newV);
          return t;
        }
        
        setCurrentHeight(newH);
        setCurrentVelocity(newV);
        setMaxHeight(prev => Math.max(prev, newH));
        
        setTrajectoryData(prev => [...prev, { t: newT, h: newH, v: newV }]);
        
        return newT;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isRunning, gameState, h0, v0]);

  // Check result
  const checkResult = useCallback(() => {
    const actualTime = currentTime;
    const actualMaxHeight = maxHeight;
    const actualVelocity = Math.abs(currentVelocity);
    
    let success = false;
    let points = 0;
    
    if (motionType === 'free-fall' || motionType === 'throw-down') {
      // Check time to ground
      const timeError = Math.abs(actualTime - targetTime);
      const timeTolerance = targetTime * 0.1;
      success = timeError < timeTolerance;
      points = success ? Math.floor(300 - timeError * 50) : 0;
    } else if (motionType === 'throw-up') {
      // Check max height
      const heightError = Math.abs(actualMaxHeight - targetHeight);
      const heightTolerance = targetHeight * 0.1;
      success = heightError < heightTolerance;
      points = success ? Math.floor(300 - heightError * 10) : 0;
    }
    
    if (success) {
      setScore(prev => prev + points);
      setCompletedChallenges(prev => {
        const newCompleted = prev + 1;
        if (newCompleted >= currentLevel.challengesNeeded) {
          setTimeout(() => setGameState('victory'), 500);
        } else {
          setTimeout(() => generateChallenge(), 1000);
        }
        return newCompleted;
      });
    }
    
    return { success, points };
  }, [currentTime, maxHeight, currentVelocity, motionType, targetTime, targetHeight, currentLevel, generateChallenge]);

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

    // Clear
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);

    if (gameState === 'playing') {
      drawScene(ctx, width, height);
    }
  }, [currentHeight, currentTime, trajectoryData, gameState, h0, v0, motionType]);

  const drawScene = (ctx, width, height) => {
    const sceneHeight = 450;
    const sceneTop = 25;
    const groundY = sceneTop + sceneHeight;
    const maxDisplayHeight = 100; // Max height in meters for display

    // Draw ground
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, groundY, width, height - groundY);
    
    // Draw ground line
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // Draw height scale
    drawHeightScale(ctx, sceneTop, sceneHeight, maxDisplayHeight);

    // Draw trajectory path
    if (trajectoryData.length > 1) {
      drawTrajectory(ctx, 100, sceneTop, sceneHeight, maxDisplayHeight);
    }

    // Draw object
    const objectX = 100;
    const displayHeight = Math.max(0, currentHeight);
    const objectY = groundY - (displayHeight / maxDisplayHeight) * sceneHeight;
    
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(objectX, objectY, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw velocity arrow
    drawVelocityArrow(ctx, objectX, objectY);

    // Draw info panel
    drawInfoPanel(ctx, width, sceneTop);

    // Draw graphs
    drawGraphs(ctx, width, height, sceneHeight);
  };

  const drawHeightScale = (ctx, top, height, maxH) => {
    ctx.strokeStyle = '#4b5563';
    ctx.fillStyle = '#9ca3af';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.lineWidth = 1;

    for (let h = 0; h <= maxH; h += 10) {
      const y = top + height - (h / maxH) * height;
      
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(30, y);
      ctx.stroke();
      
      ctx.fillText(`${h}m`, 15, y + 4);
    }

    // Draw vertical line
    ctx.beginPath();
    ctx.moveTo(30, top);
    ctx.lineTo(30, top + height);
    ctx.stroke();
  };

  const drawTrajectory = (ctx, x, top, height, maxH) => {
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    trajectoryData.forEach((point, i) => {
      const y = top + height - (Math.max(0, point.h) / maxH) * height;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  };

  const drawVelocityArrow = (ctx, x, y) => {
    const velocity = currentVelocity;
    if (Math.abs(velocity) < 0.5) return;

    const arrowLength = Math.min(Math.abs(velocity) * 3, 60);
    const direction = velocity > 0 ? -1 : 1; // Positive velocity = up

    ctx.strokeStyle = velocity > 0 ? '#10b981' : '#ef4444';
    ctx.fillStyle = velocity > 0 ? '#10b981' : '#ef4444';
    ctx.lineWidth = 3;

    // Arrow line
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + direction * arrowLength);
    ctx.stroke();

    // Arrow head
    ctx.beginPath();
    ctx.moveTo(x, y + direction * arrowLength);
    ctx.lineTo(x - 6, y + direction * arrowLength + direction * -8);
    ctx.lineTo(x + 6, y + direction * arrowLength + direction * -8);
    ctx.closePath();
    ctx.fill();

    // Velocity label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`v = ${velocity.toFixed(1)} m/s`, x + 25, y);
  };

  const drawInfoPanel = (ctx, width, top) => {
    const panelX = 200;
    const panelY = top;
    const panelW = 580;
    const panelH = 120;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(panelX, panelY, panelW, panelH);
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, panelW, panelH);

    // Info text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    
    const textX = panelX + 20;
    let textY = panelY + 30;

    // Motion type
    const typeText = motionType === 'free-fall' ? '🎯 Rơi tự do' : 
                     motionType === 'throw-up' ? '⬆️ Ném lên cao' : '⬇️ Ném xuống';
    ctx.fillText(typeText, textX, textY);

    // Current values
    textY += 25;
    ctx.font = '14px Arial';
    ctx.fillText(`Độ cao hiện tại: ${currentHeight.toFixed(1)} m`, textX, textY);
    
    textY += 25;
    ctx.fillText(`Vận tốc hiện tại: ${currentVelocity.toFixed(1)} m/s`, textX, textY);
    
    textY += 25;
    ctx.fillText(`Thời gian: ${currentTime.toFixed(2)} s`, textX, textY);

    // Target info
    ctx.font = 'bold 14px Arial';
    const targetX = panelX + 320;
    textY = panelY + 30;
    
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('🎯 MỤC TIÊU:', targetX, textY);
    
    ctx.fillStyle = '#fff';
    ctx.font = '13px Arial';
    textY += 25;
    
    if (motionType === 'throw-up') {
      ctx.fillText(`Độ cao cực đại: ${targetHeight.toFixed(1)} m`, targetX, textY);
      textY += 20;
      ctx.fillText(`Đạt được: ${maxHeight.toFixed(1)} m`, targetX, textY);
    } else {
      ctx.fillText(`Thời gian chạm đất: ${targetTime.toFixed(2)} s`, targetX, textY);
    }
  };

  const drawGraphs = (ctx, width, height, sceneHeight) => {
    const graphTop = sceneHeight + 80;
    const graphW = 380;
    const graphH = 150;
    const graphSpacing = 20;

    // Height-Time graph
    drawGraph(ctx, 20, graphTop, graphW, graphH, trajectoryData, 'h (m)', 't (s)', '#10b981', 'h');

    // Velocity-Time graph
    drawGraph(ctx, 20 + graphW + graphSpacing, graphTop, graphW, graphH, trajectoryData, 'v (m/s)', 't (s)', '#3b82f6', 'v');
  };

  const drawGraph = (ctx, x, y, w, h, data, yLabel, xLabel, color, dataKey) => {
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Axes
    const axisMarginX = 50;
    const axisMarginY = 30;
    
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + axisMarginX, y + 10);
    ctx.lineTo(x + axisMarginX, y + h - axisMarginY);
    ctx.lineTo(x + w - 10, y + h - axisMarginY);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(xLabel, x + w / 2, y + h - 5);
    
    ctx.save();
    ctx.translate(x + 15, y + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    // Plot data
    if (data.length < 2) return;

    const maxT = Math.max(...data.map(d => d.t), 1);
    const values = data.map(d => dataKey === 'h' ? d.h : d.v);
    const maxY = Math.max(...values, 1);
    const minY = Math.min(...values, 0);
    const rangeY = maxY - minY || 1;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, i) => {
      const px = x + axisMarginX + ((point.t / maxT) * (w - axisMarginX - 10));
      const value = dataKey === 'h' ? point.h : point.v;
      const py = y + h - axisMarginY - (((value - minY) / rangeY) * (h - axisMarginY - 10));

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    });

    ctx.stroke();
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setCurrentHeight(h0);
    setCurrentVelocity(v0);
    setMaxHeight(h0);
    setTrajectoryData([]);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCompletedChallenges(0);
    setTimeLeft(currentLevel.duration);
    generateChallenge();
  };

  const returnToMenu = () => {
    setGameState('menu');
    resetSimulation();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render menu
  if (gameState === 'menu') {
    return (
      <div className="free-fall-lab">
        <header className="game-header">
          <button className="back-button" onClick={() => window.history.back()}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <ArrowDown className="title-icon" size={40} />
            Free Fall Lab
          </h1>
        </header>

        <div className="menu-screen">
          <div className="menu-content">
            <ArrowDown className="menu-icon" size={80} />
            <h2>Free Fall Lab</h2>
            <p className="menu-description">
              Thí nghiệm rơi tự do và chuyển động ném theo phương thẳng đứng
            </p>

            <div className="theory-box">
              <h3>📚 Lý thuyết</h3>
              
              <div className="theory-section">
                <div className="theory-item">
                  <h4>🌍 Rơi tự do</h4>
                  <p><strong>Định nghĩa:</strong> Chuyển động chỉ chịu tác dụng của trọng lực</p>
                  <p><strong>Gia tốc:</strong> g = 9.8 m/s² (hướng xuống)</p>
                  <p><strong>Vận tốc:</strong> v = gt (v₀ = 0)</p>
                  <p><strong>Quãng đường:</strong> h = ½gt²</p>
                  <p><strong>Thời gian rơi:</strong> t = √(2h/g)</p>
                </div>

                <div className="theory-item">
                  <h4>⬆️ Ném lên cao</h4>
                  <p><strong>Vận tốc:</strong> v = v₀ - gt</p>
                  <p><strong>Độ cao:</strong> h = h₀ + v₀t - ½gt²</p>
                  <p><strong>Độ cao cực đại:</strong> h_max = h₀ + v₀²/(2g)</p>
                  <p><strong>Thời gian lên:</strong> t_lên = v₀/g</p>
                  <p>Tại h_max: v = 0</p>
                </div>

                <div className="theory-item">
                  <h4>⬇️ Ném xuống</h4>
                  <p><strong>Vận tốc:</strong> v = v₀ + gt</p>
                  <p><strong>Độ cao:</strong> h = h₀ - v₀t - ½gt²</p>
                  <p><strong>Vận tốc chạm đất:</strong> v = √(v₀² + 2gh₀)</p>
                  <p>Chuyển động nhanh dần đều</p>
                </div>

                <div className="theory-item">
                  <h4>📊 Đồ thị chuyển động</h4>
                  <p><strong>Đồ thị h-t:</strong> Parabol hướng xuống</p>
                  <p><strong>Đồ thị v-t:</strong> Đường thẳng nghiêng (độ dốc = -g)</p>
                  <p><strong>Lưu ý:</strong> Chọn chiều dương hướng lên</p>
                </div>
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
                      🎯 {level.challengesNeeded} thử thách | ⏱️ {level.duration}s
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

  // Render victory
  if (gameState === 'victory') {
    const success = completedChallenges >= currentLevel.challengesNeeded;
    
    return (
      <div className="free-fall-lab">
        <header className="game-header">
          <button className="back-button" onClick={returnToMenu}>
            <Home size={20} />
            <span>Menu</span>
          </button>
          <h1 className="game-title">
            <ArrowDown className="title-icon" size={40} />
            Free Fall Lab
          </h1>
        </header>

        <div className="victory-screen">
          <div className="victory-content">
            <Trophy className={`trophy-icon ${success ? 'success' : 'fail'}`} size={100} />
            <h2>{success ? 'Xuất sắc!' : 'Hết giờ!'}</h2>
            
            <div className="final-stats">
              <div className="final-stat">
                <span className="final-label">Điểm</span>
                <span className="final-value">{score}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Hoàn thành</span>
                <span className="final-value">{completedChallenges}/{currentLevel.challengesNeeded}</span>
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

  // Render game
  return (
    <div className="free-fall-lab">
      <header className="game-header">
        <button className="back-button" onClick={returnToMenu}>
          <Home size={20} />
          <span>Menu</span>
        </button>
        <h1 className="game-title">
          <ArrowDown className="title-icon" size={40} />
          Free Fall Lab - Cấp độ {selectedLevel}
        </h1>
      </header>

      <div className="game-screen">
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Điểm</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Thử thách</span>
            <span className="stat-value">{completedChallenges}/{currentLevel.challengesNeeded}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Thời gian</span>
            <span className="stat-value">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="game-content">
          <div className="simulation-area">
            <canvas
              ref={canvasRef}
              width={800}
              height={700}
              className="simulation-canvas"
            />
          </div>

          <div className="control-panel">
            <div className="challenge-info">
              <h3>🎯 Nhiệm vụ</h3>
              <p><strong>Loại:</strong> {
                motionType === 'free-fall' ? 'Rơi tự do' :
                motionType === 'throw-up' ? 'Ném lên cao' : 'Ném xuống'
              }</p>
              <p><strong>Độ cao ban đầu:</strong> {h0} m</p>
              {v0 !== 0 && <p><strong>Vận tốc ban đầu:</strong> {Math.abs(v0)} m/s</p>}
            </div>

            <div className="controls">
              <h3>⚙️ Điều khiển</h3>
              
              <div className="action-buttons">
                <button 
                  className="start-sim-btn" 
                  onClick={startSimulation}
                  disabled={isRunning}
                >
                  <Play size={20} />
                  <span>Bắt đầu thí nghiệm</span>
                </button>
                <button className="reset-btn" onClick={resetSimulation}>
                  <RotateCw size={20} />
                  <span>Đặt lại</span>
                </button>
                <button 
                  className="check-btn" 
                  onClick={checkResult}
                  disabled={isRunning || currentHeight > 0}
                >
                  <Zap size={20} />
                  <span>Kiểm tra kết quả</span>
                </button>
              </div>
            </div>

            <div className="physics-info">
              <h3>📐 Công thức</h3>
              {motionType === 'free-fall' && (
                <div className="formula-box">
                  <p>h = h₀ - ½gt²</p>
                  <p>v = gt</p>
                  <p>t = √(2h₀/g)</p>
                </div>
              )}
              {motionType === 'throw-up' && (
                <div className="formula-box">
                  <p>v = v₀ - gt</p>
                  <p>h = h₀ + v₀t - ½gt²</p>
                  <p>h_max = h₀ + v₀²/(2g)</p>
                </div>
              )}
              {motionType === 'throw-down' && (
                <div className="formula-box">
                  <p>v = v₀ + gt</p>
                  <p>h = h₀ - v₀t - ½gt²</p>
                  <p>v_đất = √(v₀² + 2gh₀)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeFallLab;
