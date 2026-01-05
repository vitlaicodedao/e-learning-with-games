import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Trophy, Target, TrendingUp } from 'lucide-react';
import './EnergyLab.css';

const EnergyLab = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu'); // menu, playing, victory
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  // Physics simulation
  const [pendulum, setPendulum] = useState({
    angle: Math.PI / 4, // 45 degrees
    angleVelocity: 0,
    length: 150,
    mass: 2,
    x: 400,
    y: 100
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [energyData, setEnergyData] = useState({
    kinetic: 0,
    potential: 0,
    total: 0
  });

  const [workData, setWorkData] = useState({
    force: 0,
    distance: 0,
    work: 0,
    power: 0,
    time: 0
  });

  const GRAVITY = 9.81;

  const levels = [
    {
      id: 1,
      name: 'Con Lắc Đơn',
      description: 'Quan sát sự chuyển hóa giữa thế năng và động năng',
      type: 'pendulum',
      instruction: 'Kéo con lắc và thả để xem năng lượng chuyển hóa'
    },
    {
      id: 2,
      name: 'Công Cơ Học',
      description: 'Tính toán công thực hiện khi di chuyển vật',
      type: 'work',
      instruction: 'Điều chỉnh lực và quãng đường để đạt công mục tiêu'
    },
    {
      id: 3,
      name: 'Công Suất',
      description: 'Tính công suất khi thực hiện công trong thời gian',
      type: 'power',
      instruction: 'Hoàn thành công việc với công suất cao nhất'
    },
    {
      id: 4,
      name: 'Bảo Toàn Cơ Năng',
      description: 'Chứng minh định luật bảo toàn cơ năng',
      type: 'conservation',
      instruction: 'Thả vật từ các độ cao khác nhau'
    }
  ];

  const currentLevel = levels[level - 1];

  useEffect(() => {
    if (gameState === 'playing') {
      resetLevel();
    }
  }, [gameState, level]);

  useEffect(() => {
    if (gameState === 'playing' && isSimulating) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSimulating, pendulum, gameState]);

  const resetLevel = () => {
    setPendulum({
      angle: Math.PI / 4,
      angleVelocity: 0,
      length: 150,
      mass: 2,
      x: 400,
      y: 100
    });
    setIsSimulating(false);
    setWorkData({
      force: 0,
      distance: 0,
      work: 0,
      power: 0,
      time: 0
    });
  };

  const gameLoop = () => {
    if (currentLevel.type === 'pendulum' || currentLevel.type === 'conservation') {
      updatePendulum();
    }
    drawGame();
    
    if (isSimulating) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const updatePendulum = () => {
    setPendulum(prev => {
      // Pendulum physics using angular acceleration
      const angularAcceleration = -(GRAVITY / prev.length) * Math.sin(prev.angle);
      const newAngleVelocity = prev.angleVelocity + angularAcceleration * 0.016;
      const newAngle = prev.angle + newAngleVelocity * 0.016;

      // Apply damping
      const dampedVelocity = newAngleVelocity * 0.999;

      // Calculate energies
      const height = prev.length * (1 - Math.cos(prev.angle));
      const potentialEnergy = prev.mass * GRAVITY * height;
      const velocity = prev.angleVelocity * prev.length;
      const kineticEnergy = 0.5 * prev.mass * velocity * velocity;
      const totalEnergy = potentialEnergy + kineticEnergy;

      setEnergyData({
        kinetic: kineticEnergy,
        potential: potentialEnergy,
        total: totalEnergy
      });

      return {
        ...prev,
        angle: newAngle,
        angleVelocity: dampedVelocity
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

    if (currentLevel.type === 'pendulum' || currentLevel.type === 'conservation') {
      drawPendulum(ctx, width, height);
    } else if (currentLevel.type === 'work' || currentLevel.type === 'power') {
      drawWorkSimulation(ctx, width, height);
    }

    drawEnergyBars(ctx, width, height);
  };

  const drawPendulum = (ctx, width, height) => {
    const pivotX = pendulum.x;
    const pivotY = pendulum.y;
    const bobX = pivotX + pendulum.length * Math.sin(pendulum.angle);
    const bobY = pivotY + pendulum.length * Math.cos(pendulum.angle);

    // Draw reference line (vertical)
    ctx.strokeStyle = '#ffffff20';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(pivotX, pivotY + pendulum.length);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw string
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Draw pivot
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw bob
    const bobRadius = 20;
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw mass label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${pendulum.mass}kg`, bobX, bobY + 5);

    // Draw height indicator
    const groundY = pivotY + pendulum.length;
    const currentHeight = groundY - bobY;
    
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(bobX, bobY);
    ctx.lineTo(bobX, groundY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#10b981';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`h = ${(currentHeight / 100).toFixed(2)}m`, bobX + 10, (bobY + groundY) / 2);

    // Draw velocity vector
    if (Math.abs(pendulum.angleVelocity) > 0.01) {
      const velocityScale = 30;
      const vx = pendulum.angleVelocity * pendulum.length * Math.cos(pendulum.angle) * velocityScale;
      const vy = -pendulum.angleVelocity * pendulum.length * Math.sin(pendulum.angle) * velocityScale;

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bobX, bobY);
      ctx.lineTo(bobX + vx, bobY + vy);
      ctx.stroke();

      // Arrow head
      const angle = Math.atan2(vy, vx);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(bobX + vx, bobY + vy);
      ctx.lineTo(bobX + vx - 10 * Math.cos(angle - Math.PI / 6), bobY + vy - 10 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(bobX + vx - 10 * Math.cos(angle + Math.PI / 6), bobY + vy - 10 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();

      ctx.font = '12px Arial';
      ctx.fillText('v', bobX + vx + 10, bobY + vy);
    }

    // Ground
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();
  };

  const drawWorkSimulation = (ctx, width, height) => {
    // Draw ground
    const groundY = height - 100;
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, groundY, width, 100);

    // Draw box
    const boxSize = 80;
    const boxX = 100 + (workData.distance / 10) * 500; // Scale distance to canvas
    const boxY = groundY - boxSize;

    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(boxX, boxY, boxSize, boxSize);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX, boxY, boxSize, boxSize);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📦', boxX + boxSize / 2, boxY + boxSize / 2 + 8);

    // Draw force arrow
    if (workData.force > 0) {
      const arrowLength = workData.force * 5;
      const arrowY = boxY + boxSize / 2;

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(boxX - 20, arrowY);
      ctx.lineTo(boxX - 20 + arrowLength, arrowY);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(boxX - 20 + arrowLength, arrowY);
      ctx.lineTo(boxX - 20 + arrowLength - 12, arrowY - 8);
      ctx.lineTo(boxX - 20 + arrowLength - 12, arrowY + 8);
      ctx.closePath();
      ctx.fill();

      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`F = ${workData.force}N`, boxX - 20 + arrowLength / 2, arrowY - 15);
    }

    // Draw distance indicator
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(100, groundY + 50);
    ctx.lineTo(boxX + boxSize / 2, groundY + 50);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#10b981';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`s = ${workData.distance}m`, (100 + boxX + boxSize / 2) / 2, groundY + 70);

    // Formulas
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Công thức:', 50, 40);
    ctx.fillText(`A = F × s = ${workData.work.toFixed(2)} J`, 50, 65);
    if (currentLevel.type === 'power' && workData.time > 0) {
      ctx.fillText(`P = A / t = ${workData.power.toFixed(2)} W`, 50, 90);
    }
  };

  const drawEnergyBars = (ctx, width, height) => {
    const barX = width - 200;
    const barY = 50;
    const barWidth = 180;
    const barHeight = 30;
    const spacing = 10;

    // Background panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(barX - 10, barY - 10, barWidth + 20, 200);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('NĂNG LƯỢNG', barX, barY - 20);

    // Potential Energy
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('Thế năng (J):', barX, barY + 15);
    
    ctx.fillStyle = '#334155';
    ctx.fillRect(barX, barY + 20, barWidth, barHeight);
    
    const peRatio = Math.min(energyData.potential / (energyData.total || 1), 1);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(barX, barY + 20, barWidth * peRatio, barHeight);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY + 20, barWidth, barHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(energyData.potential.toFixed(2), barX + barWidth / 2, barY + 38);

    // Kinetic Energy
    const keY = barY + 70;
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Động năng (J):', barX, keY + 15);
    
    ctx.fillStyle = '#334155';
    ctx.fillRect(barX, keY + 20, barWidth, barHeight);
    
    const keRatio = Math.min(energyData.kinetic / (energyData.total || 1), 1);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(barX, keY + 20, barWidth * keRatio, barHeight);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, keY + 20, barWidth, barHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(energyData.kinetic.toFixed(2), barX + barWidth / 2, keY + 38);

    // Total Energy
    const teY = keY + 70;
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Tổng (J):', barX, teY + 15);
    
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(barX, teY + 20, barWidth, barHeight);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, teY + 20, barWidth, barHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(energyData.total.toFixed(2), barX + barWidth / 2, teY + 38);
  };

  const handleMouseDown = (e) => {
    if (currentLevel.type !== 'pendulum' && currentLevel.type !== 'conservation') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const bobX = pendulum.x + pendulum.length * Math.sin(pendulum.angle);
    const bobY = pendulum.y + pendulum.length * Math.cos(pendulum.angle);
    const dist = Math.hypot(x - bobX, y - bobY);

    if (dist < 30) {
      setIsSimulating(false);
    }
  };

  const handleMouseMove = (e) => {
    if (isSimulating) return;
    if (currentLevel.type !== 'pendulum' && currentLevel.type !== 'conservation') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - pendulum.x;
    const dy = y - pendulum.y;
    const angle = Math.atan2(dx, dy);

    setPendulum(prev => ({
      ...prev,
      angle: angle,
      angleVelocity: 0
    }));

    drawGame();
  };

  const handleMouseUp = () => {
    if (!isSimulating) {
      setIsSimulating(true);
    }
  };

  const calculateWork = () => {
    const work = workData.force * workData.distance;
    const power = workData.time > 0 ? work / workData.time : 0;
    setWorkData(prev => ({ ...prev, work, power }));

    // Check success condition
    if (currentLevel.type === 'work' && work >= 100) {
      setTimeout(() => {
        if (level < levels.length) {
          setLevel(l => l + 1);
          setScore(s => s + 200);
          setGameState('playing');
        } else {
          setScore(s => s + 200);
          setGameState('victory');
        }
      }, 1500);
    } else if (currentLevel.type === 'power' && power >= 50) {
      setTimeout(() => {
        if (level < levels.length) {
          setLevel(l => l + 1);
          setScore(s => s + 200);
          setGameState('playing');
        } else {
          setScore(s => s + 200);
          setGameState('victory');
        }
      }, 1500);
    }
  };

  return (
    <div className="energy-lab">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} />
        Quay lại
      </button>

      <div className="game-header">
        <h1>⚡ Phòng Thí Nghiệm Năng Lượng</h1>
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
            <h2>{currentLevel.name}</h2>
            <p className="level-desc">{currentLevel.description}</p>

            <div className="theory-box">
              <h3>
                <Zap size={20} />
                Khái niệm năng lượng
              </h3>
              <div className="formulas-grid">
                <div className="formula-item">
                  <strong>Thế năng:</strong>
                  <div className="formula">W<sub>t</sub> = mgh</div>
                </div>
                <div className="formula-item">
                  <strong>Động năng:</strong>
                  <div className="formula">W<sub>đ</sub> = ½mv²</div>
                </div>
                <div className="formula-item">
                  <strong>Công cơ học:</strong>
                  <div className="formula">A = F × s</div>
                </div>
                <div className="formula-item">
                  <strong>Công suất:</strong>
                  <div className="formula">P = A / t</div>
                </div>
              </div>
              <div className="conservation-law">
                <TrendingUp size={18} />
                <strong>Định luật bảo toàn cơ năng:</strong> W<sub>t</sub> + W<sub>đ</sub> = const
              </div>
            </div>

            <button className="start-button" onClick={() => setGameState('playing')}>
              <Zap size={20} />
              Bắt đầu thí nghiệm
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="playing-screen">
          <div className="instruction-panel">
            <p>{currentLevel.instruction}</p>
          </div>

          {(currentLevel.type === 'work' || currentLevel.type === 'power') && (
            <div className="controls-panel">
              <div className="control-group">
                <label>Lực (N):</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={workData.force}
                  onChange={(e) => setWorkData(prev => ({ ...prev, force: Number(e.target.value) }))}
                />
                <span>{workData.force}N</span>
              </div>
              <div className="control-group">
                <label>Quãng đường (m):</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={workData.distance}
                  onChange={(e) => setWorkData(prev => ({ ...prev, distance: Number(e.target.value) }))}
                />
                <span>{workData.distance}m</span>
              </div>
              {currentLevel.type === 'power' && (
                <div className="control-group">
                  <label>Thời gian (s):</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={workData.time}
                    onChange={(e) => setWorkData(prev => ({ ...prev, time: Number(e.target.value) }))}
                  />
                  <span>{workData.time}s</span>
                </div>
              )}
              <button className="calculate-button" onClick={calculateWork}>
                Tính toán
              </button>
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="game-canvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      )}

      {gameState === 'victory' && (
        <div className="victory-screen">
          <Trophy size={80} className="trophy-icon" />
          <h2>🎉 Xuất sắc!</h2>
          <p>Bạn đã hiểu rõ về năng lượng và công!</p>
          <div className="victory-stats">
            <div className="stat-item">
              <strong>Tổng điểm:</strong>
              <span>{score}</span>
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

export default EnergyLab;
