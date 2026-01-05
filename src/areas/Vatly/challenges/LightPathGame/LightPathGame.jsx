import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, RotateCcw, Zap, Target, Play, Pause } from 'lucide-react';
import './LightPathGame.css';

const LightPathGame = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState('tutorial');
  const [mirrors, setMirrors] = useState([]);
  const [selectedMirror, setSelectedMirror] = useState(null);
  const [lightPath, setLightPath] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [completedLevels, setCompletedLevels] = useState(0);

  const levels = [
    {
      id: 1,
      name: 'Bài Tập Khởi Động',
      description: 'Điều khiển ánh sáng đến mục tiêu bằng 1 gương',
      lightSource: { x: 100, y: 300 },
      target: { x: 700, y: 300 },
      obstacles: [],
      maxMirrors: 1,
      mirrorSlots: [{ x: 400, y: 300, angle: 45 }],
      timeLimit: 60
    },
    {
      id: 2,
      name: 'Vượt Vật Cản',
      description: 'Sử dụng gương để ánh sáng vượt qua vật cản',
      lightSource: { x: 100, y: 200 },
      target: { x: 700, y: 400 },
      obstacles: [
        { x: 350, y: 250, width: 100, height: 200 }
      ],
      maxMirrors: 2,
      mirrorSlots: [
        { x: 250, y: 150, angle: 45 },
        { x: 550, y: 450, angle: 45 }
      ],
      timeLimit: 90
    },
    {
      id: 3,
      name: 'Mê Cung Ánh Sáng',
      description: 'Dẫn ánh sáng qua nhiều gương trong mê cung',
      lightSource: { x: 100, y: 100 },
      target: { x: 700, y: 500 },
      obstacles: [
        { x: 200, y: 200, width: 80, height: 150 },
        { x: 400, y: 100, width: 80, height: 250 },
        { x: 600, y: 300, width: 80, height: 150 }
      ],
      maxMirrors: 3,
      mirrorSlots: [
        { x: 300, y: 100, angle: 45 },
        { x: 350, y: 400, angle: 45 },
        { x: 650, y: 200, angle: 45 }
      ],
      timeLimit: 120
    },
    {
      id: 4,
      name: 'Phản Xạ Liên Tiếp',
      description: 'Tạo chuỗi phản xạ dài để đến đích',
      lightSource: { x: 50, y: 550 },
      target: { x: 750, y: 50 },
      obstacles: [
        { x: 150, y: 400, width: 150, height: 50 },
        { x: 400, y: 300, width: 150, height: 50 },
        { x: 350, y: 150, width: 150, height: 50 }
      ],
      maxMirrors: 4,
      mirrorSlots: [
        { x: 200, y: 500, angle: 45 },
        { x: 350, y: 380, angle: 45 },
        { x: 500, y: 280, angle: 45 },
        { x: 650, y: 130, angle: 45 }
      ],
      timeLimit: 150
    },
    {
      id: 5,
      name: 'Thử Thách Cuối Cùng',
      description: 'Giải quyết bài toán phức tạp nhất',
      lightSource: { x: 400, y: 550 },
      target: { x: 400, y: 50 },
      obstacles: [
        { x: 300, y: 450, width: 200, height: 40 },
        { x: 250, y: 300, width: 100, height: 40 },
        { x: 450, y: 300, width: 100, height: 40 },
        { x: 300, y: 150, width: 200, height: 40 }
      ],
      maxMirrors: 5,
      mirrorSlots: [
        { x: 200, y: 500, angle: 45 },
        { x: 200, y: 350, angle: 45 },
        { x: 400, y: 230, angle: 45 },
        { x: 600, y: 350, angle: 45 },
        { x: 600, y: 100, angle: 45 }
      ],
      timeLimit: 180
    }
  ];

  const currentLevel = levels[level - 1];

  useEffect(() => {
    if (gameState === 'playing') {
      initializeLevel();
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, level]);

  useEffect(() => {
    if (gameState === 'playing') {
      drawGame();
    }
  }, [mirrors, lightPath, animationProgress, gameState]);

  const initializeLevel = () => {
    const levelData = levels[level - 1];
    setMirrors(levelData.mirrorSlots.map(slot => ({ ...slot, active: false })));
    setLightPath([]);
    setTimeLeft(levelData.timeLimit);
    setSelectedMirror(null);
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0a0a15';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#1a1a30';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw obstacles
    if (currentLevel.obstacles) {
      currentLevel.obstacles.forEach(obs => {
        ctx.fillStyle = '#2a2a4e';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        
        ctx.strokeStyle = '#3a3a6e';
        ctx.lineWidth = 3;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
        
        // Pattern on obstacle
        ctx.strokeStyle = '#4a4a8e';
        ctx.lineWidth = 1;
        for (let i = 0; i < obs.width; i += 20) {
          ctx.beginPath();
          ctx.moveTo(obs.x + i, obs.y);
          ctx.lineTo(obs.x + i, obs.y + obs.height);
          ctx.stroke();
        }
      });
    }

    // Draw light source
    const source = currentLevel.lightSource;
    drawLightSource(ctx, source.x, source.y);

    // Draw target
    const target = currentLevel.target;
    drawTarget(ctx, target.x, target.y);

    // Draw mirror slots
    mirrors.forEach((mirror, index) => {
      drawMirrorSlot(ctx, mirror, index === selectedMirror);
    });

    // Draw light path with animation
    if (lightPath.length > 0 && isAnimating) {
      drawAnimatedLightPath(ctx);
    } else if (lightPath.length > 0) {
      drawLightPath(ctx);
    }
  };

  const drawLightSource = (ctx, x, y) => {
    // Outer glow
    const gradient = ctx.createRadialGradient(x, y, 5, x, y, 30);
    gradient.addColorStop(0, 'rgba(255, 235, 59, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 235, 59, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // Light source body
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Rays
    ctx.strokeStyle = '#ffeb3b';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * 15, y + Math.sin(angle) * 15);
      ctx.lineTo(x + Math.cos(angle) * 25, y + Math.sin(angle) * 25);
      ctx.stroke();
    }

    // Label
    ctx.fillStyle = '#ffeb3b';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Nguồn', x - 20, y + 35);
  };

  const drawTarget = (ctx, x, y) => {
    // Animated rings
    const time = Date.now() / 500;
    for (let i = 0; i < 3; i++) {
      const radius = 20 + i * 10 + (time % 10);
      const alpha = 1 - (time % 10) / 10;
      ctx.strokeStyle = `rgba(76, 175, 80, ${alpha * 0.5})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Target circles
    ctx.strokeStyle = '#4caf50';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.stroke();

    // Center
    ctx.fillStyle = '#4caf50';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.fillStyle = '#4caf50';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Mục tiêu', x - 25, y + 35);
  };

  const drawMirrorSlot = (ctx, mirror, isSelected) => {
    const length = 60;
    const angleRad = (mirror.angle * Math.PI) / 180;
    
    ctx.save();
    ctx.translate(mirror.x, mirror.y);
    ctx.rotate(angleRad);

    // Slot background
    ctx.fillStyle = isSelected ? 'rgba(0, 188, 212, 0.3)' : 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(-length / 2 - 5, -10, length + 10, 20);

    if (mirror.active) {
      // Active mirror
      ctx.strokeStyle = '#00bcd4';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-length / 2, 0);
      ctx.lineTo(length / 2, 0);
      ctx.stroke();
      
      // Shine effect
      ctx.strokeStyle = '#80deea';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-length / 2 + 8, -2);
      ctx.lineTo(length / 2 - 8, -2);
      ctx.stroke();
    } else {
      // Empty slot
      ctx.strokeStyle = isSelected ? '#00bcd4' : '#555';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(-length / 2, 0);
      ctx.lineTo(length / 2, 0);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  };

  const drawLightPath = (ctx) => {
    if (lightPath.length < 2) return;

    ctx.strokeStyle = '#ffeb3b';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ffeb3b';
    ctx.shadowBlur = 10;

    for (let i = 0; i < lightPath.length - 1; i++) {
      const start = lightPath[i];
      const end = lightPath[i + 1];
      
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
  };

  const drawAnimatedLightPath = (ctx) => {
    if (lightPath.length < 2) return;

    const totalLength = lightPath.length - 1;
    const currentSegment = Math.floor(animationProgress * totalLength);
    const segmentProgress = (animationProgress * totalLength) % 1;

    ctx.strokeStyle = '#ffeb3b';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ffeb3b';
    ctx.shadowBlur = 15;

    // Draw completed segments
    for (let i = 0; i < currentSegment; i++) {
      const start = lightPath[i];
      const end = lightPath[i + 1];
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }

    // Draw current segment
    if (currentSegment < totalLength) {
      const start = lightPath[currentSegment];
      const end = lightPath[currentSegment + 1];
      const currentX = start.x + (end.x - start.x) * segmentProgress;
      const currentY = start.y + (end.y - start.y) * segmentProgress;
      
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();

      // Light particle at the end
      ctx.fillStyle = '#ffeb3b';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
  };

  const toggleMirror = (index) => {
    const newMirrors = [...mirrors];
    newMirrors[index].active = !newMirrors[index].active;
    setMirrors(newMirrors);
    setLightPath([]);
  };

  const adjustMirrorAngle = (index, delta) => {
    const newMirrors = [...mirrors];
    newMirrors[index].angle = (newMirrors[index].angle + delta + 360) % 360;
    setMirrors(newMirrors);
    setLightPath([]);
  };

  const calculateLightPath = () => {
    const path = [currentLevel.lightSource];
    let currentPos = { ...currentLevel.lightSource };
    let currentAngle = 0; // Initial direction towards first mirror
    
    const activeMirrors = mirrors.filter(m => m.active);
    if (activeMirrors.length === 0) return path;

    // Calculate path through mirrors
    for (let i = 0; i < activeMirrors.length; i++) {
      const mirror = activeMirrors[i];
      path.push({ x: mirror.x, y: mirror.y });
      
      // Calculate reflection
      const mirrorAngleRad = (mirror.angle * Math.PI) / 180;
      const incidentAngle = Math.atan2(mirror.y - currentPos.y, mirror.x - currentPos.x);
      currentAngle = 2 * mirrorAngleRad - incidentAngle - Math.PI;
      
      currentPos = { x: mirror.x, y: mirror.y };
    }

    // Extend last ray
    const extendLength = 1000;
    const finalX = currentPos.x + Math.cos(currentAngle) * extendLength;
    const finalY = currentPos.y + Math.sin(currentAngle) * extendLength;
    path.push({ x: finalX, y: finalY });

    return path;
  };

  const shootLight = () => {
    const path = calculateLightPath();
    setLightPath(path);
    setIsAnimating(true);
    setAnimationProgress(0);

    // Animate
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimationProgress(progress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        checkSuccess(path);
      }
    };
    
    animate();
  };

  const checkSuccess = (path) => {
    if (path.length < 2) return;
    
    const lastPoint = path[path.length - 1];
    const target = currentLevel.target;
    const distance = Math.sqrt(
      Math.pow(lastPoint.x - target.x, 2) + Math.pow(lastPoint.y - target.y, 2)
    );

    if (distance < 30) {
      handleLevelComplete();
    }
  };

  const handleLevelComplete = () => {
    const timeBonus = Math.floor(timeLeft * 10);
    const mirrorBonus = (currentLevel.maxMirrors - mirrors.filter(m => m.active).length) * 50;
    const totalPoints = 500 + timeBonus + mirrorBonus;
    
    setScore(score + totalPoints);
    setCompletedLevels(completedLevels + 1);

    setTimeout(() => {
      if (level < levels.length) {
        setLevel(level + 1);
        setGameState('playing');
      } else {
        setGameState('victory');
      }
    }, 2000);
  };

  const handleTimeout = () => {
    setGameState('gameover');
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setCompletedLevels(0);
    setGameState('playing');
  };

  return (
    <div className="light-path-game">
      <div className="game-header">
        <button onClick={() => navigate('/physics-games/grade/7')} className="back-button">
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <div className="game-title">
          <Zap className="title-icon" />
          <h1>Đường Đi Của Ánh Sáng</h1>
        </div>
        <div className="game-stats">
          <div className="stat-item">
            <Award className="stat-icon" />
            <span>{score}</span>
          </div>
          <div className="stat-item">
            <Target className="stat-icon" />
            <span>Cấp {level}/{levels.length}</span>
          </div>
          <div className="stat-item timer">
            ⏱️ <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {gameState === 'tutorial' && (
        <div className="tutorial-overlay">
          <div className="tutorial-content">
            <h2>🔦 Điều Khiển Ánh Sáng</h2>
            <div className="tutorial-steps">
              <div className="tutorial-step">
                <span className="step-number">1</span>
                <p>Nhấp vào vị trí gương để kích hoạt/tắt gương</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">2</span>
                <p>Sử dụng các nút ⟲ ⟳ để điều chỉnh góc gương</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">3</span>
                <p>Nhấn "Bắn Tia Sáng" để kiểm tra đường đi</p>
              </div>
              <div className="tutorial-step">
                <span className="step-number">4</span>
                <p>Dẫn ánh sáng đến mục tiêu xanh để qua cấp</p>
              </div>
            </div>
            <button onClick={() => setGameState('playing')} className="start-button">
              Bắt Đầu Thử Thách
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-content">
          <div className="level-info">
            <h3>{currentLevel.name}</h3>
            <p>{currentLevel.description}</p>
            <div className="level-requirements">
              <span>Gương tối đa: {currentLevel.maxMirrors}</span>
              <span>Thời gian: {currentLevel.timeLimit}s</span>
            </div>
          </div>

          <div className="canvas-container">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="game-canvas"
              onClick={(e) => {
                const rect = e.target.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                mirrors.forEach((mirror, index) => {
                  const dist = Math.sqrt(
                    Math.pow(x - mirror.x, 2) + Math.pow(y - mirror.y, 2)
                  );
                  if (dist < 40) {
                    toggleMirror(index);
                  }
                });
              }}
            />
          </div>

          <div className="mirror-controls">
            <h4>🪞 Điều Khiển Gương</h4>
            <div className="mirror-list">
              {mirrors.map((mirror, index) => (
                <div 
                  key={index} 
                  className={`mirror-control-item ${mirror.active ? 'active' : ''} ${selectedMirror === index ? 'selected' : ''}`}
                  onClick={() => setSelectedMirror(index)}
                >
                  <span className="mirror-number">#{index + 1}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); adjustMirrorAngle(index, -15); }}
                    className="angle-btn"
                  >
                    ⟲
                  </button>
                  <span className="angle-display">{mirror.angle}°</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); adjustMirrorAngle(index, 15); }}
                    className="angle-btn"
                  >
                    ⟳
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleMirror(index); }}
                    className={`toggle-btn ${mirror.active ? 'active' : ''}`}
                  >
                    {mirror.active ? 'BẬT' : 'TẮT'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="action-panel">
            <button 
              onClick={shootLight} 
              className="shoot-button"
              disabled={isAnimating || mirrors.every(m => !m.active)}
            >
              <Zap size={20} />
              Bắn Tia Sáng
            </button>
            <button onClick={initializeLevel} className="reset-button">
              <RotateCcw size={20} />
              Đặt Lại
            </button>
          </div>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="game-over-overlay victory">
          <div className="game-over-content">
            <h2>🎉 Hoàn Thành Xuất Sắc!</h2>
            <p className="final-score">{score} điểm</p>
            <p className="completion-text">
              Bạn đã hoàn thành {completedLevels}/{levels.length} cấp độ!
            </p>
            <div className="achievement-stars">
              {['⭐', '⭐', '⭐'].map((star, i) => (
                <span key={i} className="star">{star}</span>
              ))}
            </div>
            <div className="victory-buttons">
              <button onClick={resetGame} className="retry-button">
                <RotateCcw size={20} />
                Chơi Lại
              </button>
              <button onClick={() => navigate('/physics/grade/7')} className="home-button">
                Về Trang Chủ
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>⏰ Hết Giờ!</h2>
            <p className="final-score">{score} điểm</p>
            <p>Hoàn thành: {completedLevels}/{levels.length} cấp độ</p>
            <div className="gameover-buttons">
              <button onClick={resetGame} className="retry-button">
                <RotateCcw size={20} />
                Thử Lại
              </button>
              <button onClick={() => navigate('/physics-games/grade/7')} className="home-button">
                Về Trang Chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LightPathGame;
