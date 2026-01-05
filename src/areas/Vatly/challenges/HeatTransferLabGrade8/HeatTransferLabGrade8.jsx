import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Wind, Sun, Trophy, Thermometer } from 'lucide-react';
import './HeatTransferLabGrade8.css';

const HeatTransferLabGrade8 = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu'); // menu, playing, victory
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);

  // Simulation state
  const [isHeating, setIsHeating] = useState(false);
  const [heatSource, setHeatSource] = useState({ x: 100, y: 400, active: false });
  const [temperatures, setTemperatures] = useState([]);
  const [particles, setParticles] = useState([]);
  const [transferMode, setTransferMode] = useState('conduction');

  const levels = [
    {
      id: 1,
      name: 'Dẫn Nhiệt',
      description: 'Nhiệt truyền qua vật rắn từ nơi nóng đến nơi lạnh',
      mode: 'conduction',
      material: 'metal',
      instruction: 'Bật nguồn nhiệt và quan sát nhiệt truyền qua thanh kim loại',
      targetTemp: 80
    },
    {
      id: 2,
      name: 'Đối Lưu',
      description: 'Nhiệt truyền nhờ dòng chất lỏng hoặc khí',
      mode: 'convection',
      material: 'water',
      instruction: 'Quan sát dòng đối lưu trong nước khi đun nóng',
      targetTemp: 60
    },
    {
      id: 3,
      name: 'Bức Xạ Nhiệt',
      description: 'Nhiệt truyền bằng tia hồng ngoại không cần môi trường',
      mode: 'radiation',
      material: 'air',
      instruction: 'Quan sát bức xạ nhiệt từ nguồn nóng',
      targetTemp: 40
    },
    {
      id: 4,
      name: 'So Sánh 3 Hình Thức',
      description: 'Thử nghiệm và so sánh tốc độ truyền nhiệt',
      mode: 'comparison',
      material: 'all',
      instruction: 'Chọn hình thức truyền nhiệt nhanh nhất',
      targetTemp: 70
    }
  ];

  const currentLevel = levels[level - 1];

  useEffect(() => {
    if (gameState === 'playing') {
      initSimulation();
      setTime(0);
      const interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
      return () => clearInterval(interval);
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
  }, [isHeating, temperatures, particles, gameState]);

  const initSimulation = () => {
    // Initialize temperature grid
    const tempGrid = [];
    for (let i = 0; i < 20; i++) {
      tempGrid.push(20); // Room temperature
    }
    setTemperatures(tempGrid);

    // Initialize particles for convection
    if (currentLevel.mode === 'convection') {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          x: 200 + Math.random() * 400,
          y: 200 + Math.random() * 300,
          vx: 0,
          vy: 0,
          temp: 20
        });
      }
      setParticles(newParticles);
    }

    setIsHeating(false);
    setHeatSource({ x: 100, y: 400, active: false });
  };

  const gameLoop = () => {
    if (isHeating) {
      updateHeatTransfer();
    }
    drawGame();
    
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const updateHeatTransfer = () => {
    if (currentLevel.mode === 'conduction') {
      updateConduction();
    } else if (currentLevel.mode === 'convection') {
      updateConvection();
    } else if (currentLevel.mode === 'radiation') {
      updateRadiation();
    }

    // Check completion
    const avgTemp = temperatures.reduce((sum, t) => sum + t, 0) / temperatures.length;
    if (avgTemp >= currentLevel.targetTemp) {
      setTimeout(() => {
        if (level < levels.length) {
          setLevel(l => l + 1);
          setScore(s => s + Math.max(200 - time * 2, 100));
          setGameState('playing');
        } else {
          setScore(s => s + Math.max(200 - time * 2, 100));
          setGameState('victory');
        }
      }, 2000);
    }
  };

  const updateConduction = () => {
    setTemperatures(prev => {
      const newTemps = [...prev];
      
      // Heat source at position 0
      newTemps[0] = Math.min(newTemps[0] + 2, 100);

      // Heat diffusion through the rod
      for (let i = 1; i < newTemps.length; i++) {
        const tempDiff = newTemps[i - 1] - newTemps[i];
        const heatFlow = tempDiff * 0.05; // Thermal conductivity
        newTemps[i] += heatFlow;
      }

      // Cooling to environment
      for (let i = 0; i < newTemps.length; i++) {
        newTemps[i] = Math.max(newTemps[i] - 0.02, 20);
      }

      return newTemps;
    });
  };

  const updateConvection = () => {
    setParticles(prev => {
      return prev.map(p => {
        let newVx = p.vx;
        let newVy = p.vy;
        
        // Hot particles rise
        if (p.y > 350 && p.x > 100 && p.x < 300) {
          p.temp = Math.min(p.temp + 1, 80);
          newVy = -2; // Rise
        } else if (p.y < 250) {
          p.temp = Math.max(p.temp - 0.5, 20);
          newVy = 1; // Sink
        }

        // Horizontal circulation
        if (p.y < 250) {
          newVx = 1;
        } else if (p.y > 350) {
          newVx = -0.5;
        }

        let newX = p.x + newVx;
        let newY = p.y + newVy;

        // Boundaries
        if (newX < 150) newX = 600;
        if (newX > 600) newX = 150;
        if (newY < 150) newY = 450;
        if (newY > 450) newY = 150;

        return {
          ...p,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy
        };
      });
    });

    // Update temperature array based on particles
    setTemperatures(prev => {
      const newTemps = [...prev];
      const avgParticleTemp = particles.reduce((sum, p) => sum + p.temp, 0) / particles.length;
      for (let i = 0; i < newTemps.length; i++) {
        newTemps[i] = avgParticleTemp || 20;
      }
      return newTemps;
    });
  };

  const updateRadiation = () => {
    setTemperatures(prev => {
      const newTemps = [...prev];
      
      // All positions receive radiation simultaneously
      for (let i = 0; i < newTemps.length; i++) {
        const distance = i * 30;
        const intensity = 100 / (1 + distance / 100); // Inverse square law
        newTemps[i] = Math.min(newTemps[i] + intensity * 0.02, 60);
        newTemps[i] = Math.max(newTemps[i] - 0.05, 20); // Cooling
      }
      
      return newTemps;
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

    if (currentLevel.mode === 'conduction') {
      drawConduction(ctx, width, height);
    } else if (currentLevel.mode === 'convection') {
      drawConvection(ctx, width, height);
    } else if (currentLevel.mode === 'radiation') {
      drawRadiation(ctx, width, height);
    }

    // Draw info panel
    drawInfoPanel(ctx, width, height);
  };

  const drawConduction = (ctx, width, height) => {
    const rodY = height / 2;
    const rodWidth = 600;
    const rodHeight = 60;
    const rodX = 100;

    // Draw rod segments with temperature colors
    const segmentWidth = rodWidth / temperatures.length;
    
    temperatures.forEach((temp, i) => {
      const x = rodX + i * segmentWidth;
      const colorValue = Math.floor(((temp - 20) / 80) * 255);
      ctx.fillStyle = `rgb(${colorValue}, ${100 - colorValue / 3}, ${255 - colorValue})`;
      ctx.fillRect(x, rodY - rodHeight / 2, segmentWidth, rodHeight);
      
      ctx.strokeStyle = '#ffffff40';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, rodY - rodHeight / 2, segmentWidth, rodHeight);

      // Temperature labels
      if (i % 4 === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${temp.toFixed(0)}°C`, x + segmentWidth / 2, rodY + rodHeight);
      }
    });

    // Heat source
    if (isHeating) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(rodX - 20, rodY, 30, 0, Math.PI * 2);
      ctx.fill();

      // Flame effect
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = `rgba(255, ${200 - i * 30}, 0, ${0.7 - i * 0.1})`;
        ctx.beginPath();
        ctx.arc(
          rodX - 20 + (Math.random() - 0.5) * 20,
          rodY + 35 + Math.random() * 20,
          10 - i * 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Thanh kim loại', rodX, rodY - 60);
    ctx.fillText('🔥 Nguồn nhiệt', rodX - 30, rodY + 80);
    ctx.fillText('❄️ Phần lạnh', rodX + rodWidth - 80, rodY + 80);
  };

  const drawConvection = (ctx, width, height) => {
    // Draw container
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.strokeRect(150, 150, 450, 300);

    // Draw water
    ctx.fillStyle = '#3b82f620';
    ctx.fillRect(150, 150, 450, 300);

    // Draw particles
    particles.forEach(p => {
      const colorValue = Math.floor(((p.temp - 20) / 60) * 255);
      ctx.fillStyle = `rgba(${colorValue}, ${150 - colorValue / 3}, ${255 - colorValue}, 0.7)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Velocity trail
      if (Math.abs(p.vx) > 0.1 || Math.abs(p.vy) > 0.1) {
        ctx.strokeStyle = `rgba(${colorValue}, ${150 - colorValue / 3}, ${255 - colorValue}, 0.3)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 10, p.y - p.vy * 10);
        ctx.stroke();
      }
    });

    // Heat source at bottom
    if (isHeating) {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(180, 460, 100, 20);
      
      // Flame
      for (let i = 0; i < 10; i++) {
        ctx.fillStyle = `rgba(255, ${200 - i * 20}, 0, ${0.7 - i * 0.05})`;
        ctx.beginPath();
        ctx.arc(
          200 + i * 10 + Math.random() * 10,
          490 + Math.random() * 15,
          8,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    // Arrows showing circulation
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    
    // Up arrow
    ctx.beginPath();
    ctx.moveTo(230, 400);
    ctx.lineTo(230, 200);
    ctx.stroke();
    drawArrowHead(ctx, 230, 200, -Math.PI / 2);

    // Across arrow
    ctx.beginPath();
    ctx.moveTo(230, 180);
    ctx.lineTo(520, 180);
    ctx.stroke();
    drawArrowHead(ctx, 520, 180, 0);

    // Down arrow
    ctx.beginPath();
    ctx.moveTo(550, 180);
    ctx.lineTo(550, 400);
    ctx.stroke();
    drawArrowHead(ctx, 550, 400, Math.PI / 2);

    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Dòng đối lưu', 400, 130);
  };

  const drawRadiation = (ctx, width, height) => {
    const sourceX = 150;
    const sourceY = height / 2;

    // Draw heat source (sun-like)
    if (isHeating) {
      const gradient = ctx.createRadialGradient(sourceX, sourceY, 0, sourceX, sourceY, 60);
      gradient.addColorStop(0, '#fbbf24');
      gradient.addColorStop(0.5, '#f59e0b');
      gradient.addColorStop(1, '#ef444400');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(sourceX, sourceY, 60, 0, Math.PI * 2);
      ctx.fill();

      // Radiation waves
      for (let i = 0; i < 5; i++) {
        const radius = 70 + i * 40 + (time * 20) % 40;
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.5 - i * 0.1})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(sourceX, sourceY, radius, -Math.PI / 4, Math.PI / 4);
        ctx.stroke();
      }
    }

    // Draw objects receiving radiation
    const objects = [
      { x: 350, y: sourceY - 80, label: 'Vật 1' },
      { x: 500, y: sourceY, label: 'Vật 2' },
      { x: 650, y: sourceY + 80, label: 'Vật 3' }
    ];

    objects.forEach((obj, i) => {
      const temp = temperatures[i * 5] || 20;
      const colorValue = Math.floor(((temp - 20) / 40) * 255);
      
      ctx.fillStyle = `rgb(${colorValue}, ${100 - colorValue / 3}, ${255 - colorValue})`;
      ctx.fillRect(obj.x - 30, obj.y - 30, 60, 60);
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(obj.x - 30, obj.y - 30, 60, 60);

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(obj.label, obj.x, obj.y);
      ctx.fillText(`${temp.toFixed(0)}°C`, obj.x, obj.y + 15);

      // Radiation rays
      if (isHeating) {
        ctx.strokeStyle = '#fbbf2440';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sourceX, sourceY);
        ctx.lineTo(obj.x, obj.y);
        ctx.stroke();
      }
    });

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('☀️ Nguồn bức xạ', sourceX - 20, sourceY + 80);
  };

  const drawArrowHead = (ctx, x, y, angle) => {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 10 * Math.cos(angle - Math.PI / 6), y - 10 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x - 10 * Math.cos(angle + Math.PI / 6), y - 10 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  };

  const drawInfoPanel = (ctx, width, height) => {
    const panelX = width - 180;
    const panelY = 20;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(panelX, panelY, 160, 150);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(panelX, panelY, 160, 150);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('THÔNG TIN', panelX + 10, panelY + 25);

    ctx.font = '12px Arial';
    const avgTemp = temperatures.reduce((sum, t) => sum + t, 0) / temperatures.length;
    ctx.fillText(`Nhiệt độ TB: ${avgTemp.toFixed(1)}°C`, panelX + 10, panelY + 50);
    ctx.fillText(`Mục tiêu: ${currentLevel.targetTemp}°C`, panelX + 10, panelY + 70);
    ctx.fillText(`Thời gian: ${time}s`, panelX + 10, panelY + 90);

    const progress = Math.min((avgTemp / currentLevel.targetTemp) * 100, 100);
    ctx.fillStyle = '#334155';
    ctx.fillRect(panelX + 10, panelY + 105, 140, 20);
    
    ctx.fillStyle = '#10b981';
    ctx.fillRect(panelX + 10, panelY + 105, 140 * (progress / 100), 20);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(panelX + 10, panelY + 105, 140, 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${progress.toFixed(0)}%`, panelX + 80, panelY + 120);
  };

  const toggleHeating = () => {
    setIsHeating(prev => !prev);
  };

  return (
    <div className="heat-transfer-lab-grade8">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} />
        Quay lại
      </button>

      <div className="game-header">
        <h1>🔥 Thí Nghiệm Truyền Nhiệt</h1>
        <div className="game-info">
          <span className="level-badge">Cấp {level}</span>
          <span className="score-badge">
            <Thermometer size={16} />
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
              <h3>🔬 Ba hình thức truyền nhiệt</h3>
              <div className="transfer-modes">
                <div className="mode-card conduction">
                  <Flame size={24} />
                  <strong>Dẫn nhiệt</strong>
                  <p>Nhiệt truyền qua vật rắn, phân tử va chạm nhau</p>
                  <span className="speed">Tốc độ: Trung bình</span>
                </div>
                <div className="mode-card convection">
                  <Wind size={24} />
                  <strong>Đối lưu</strong>
                  <p>Nhiệt truyền nhờ dòng chất lỏng/khí chuyển động</p>
                  <span className="speed">Tốc độ: Nhanh</span>
                </div>
                <div className="mode-card radiation">
                  <Sun size={24} />
                  <strong>Bức xạ nhiệt</strong>
                  <p>Nhiệt truyền bằng sóng điện từ, không cần môi trường</p>
                  <span className="speed">Tốc độ: Rất nhanh</span>
                </div>
              </div>
            </div>

            <button className="start-button" onClick={() => setGameState('playing')}>
              <Flame size={20} />
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

          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="game-canvas"
          />

          <div className="controls-panel">
            <button 
              className={`heat-button ${isHeating ? 'active' : ''}`}
              onClick={toggleHeating}
            >
              <Flame size={20} />
              {isHeating ? 'Tắt nguồn nhiệt' : 'Bật nguồn nhiệt'}
            </button>
            
            <div className="mode-indicator">
              <strong>Hình thức:</strong>
              <span className={`mode-tag ${currentLevel.mode}`}>
                {currentLevel.mode === 'conduction' ? '🔥 Dẫn nhiệt' :
                 currentLevel.mode === 'convection' ? '💨 Đối lưu' :
                 '☀️ Bức xạ'}
              </span>
            </div>
          </div>
        </div>
      )}

      {gameState === 'victory' && (
        <div className="victory-screen">
          <Trophy size={80} className="trophy-icon" />
          <h2>🎉 Hoàn thành!</h2>
          <p>Bạn đã hiểu rõ về truyền nhiệt!</p>
          <div className="victory-stats">
            <div className="stat-item">
              <strong>Tổng điểm:</strong>
              <span>{score}</span>
            </div>
            <div className="stat-item">
              <strong>Thời gian:</strong>
              <span>{time}s</span>
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

export default HeatTransferLabGrade8;
