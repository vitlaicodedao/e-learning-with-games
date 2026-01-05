import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplet, Wind, Trophy, Gauge } from 'lucide-react';
import './PressureMaster.css';

const PressureMaster = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu'); // menu, playing, victory
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);

  // Game mechanics
  const [selectedTool, setSelectedTool] = useState(null); // weight, liquid, piston
  const [containers, setContainers] = useState([]);
  const [weights, setWeights] = useState([]);
  const [liquidLevel, setLiquidLevel] = useState(0);
  const [targetPressure, setTargetPressure] = useState(0);
  const [currentPressure, setCurrentPressure] = useState(0);
  const [tolerance, setTolerance] = useState(10);

  const levels = [
    {
      id: 1,
      name: 'Áp Suất Cơ Bản',
      description: 'Tạo áp suất bằng cách đặt vật nặng',
      mode: 'solid',
      targetPressure: 5000,
      tolerance: 500,
      area: 0.01, // 100cm²
      maxWeights: 3
    },
    {
      id: 2,
      name: 'Áp Suất Chất Lỏng',
      description: 'Điều chỉnh độ cao cột nước để đạt áp suất',
      mode: 'liquid',
      targetPressure: 9810, // ρgh, h=1m
      tolerance: 500,
      density: 1000, // kg/m³
      gravity: 9.81
    },
    {
      id: 3,
      name: 'Bình Thông Nhau',
      description: 'Cân bằng áp suất trong bình thông nhau',
      mode: 'connected',
      targetPressure: 4905,
      tolerance: 300,
      containers: 2
    },
    {
      id: 4,
      name: 'Áp Suất Khí Quyển',
      description: 'Mô phỏng áp suất ở các độ cao khác nhau',
      mode: 'atmospheric',
      targetPressure: 101325, // Pa at sea level
      tolerance: 5000,
      altitudes: [0, 1000, 2000, 3000]
    }
  ];

  const currentLevel = levels[level - 1];

  useEffect(() => {
    if (gameState === 'playing') {
      resetLevel();
      const interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, level]);

  useEffect(() => {
    if (gameState === 'playing') {
      animate();
    }
  }, [currentPressure, liquidLevel, weights, gameState]);

  const resetLevel = () => {
    setWeights([]);
    setLiquidLevel(0);
    setCurrentPressure(0);
    setTargetPressure(currentLevel.targetPressure);
    setTolerance(currentLevel.tolerance);
    setSelectedTool(null);
    setTime(0);
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);

    // Draw based on mode
    if (currentLevel.mode === 'solid') {
      drawSolidPressure(ctx, width, height);
    } else if (currentLevel.mode === 'liquid') {
      drawLiquidPressure(ctx, width, height);
    } else if (currentLevel.mode === 'connected') {
      drawConnectedVessels(ctx, width, height);
    } else if (currentLevel.mode === 'atmospheric') {
      drawAtmospheric(ctx, width, height);
    }

    // Draw pressure gauge
    drawPressureGauge(ctx, width, height);
  };

  const drawSolidPressure = (ctx, width, height) => {
    // Draw surface
    const surfaceY = height - 150;
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, surfaceY, width, 150);

    // Draw area rectangle
    const areaX = width / 2 - 50;
    const areaY = surfaceY - 100;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(areaX, areaY, 100, 100);
    ctx.setLineDash([]);

    // Draw weights
    weights.forEach((w, index) => {
      const y = surfaceY - 110 - index * 40;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(areaX + 10, y, 80, 35);
      
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.strokeRect(areaX + 10, y, 80, 35);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${w}kg`, areaX + 50, y + 22);
    });

    // Draw formula
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Công thức: P = F / A', 20, 30);
    ctx.fillText(`Diện tích: A = ${(currentLevel.area * 10000).toFixed(0)} cm²`, 20, 55);
    
    const totalMass = weights.reduce((sum, w) => sum + w, 0);
    const force = totalMass * 9.81;
    const pressure = currentLevel.area > 0 ? force / currentLevel.area : 0;
    setCurrentPressure(pressure);
  };

  const drawLiquidPressure = (ctx, width, height) => {
    // Container
    const containerX = width / 2 - 100;
    const containerY = 100;
    const containerWidth = 200;
    const containerHeight = 400;

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.strokeRect(containerX, containerY, containerWidth, containerHeight);

    // Water
    const waterHeight = (liquidLevel / 100) * containerHeight;
    const waterY = containerY + containerHeight - waterHeight;
    
    const gradient = ctx.createLinearGradient(0, waterY, 0, containerY + containerHeight);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#1e40af');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(containerX, waterY, containerWidth, waterHeight);

    // Water level marker
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(containerX - 30, waterY);
    ctx.lineTo(containerX + containerWidth + 30, waterY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`h = ${(liquidLevel / 100).toFixed(2)}m`, containerX - 40, waterY + 5);

    // Depth markers
    for (let i = 0; i <= 4; i++) {
      const y = containerY + (containerHeight / 4) * i;
      ctx.strokeStyle = '#ffffff33';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(containerX, y);
      ctx.lineTo(containerX + containerWidth, y);
      ctx.stroke();

      ctx.fillStyle = '#ffffff66';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`${((4 - i) * 0.25).toFixed(2)}m`, containerX + containerWidth + 10, y + 4);
    }

    // Formula
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Công thức: P = ρgh', width / 2, 30);
    ctx.fillText(`ρ = ${currentLevel.density} kg/m³`, width / 2, 55);
    ctx.fillText(`g = ${currentLevel.gravity} m/s²`, width / 2, 80);

    // Calculate pressure
    const h = liquidLevel / 100; // meters
    const pressure = currentLevel.density * currentLevel.gravity * h;
    setCurrentPressure(pressure);
  };

  const drawConnectedVessels = (ctx, width, height) => {
    // Two containers connected at bottom
    const container1X = width / 3 - 75;
    const container2X = 2 * width / 3 - 75;
    const containerWidth = 150;
    const containerHeight = 300;
    const containerY = 150;

    // Container 1
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.strokeRect(container1X, containerY, containerWidth, containerHeight);

    // Container 2
    ctx.strokeRect(container2X, containerY, containerWidth, containerHeight);

    // Connecting pipe
    const pipeY = containerY + containerHeight - 20;
    ctx.fillStyle = '#475569';
    ctx.fillRect(container1X + containerWidth, pipeY, container2X - (container1X + containerWidth), 40);
    ctx.strokeRect(container1X + containerWidth, pipeY, container2X - (container1X + containerWidth), 40);

    // Water in both containers (same level due to connected vessels)
    const waterHeight = (liquidLevel / 100) * containerHeight;
    const waterY = containerY + containerHeight - waterHeight;

    const gradient = ctx.createLinearGradient(0, waterY, 0, containerY + containerHeight);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#1e40af');

    ctx.fillStyle = gradient;
    ctx.fillRect(container1X, waterY, containerWidth, waterHeight);
    ctx.fillRect(container2X, waterY, containerWidth, waterHeight);

    // Water level line
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(container1X, waterY);
    ctx.lineTo(container2X + containerWidth, waterY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Bình 1', container1X + containerWidth / 2, containerY - 10);
    ctx.fillText('Bình 2', container2X + containerWidth / 2, containerY - 10);

    ctx.font = '14px Arial';
    ctx.fillText('Bình thông nhau', width / 2, 30);
    ctx.fillText('Mực nước luôn bằng nhau', width / 2, 55);

    const h = liquidLevel / 100;
    const pressure = 1000 * 9.81 * h;
    setCurrentPressure(pressure);
  };

  const drawAtmospheric = (ctx, width, height) => {
    // Atmosphere layers
    const layers = [
      { altitude: 0, pressure: 101325, color: '#3b82f6', name: 'Mực nước biển' },
      { altitude: 1000, pressure: 89876, color: '#60a5fa', name: '1000m' },
      { altitude: 2000, pressure: 79501, color: '#93c5fd', name: '2000m' },
      { altitude: 3000, pressure: 70121, color: '#bfdbfe', name: '3000m' }
    ];

    const layerHeight = height / layers.length;

    layers.forEach((layer, index) => {
      const y = height - (index + 1) * layerHeight;
      
      ctx.fillStyle = layer.color + '44';
      ctx.fillRect(0, y, width, layerHeight);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(layer.name, 20, y + 30);
      ctx.font = '14px Arial';
      ctx.fillText(`P = ${layer.pressure.toFixed(0)} Pa`, 20, y + 55);
    });

    // Airplane
    const altitudeIndex = Math.floor(liquidLevel / 25);
    const planeY = height - (altitudeIndex + 0.5) * layerHeight;
    ctx.fillStyle = '#fbbf24';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✈️', width / 2, planeY);

    if (altitudeIndex < layers.length) {
      setCurrentPressure(layers[altitudeIndex].pressure);
    }
  };

  const drawPressureGauge = (ctx, width, height) => {
    const gaugeX = width - 180;
    const gaugeY = 20;
    const gaugeWidth = 160;
    const gaugeHeight = 200;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(gaugeX, gaugeY, gaugeWidth, gaugeHeight);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(gaugeX, gaugeY, gaugeWidth, gaugeHeight);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ÁP KẾ', gaugeX + gaugeWidth / 2, gaugeY + 25);

    // Target pressure
    ctx.font = '12px Arial';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`Mục tiêu: ${targetPressure.toFixed(0)} Pa`, gaugeX + gaugeWidth / 2, gaugeY + 50);

    // Current pressure
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`${currentPressure.toFixed(0)} Pa`, gaugeX + gaugeWidth / 2, gaugeY + 80);

    // Pressure bar
    const barX = gaugeX + 20;
    const barY = gaugeY + 100;
    const barWidth = gaugeWidth - 40;
    const barHeight = 30;

    ctx.fillStyle = '#334155';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    const ratio = Math.min(currentPressure / targetPressure, 1);
    const fillWidth = ratio * barWidth;

    const diff = Math.abs(currentPressure - targetPressure);
    const isClose = diff <= tolerance;
    
    ctx.fillStyle = isClose ? '#10b981' : '#3b82f6';
    ctx.fillRect(barX, barY, fillWidth, barHeight);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // Status
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    if (isClose) {
      ctx.fillStyle = '#10b981';
      ctx.fillText('✓ ĐẠT YÊU CẦU', gaugeX + gaugeWidth / 2, gaugeY + 155);
    } else {
      ctx.fillStyle = '#ef4444';
      const diff = targetPressure - currentPressure;
      if (diff > 0) {
        ctx.fillText(`↑ Cần tăng ${diff.toFixed(0)} Pa`, gaugeX + gaugeWidth / 2, gaugeY + 155);
      } else {
        ctx.fillText(`↓ Cần giảm ${Math.abs(diff).toFixed(0)} Pa`, gaugeX + gaugeWidth / 2, gaugeY + 155);
      }
    }

    // Check victory
    if (isClose && gameState === 'playing') {
      setTimeout(() => {
        if (level < levels.length) {
          setLevel(l => l + 1);
          setScore(s => s + Math.max(1000 - time * 10, 500));
          setGameState('playing');
        } else {
          setScore(s => s + Math.max(1000 - time * 10, 500));
          setGameState('victory');
        }
      }, 1000);
    }
  };

  const addWeight = (mass) => {
    if (weights.length < currentLevel.maxWeights) {
      setWeights([...weights, mass]);
    }
  };

  const adjustLiquid = (change) => {
    setLiquidLevel(Math.max(0, Math.min(100, liquidLevel + change)));
  };

  return (
    <div className="pressure-master">
      <button onClick={() => navigate(-1)} className="back-button">
        <ArrowLeft size={20} />
        Quay lại
      </button>

      <div className="game-header">
        <h1>⚗️ Bậc Thầy Áp Suất</h1>
        <div className="game-info">
          <span className="level-badge">Cấp {level}</span>
          <span className="score-badge">
            <Gauge size={16} />
            {score} điểm
          </span>
          <span className="time-badge">{time}s</span>
        </div>
      </div>

      {gameState === 'menu' && (
        <div className="menu-screen">
          <div className="intro-card">
            <h2>{currentLevel.name}</h2>
            <p className="level-desc">{currentLevel.description}</p>

            <div className="formulas">
              <h3>📐 Công thức áp suất:</h3>
              <ul>
                <li><strong>Áp suất chất rắn:</strong> P = F/A (Pa)</li>
                <li><strong>Áp suất chất lỏng:</strong> P = ρgh (Pa)</li>
                <li><strong>Bình thông nhau:</strong> P₁ = P₂</li>
                <li><strong>Áp suất khí quyển:</strong> Giảm theo độ cao</li>
              </ul>
            </div>

            <button className="start-button" onClick={() => setGameState('playing')}>
              <Droplet size={20} />
              Bắt đầu thử nghiệm
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="playing-screen">
          <div className="controls-panel">
            <h3>Điều khiển:</h3>
            {currentLevel.mode === 'solid' && (
              <div className="weight-controls">
                <button onClick={() => addWeight(10)}>Thêm 10kg</button>
                <button onClick={() => addWeight(20)}>Thêm 20kg</button>
                <button onClick={() => addWeight(50)}>Thêm 50kg</button>
                <button onClick={() => setWeights([])}>Xóa hết</button>
              </div>
            )}
            {(currentLevel.mode === 'liquid' || currentLevel.mode === 'connected') && (
              <div className="liquid-controls">
                <button onClick={() => adjustLiquid(10)}>
                  <Wind size={16} /> Tăng mực nước
                </button>
                <button onClick={() => adjustLiquid(-10)}>
                  <Droplet size={16} /> Giảm mực nước
                </button>
                <div className="liquid-slider">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={liquidLevel}
                    onChange={(e) => setLiquidLevel(Number(e.target.value))}
                  />
                  <span>{liquidLevel}%</span>
                </div>
              </div>
            )}
            {currentLevel.mode === 'atmospheric' && (
              <div className="altitude-controls">
                <button onClick={() => adjustLiquid(25)}>Tăng độ cao</button>
                <button onClick={() => adjustLiquid(-25)}>Giảm độ cao</button>
              </div>
            )}
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={550}
            className="game-canvas"
          />
        </div>
      )}

      {gameState === 'victory' && (
        <div className="victory-screen">
          <Trophy size={80} className="trophy-icon" />
          <h2>🎉 Xuất sắc!</h2>
          <p>Bạn đã thành thạo các kiến thức về áp suất!</p>
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

export default PressureMaster;
