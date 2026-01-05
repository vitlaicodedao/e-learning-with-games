import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Home, Play, RotateCw, Trophy, TrendingUp, Gauge } from 'lucide-react';
import './MotionTracker.css';

/**
 * Motion Tracker - Grade 10 Chapter 1: Kinematics
 * Game mô phỏng chuyển động thẳng đều và biến đổi đều
 * Physics: v = v0 + at, x = x0 + v0*t + 0.5*a*t²
 */

const MotionTracker = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Game stats
  const [score, setScore] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);

  // Motion parameters
  const [motionType, setMotionType] = useState('uniform'); // uniform, accelerated
  const [v0, setV0] = useState(10); // Initial velocity (m/s)
  const [a, setA] = useState(0); // Acceleration (m/s²)
  const [targetDistance, setTargetDistance] = useState(100); // Target distance (m)
  const [targetTime, setTargetTime] = useState(10); // Target time (s)

  // Simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentVelocity, setCurrentVelocity] = useState(0);

  // Graph data
  const [positionData, setPositionData] = useState([]);
  const [velocityData, setVelocityData] = useState([]);

  // Level configurations
  const levels = [
    {
      id: 1,
      name: 'Cơ bản - Chuyển động thẳng đều',
      description: 'Điều chỉnh vận tốc để đạt vị trí mục tiêu',
      duration: 180,
      challengesNeeded: 3,
      allowAcceleration: false,
      maxVelocity: 20,
      maxAcceleration: 0
    },
    {
      id: 2,
      name: 'Trung bình - Chuyển động biến đổi đều',
      description: 'Sử dụng gia tốc để đạt mục tiêu',
      duration: 240,
      challengesNeeded: 4,
      allowAcceleration: true,
      maxVelocity: 30,
      maxAcceleration: 5
    },
    {
      id: 3,
      name: 'Nâng cao - Đạt cả khoảng cách và thời gian',
      description: 'Đạt đúng khoảng cách trong thời gian quy định',
      duration: 300,
      challengesNeeded: 5,
      allowAcceleration: true,
      maxVelocity: 40,
      maxAcceleration: 10
    },
    {
      id: 4,
      name: 'Chuyên gia - Đồ thị chuyển động',
      description: 'Phân tích và vẽ đồ thị chuyển động chính xác',
      duration: 360,
      challengesNeeded: 6,
      allowAcceleration: true,
      maxVelocity: 50,
      maxAcceleration: 15
    }
  ];

  const currentLevel = levels[selectedLevel - 1];

  // Physics calculations
  const calculatePosition = (t) => {
    // x = x0 + v0*t + 0.5*a*t²
    return v0 * t + 0.5 * a * t * t;
  };

  const calculateVelocity = (t) => {
    // v = v0 + a*t
    return v0 + a * t;
  };

  // Generate new challenge
  const generateChallenge = useCallback(() => {
    const distances = [50, 75, 100, 125, 150, 200, 250];
    const times = [5, 8, 10, 12, 15, 20];
    
    const newDistance = distances[Math.floor(Math.random() * distances.length)];
    const newTime = times[Math.floor(Math.random() * times.length)];
    
    setTargetDistance(newDistance);
    setTargetTime(newTime);
    setCurrentTime(0);
    setCurrentPosition(0);
    setCurrentVelocity(v0);
    setPositionData([]);
    setVelocityData([]);
    setIsRunning(false);
  }, [v0]);

  // Start simulation
  const startSimulation = () => {
    setIsRunning(true);
    setCurrentTime(0);
    setCurrentPosition(0);
    setCurrentVelocity(v0);
    setPositionData([{ t: 0, x: 0 }]);
    setVelocityData([{ t: 0, v: v0 }]);
  };

  // Simulation loop
  useEffect(() => {
    if (!isRunning || gameState !== 'playing') return;

    const dt = 0.05; // Time step (50ms)
    const interval = setInterval(() => {
      setCurrentTime(t => {
        const newT = t + dt;
        if (newT > targetTime + 5) {
          setIsRunning(false);
          return t;
        }
        
        const newX = calculatePosition(newT);
        const newV = calculateVelocity(newT);
        
        setCurrentPosition(newX);
        setCurrentVelocity(newV);
        
        setPositionData(prev => [...prev, { t: newT, x: newX }]);
        setVelocityData(prev => [...prev, { t: newT, v: newV }]);
        
        return newT;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, gameState, v0, a, targetTime]);

  // Check result
  const checkResult = useCallback(() => {
    const finalPosition = currentPosition;
    const finalTime = currentTime;
    
    const positionError = Math.abs(finalPosition - targetDistance);
    const timeError = Math.abs(finalTime - targetTime);
    
    const positionTolerance = targetDistance * 0.1; // 10%
    const timeTolerance = targetTime * 0.15; // 15%
    
    let success = false;
    let points = 0;
    
    if (currentLevel.id <= 2) {
      // Chỉ cần đạt khoảng cách
      success = positionError < positionTolerance;
      points = success ? Math.floor(200 - positionError * 2) : 0;
    } else {
      // Cần đạt cả khoảng cách và thời gian
      success = positionError < positionTolerance && timeError < timeTolerance;
      points = success ? Math.floor(300 - positionError * 2 - timeError * 10) : 0;
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
    
    return { success, points, positionError, timeError };
  }, [currentPosition, currentTime, targetDistance, targetTime, currentLevel, generateChallenge]);

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
      drawTrack(ctx, width, height);
      drawGraphs(ctx, width, height);
    }
  }, [currentPosition, currentTime, positionData, velocityData, gameState, targetDistance]);

  const drawTrack = (ctx, width, height) => {
    const trackY = 150;
    const trackWidth = 700;
    const trackStart = 50;

    // Track
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(trackStart, trackY);
    ctx.lineTo(trackStart + trackWidth, trackY);
    ctx.stroke();

    // Start line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(trackStart, trackY - 20);
    ctx.lineTo(trackStart, trackY + 20);
    ctx.stroke();

    // Target line
    const targetX = trackStart + (targetDistance / 300) * trackWidth;
    ctx.strokeStyle = '#ef4444';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(targetX, trackY - 20);
    ctx.lineTo(targetX, trackY + 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Target label
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${targetDistance}m`, targetX, trackY - 30);

    // Moving object
    const objectX = trackStart + Math.min(currentPosition / 300, 1) * trackWidth;
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(objectX, trackY, 15, 0, Math.PI * 2);
    ctx.fill();

    // Velocity arrow
    if (currentVelocity > 0) {
      const arrowLength = Math.min(currentVelocity * 3, 50);
      ctx.strokeStyle = '#fbbf24';
      ctx.fillStyle = '#fbbf24';
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.moveTo(objectX, trackY);
      ctx.lineTo(objectX + arrowLength, trackY);
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(objectX + arrowLength, trackY);
      ctx.lineTo(objectX + arrowLength - 8, trackY - 5);
      ctx.lineTo(objectX + arrowLength - 8, trackY + 5);
      ctx.closePath();
      ctx.fill();
    }

    // Info display
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Vị trí: ${currentPosition.toFixed(1)}m`, trackStart, trackY + 50);
    ctx.fillText(`Vận tốc: ${currentVelocity.toFixed(1)}m/s`, trackStart + 150, trackY + 50);
    ctx.fillText(`Thời gian: ${currentTime.toFixed(2)}s`, trackStart + 300, trackY + 50);
  };

  const drawGraphs = (ctx, width, height) => {
    const graphY = 250;
    const graphWidth = 340;
    const graphHeight = 200;
    const graphSpacing = 20;

    // Position-Time graph
    drawGraph(ctx, 50, graphY, graphWidth, graphHeight, positionData, 'x (m)', 't (s)', '#10b981');

    // Velocity-Time graph
    drawGraph(ctx, 50 + graphWidth + graphSpacing, graphY, graphWidth, graphHeight, velocityData, 'v (m/s)', 't (s)', '#3b82f6');
  };

  const drawGraph = (ctx, x, y, w, h, data, yLabel, xLabel, color) => {
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 40, y + 10);
    ctx.lineTo(x + 40, y + h - 30);
    ctx.lineTo(x + w - 10, y + h - 30);
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

    const maxT = Math.max(...data.map(d => d.t), targetTime);
    const maxY = Math.max(...data.map(d => yLabel === 'x (m)' ? d.x : d.v), 1);

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, i) => {
      const px = x + 40 + ((point.t / maxT) * (w - 50));
      const value = yLabel === 'x (m)' ? point.x : point.v;
      const py = y + h - 30 - ((value / maxY) * (h - 40));

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    });

    ctx.stroke();

    // Target line for position graph
    if (yLabel === 'x (m)') {
      ctx.strokeStyle = '#ef4444';
      ctx.setLineDash([5, 5]);
      const targetY = y + h - 30 - ((targetDistance / maxY) * (h - 40));
      ctx.beginPath();
      ctx.moveTo(x + 40, targetY);
      ctx.lineTo(x + w - 10, targetY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const adjustV0 = (delta) => {
    setV0(prev => Math.max(0, Math.min(currentLevel.maxVelocity, prev + delta)));
  };

  const adjustA = (delta) => {
    if (!currentLevel.allowAcceleration) return;
    setA(prev => Math.max(-currentLevel.maxAcceleration, Math.min(currentLevel.maxAcceleration, prev + delta)));
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setCurrentPosition(0);
    setCurrentVelocity(v0);
    setPositionData([]);
    setVelocityData([]);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCompletedChallenges(0);
    setTimeLeft(currentLevel.duration);
    setV0(10);
    setA(0);
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
      <div className="motion-tracker">
        <header className="game-header">
          <button className="back-button" onClick={() => window.history.back()}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <TrendingUp className="title-icon" size={40} />
            Motion Tracker
          </h1>
        </header>

        <div className="menu-screen">
          <div className="menu-content">
            <TrendingUp className="menu-icon" size={80} />
            <h2>Motion Tracker</h2>
            <p className="menu-description">
              Mô phỏng và phân tích chuyển động thẳng đều và biến đổi đều
            </p>

            <div className="theory-box">
              <h3>📚 Lý thuyết</h3>
              
              <div className="theory-section">
                <div className="theory-item">
                  <h4>📐 Chuyển động thẳng đều</h4>
                  <p><strong>Vận tốc:</strong> v = const</p>
                  <p><strong>Phương trình:</strong> x = x₀ + vt</p>
                  <p>Vật chuyển động với vận tốc không đổi</p>
                </div>

                <div className="theory-item">
                  <h4>⚡ Chuyển động biến đổi đều</h4>
                  <p><strong>Vận tốc:</strong> v = v₀ + at</p>
                  <p><strong>Tọa độ:</strong> x = x₀ + v₀t + ½at²</p>
                  <p><strong>Hệ thức:</strong> v² - v₀² = 2ax</p>
                  <p>a &gt; 0: nhanh dần, a &lt; 0: chậm dần</p>
                </div>

                <div className="theory-item">
                  <h4>📊 Đồ thị chuyển động</h4>
                  <p><strong>Đồ thị x-t:</strong> Thẳng đều → đường thẳng, Biến đổi đều → parabol</p>
                  <p><strong>Đồ thị v-t:</strong> Thẳng đều → đường thẳng song song Ox, Biến đổi đều → đường thẳng xiên</p>
                  <p><strong>Diện tích v-t:</strong> Cho biết độ dịch chuyển</p>
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
      <div className="motion-tracker">
        <header className="game-header">
          <button className="back-button" onClick={returnToMenu}>
            <Home size={20} />
            <span>Menu</span>
          </button>
          <h1 className="game-title">
            <TrendingUp className="title-icon" size={40} />
            Motion Tracker
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
    <div className="motion-tracker">
      <header className="game-header">
        <button className="back-button" onClick={returnToMenu}>
          <Home size={20} />
          <span>Menu</span>
        </button>
        <h1 className="game-title">
          <TrendingUp className="title-icon" size={40} />
          Motion Tracker - Cấp độ {selectedLevel}
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
              height={500}
              className="simulation-canvas"
            />
          </div>

          <div className="control-panel">
            <div className="challenge-info">
              <h3>🎯 Nhiệm vụ</h3>
              <p><strong>Đích:</strong> {targetDistance} m</p>
              {currentLevel.id >= 3 && <p><strong>Thời gian:</strong> {targetTime} s</p>}
            </div>

            <div className="controls">
              <h3>⚙️ Điều khiển</h3>
              
              <div className="control-group">
                <label>Vận tốc ban đầu v₀: {v0.toFixed(1)} m/s</label>
                <div className="button-group">
                  <button onClick={() => adjustV0(-1)}>-1</button>
                  <button onClick={() => adjustV0(-0.5)}>-0.5</button>
                  <button onClick={() => adjustV0(0.5)}>+0.5</button>
                  <button onClick={() => adjustV0(1)}>+1</button>
                </div>
              </div>

              {currentLevel.allowAcceleration && (
                <div className="control-group">
                  <label>Gia tốc a: {a.toFixed(1)} m/s²</label>
                  <div className="button-group">
                    <button onClick={() => adjustA(-0.5)}>-0.5</button>
                    <button onClick={() => adjustA(-0.1)}>-0.1</button>
                    <button onClick={() => adjustA(0.1)}>+0.1</button>
                    <button onClick={() => adjustA(0.5)}>+0.5</button>
                  </div>
                </div>
              )}

              <div className="action-buttons">
                <button 
                  className="start-sim-btn" 
                  onClick={startSimulation}
                  disabled={isRunning}
                >
                  <Play size={20} />
                  <span>Chạy mô phỏng</span>
                </button>
                <button className="reset-btn" onClick={resetSimulation}>
                  <RotateCw size={20} />
                  <span>Đặt lại</span>
                </button>
                <button 
                  className="check-btn" 
                  onClick={checkResult}
                  disabled={isRunning || currentTime === 0}
                >
                  <Gauge size={20} />
                  <span>Kiểm tra</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotionTracker;
