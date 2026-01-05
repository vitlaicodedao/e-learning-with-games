import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Swords, RotateCcw, Trophy, Target } from 'lucide-react';
import './ForceArena.css';

const ForceArena = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu'); // menu, playing, victory
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  // Physics objects
  const [player, setPlayer] = useState({
    x: 400,
    y: 500,
    vx: 0,
    vy: 0,
    mass: 50,
    radius: 25
  });

  const [forces, setForces] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [target, setTarget] = useState({ x: 400, y: 100, radius: 30 });
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const levels = [
    {
      id: 1,
      name: 'Cân Bằng Lực',
      description: 'Đẩy vật đến đích bằng lực phù hợp',
      obstacles: [],
      friction: 0.98,
      goalDistance: 50
    },
    {
      id: 2,
      name: 'Vượt Chướng Ngại Vật',
      description: 'Tránh chướng ngại vật và ma sát',
      obstacles: [
        { x: 300, y: 300, width: 80, height: 80, friction: 0.8 },
        { x: 500, y: 300, width: 80, height: 80, friction: 0.8 }
      ],
      friction: 0.95,
      goalDistance: 40
    },
    {
      id: 3,
      name: 'Quán Tính',
      description: 'Sử dụng quán tính để đi xa hơn',
      obstacles: [
        { x: 200, y: 350, width: 60, height: 60, friction: 0.7 },
        { x: 400, y: 250, width: 60, height: 60, friction: 0.7 },
        { x: 600, y: 350, width: 60, height: 60, friction: 0.7 }
      ],
      friction: 0.97,
      goalDistance: 35
    },
    {
      id: 4,
      name: 'Lực Ma Sát Cao',
      description: 'Khắc phục lực ma sát lớn',
      obstacles: [],
      friction: 0.85,
      goalDistance: 30
    }
  ];

  const currentLevel = levels[level - 1];

  useEffect(() => {
    if (gameState === 'playing') {
      resetGame();
    }
  }, [gameState, level]);

  useEffect(() => {
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [player, gameState]);

  const resetGame = () => {
    setPlayer({
      x: 400,
      y: 500,
      vx: 0,
      vy: 0,
      mass: 50,
      radius: 25
    });
    setForces([]);
    setObstacles(currentLevel.obstacles);
    setTarget({ x: 400, y: 100, radius: 30 });
    setDragStart(null);
    setDragEnd(null);
    setIsDragging(false);
  };

  const gameLoop = () => {
    updatePhysics();
    drawGame();
    
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const updatePhysics = () => {
    setPlayer(prev => {
      let newVx = prev.vx;
      let newVy = prev.vy;

      // Apply friction
      newVx *= currentLevel.friction;
      newVy *= currentLevel.friction;

      // Check collision with obstacles
      obstacles.forEach(obs => {
        if (
          prev.x + prev.radius > obs.x &&
          prev.x - prev.radius < obs.x + obs.width &&
          prev.y + prev.radius > obs.y &&
          prev.y - prev.radius < obs.y + obs.height
        ) {
          // Apply obstacle friction
          newVx *= obs.friction;
          newVy *= obs.friction;
        }
      });

      // Update position
      let newX = prev.x + newVx;
      let newY = prev.y + newVy;

      // Boundary collision
      if (newX - prev.radius < 0 || newX + prev.radius > 800) {
        newVx = -newVx * 0.5;
        newX = Math.max(prev.radius, Math.min(800 - prev.radius, newX));
      }
      if (newY - prev.radius < 0 || newY + prev.radius > 600) {
        newVy = -newVy * 0.5;
        newY = Math.max(prev.radius, Math.min(600 - prev.radius, newY));
      }

      // Check if reached target
      const distToTarget = Math.hypot(newX - target.x, newY - target.y);
      if (distToTarget < prev.radius + target.radius) {
        if (level < levels.length) {
          setTimeout(() => {
            setLevel(l => l + 1);
            setScore(s => s + 100);
            setGameState('playing');
          }, 500);
        } else {
          setGameState('victory');
        }
      }

      return {
        ...prev,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy
      };
    });
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#ffffff11';
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

    // Draw target
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius - 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius - 10, 0, Math.PI * 2);
    ctx.stroke();

    // Draw obstacles
    obstacles.forEach(obs => {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

      // Friction indicator
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`μ=${(1 - obs.friction).toFixed(2)}`, obs.x + obs.width / 2, obs.y + obs.height / 2);
    });

    // Draw player
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw velocity vector
    if (player.vx !== 0 || player.vy !== 0) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(player.x, player.y);
      ctx.lineTo(player.x + player.vx * 5, player.y + player.vy * 5);
      ctx.stroke();

      // Arrow head
      const angle = Math.atan2(player.vy, player.vx);
      const arrowSize = 10;
      ctx.beginPath();
      ctx.moveTo(
        player.x + player.vx * 5,
        player.y + player.vy * 5
      );
      ctx.lineTo(
        player.x + player.vx * 5 - arrowSize * Math.cos(angle - Math.PI / 6),
        player.y + player.vy * 5 - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        player.x + player.vx * 5 - arrowSize * Math.cos(angle + Math.PI / 6),
        player.y + player.vy * 5 - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }

    // Draw drag force indicator
    if (isDragging && dragStart && dragEnd) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(dragStart.x, dragStart.y);
      ctx.lineTo(dragEnd.x, dragEnd.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow
      const dx = dragEnd.x - dragStart.x;
      const dy = dragEnd.y - dragStart.y;
      const angle = Math.atan2(dy, dx);
      const arrowSize = 15;
      
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(dragEnd.x, dragEnd.y);
      ctx.lineTo(
        dragEnd.x - arrowSize * Math.cos(angle - Math.PI / 6),
        dragEnd.y - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        dragEnd.x - arrowSize * Math.cos(angle + Math.PI / 6),
        dragEnd.y - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      // Force magnitude
      const forceMag = Math.hypot(dx, dy) * 0.1;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `F = ${forceMag.toFixed(1)}N`,
        (dragStart.x + dragEnd.x) / 2,
        (dragStart.y + dragEnd.y) / 2 - 10
      );
    }

    // Draw info
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Vận tốc: ${Math.hypot(player.vx, player.vy).toFixed(1)} m/s`, 10, 25);
    ctx.fillText(`Ma sát: μ = ${(1 - currentLevel.friction).toFixed(2)}`, 10, 50);
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on player
    const dist = Math.hypot(x - player.x, y - player.y);
    if (dist < player.radius) {
      setIsDragging(true);
      setDragStart({ x, y });
      setDragEnd({ x, y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDragEnd({ x, y });
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      // Apply force
      const dx = (dragEnd.x - dragStart.x) * 0.1;
      const dy = (dragEnd.y - dragStart.y) * 0.1;

      setPlayer(prev => ({
        ...prev,
        vx: prev.vx + dx,
        vy: prev.vy + dy
      }));
    }

    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  const startGame = () => {
    setGameState('playing');
  };

  return (
    <div className="force-arena">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} />
        Quay lại
      </button>

      <div className="game-header">
        <h1>⚔️ Võ Đài Lực Học</h1>
        <div className="game-info">
          <span className="level-badge">Cấp {level}</span>
          <span className="score-badge">
            <Target size={16} />
            {score} điểm
          </span>
        </div>
      </div>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="intro-card">
            <h2>🎯 Hướng dẫn chơi</h2>
            <div className="instructions">
              <div className="instruction-item">
                <span className="step">1</span>
                <p>Click và kéo vật thể màu xanh để tạo lực</p>
              </div>
              <div className="instruction-item">
                <span className="step">2</span>
                <p>Thả chuột để đẩy vật theo hướng đã kéo</p>
              </div>
              <div className="instruction-item">
                <span className="step">3</span>
                <p>Đưa vật đến đích màu xanh lá</p>
              </div>
              <div className="instruction-item">
                <span className="step">4</span>
                <p>Tránh chướng ngại vật màu đỏ (ma sát cao)</p>
              </div>
            </div>

            <div className="concepts">
              <h3>📚 Khái niệm vật lý:</h3>
              <ul>
                <li><strong>Lực (F):</strong> Tác động làm thay đổi trạng thái chuyển động</li>
                <li><strong>Quán tính:</strong> Vật giữ trạng thái chuyển động ban đầu</li>
                <li><strong>Lực ma sát (μ):</strong> Lực cản trở chuyển động</li>
                <li><strong>Vận tốc (v):</strong> Tốc độ thay đổi vị trí</li>
              </ul>
            </div>

            <button className="start-button" onClick={startGame}>
              <Swords size={20} />
              Bắt đầu thử thách
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="playing-screen">
          <div className="level-info-panel">
            <h3>{currentLevel.name}</h3>
            <p>{currentLevel.description}</p>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="game-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          <button className="reset-button" onClick={resetGame}>
            <RotateCcw size={18} />
            Chơi lại cấp này
          </button>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="victory-screen">
          <Trophy size={80} className="trophy-icon" />
          <h2>🎉 Xuất sắc!</h2>
          <p>Bạn đã làm chủ các định luật về lực!</p>
          <div className="victory-stats">
            <div className="stat-item">
              <strong>Tổng điểm:</strong>
              <span>{score}</span>
            </div>
            <div className="stat-item">
              <strong>Cấp độ hoàn thành:</strong>
              <span>{levels.length}</span>
            </div>
          </div>
          <div className="victory-actions">
            <button onClick={() => { setLevel(1); setScore(0); setGameState('menu'); }}>
              Chơi lại
            </button>
            <button onClick={() => navigate(-1)}>
              Về trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForceArena;
