import React, { useState, useEffect, useRef } from 'react';
import { Home, Play, RotateCw, Trophy, Zap, Factory } from 'lucide-react';
import './PowerPlantManager.css';

/**
 * Power Plant Manager - Grade 9 Physics Game
 * Manage multiple power generation sources
 * Physics: Power generation efficiency, renewable vs non-renewable energy
 */

const PowerPlantManager = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Game variables
  const [score, setScore] = useState(0);
  const [money, setMoney] = useState(10000); // Starting budget
  const [timeLeft, setTimeLeft] = useState(300);
  const [gameTime, setGameTime] = useState(0);

  // Power demand (varies over time)
  const [powerDemand, setPowerDemand] = useState(100); // MW
  const [powerSupply, setPowerSupply] = useState(0);

  // Environmental impact
  const [co2Emissions, setCo2Emissions] = useState(0); // tons/hour
  const [environmentScore, setEnvironmentScore] = useState(100);

  // Power plants
  const [plants, setPlants] = useState([]);

  // Plant types
  const plantTypes = [
    {
      id: 'coal',
      name: 'Nhiệt điện than',
      cost: 5000,
      operatingCost: 50, // per hour
      maxPower: 100, // MW
      efficiency: 35, // %
      co2Rate: 80, // tons CO2/hour at max
      buildTime: 2, // seconds
      color: '#6b7280',
      renewable: false
    },
    {
      id: 'gas',
      name: 'Nhiệt điện khí',
      cost: 4000,
      operatingCost: 60,
      maxPower: 80,
      efficiency: 45,
      co2Rate: 40,
      buildTime: 1.5,
      color: '#f59e0b',
      renewable: false
    },
    {
      id: 'hydro',
      name: 'Thủy điện',
      cost: 8000,
      operatingCost: 10,
      maxPower: 120,
      efficiency: 85,
      co2Rate: 0,
      buildTime: 3,
      color: '#3b82f6',
      renewable: true
    },
    {
      id: 'wind',
      name: 'Điện gió',
      cost: 6000,
      operatingCost: 15,
      maxPower: 50,
      efficiency: 40,
      co2Rate: 0,
      buildTime: 2,
      color: '#06b6d4',
      renewable: true
    },
    {
      id: 'solar',
      name: 'Điện mặt trời',
      cost: 7000,
      operatingCost: 5,
      maxPower: 60,
      efficiency: 20,
      co2Rate: 0,
      buildTime: 1,
      color: '#fbbf24',
      renewable: true
    },
    {
      id: 'nuclear',
      name: 'Hạt nhân',
      cost: 15000,
      operatingCost: 30,
      maxPower: 200,
      efficiency: 33,
      co2Rate: 0,
      buildTime: 5,
      color: '#10b981',
      renewable: false
    }
  ];

  // Level configurations
  const levels = [
    {
      id: 1,
      name: 'Cơ bản - Nhiệt điện',
      description: 'Học cách quản lý nhà máy điện cơ bản',
      duration: 300,
      startMoney: 10000,
      targetPower: 100,
      allowedPlants: ['coal', 'gas'],
      targetScore: 1000
    },
    {
      id: 2,
      name: 'Trung bình - Năng lượng tái tạo',
      description: 'Kết hợp nhiều nguồn năng lượng',
      duration: 360,
      startMoney: 15000,
      targetPower: 200,
      allowedPlants: ['coal', 'gas', 'hydro', 'wind'],
      targetScore: 2000
    },
    {
      id: 3,
      name: 'Nâng cao - Năng lượng sạch',
      description: 'Tối ưu hóa hiệu suất và môi trường',
      duration: 420,
      startMoney: 20000,
      targetPower: 300,
      allowedPlants: ['coal', 'gas', 'hydro', 'wind', 'solar'],
      targetScore: 3000
    },
    {
      id: 4,
      name: 'Chuyên gia - Hạt nhân',
      description: 'Quản lý hệ thống điện phức tạp',
      duration: 480,
      startMoney: 30000,
      targetPower: 400,
      allowedPlants: ['coal', 'gas', 'hydro', 'wind', 'solar', 'nuclear'],
      targetScore: 5000
    }
  ];

  const currentLevel = levels[selectedLevel - 1];

  // Calculate power supply and emissions
  useEffect(() => {
    if (gameState !== 'playing') return;

    let totalPower = 0;
    let totalEmissions = 0;
    let totalOperatingCost = 0;

    plants.forEach(plant => {
      if (plant.status === 'active') {
        const plantType = plantTypes.find(pt => pt.id === plant.type);
        const power = plantType.maxPower * (plant.powerLevel / 100);
        totalPower += power;
        totalEmissions += plantType.co2Rate * (plant.powerLevel / 100);
        totalOperatingCost += plantType.operatingCost * (plant.powerLevel / 100);
      }
    });

    setPowerSupply(totalPower);
    setCo2Emissions(totalEmissions);

    // Update score based on performance
    const powerBalance = Math.min(totalPower / powerDemand, 1);
    const emissionPenalty = totalEmissions / 100;
    const scoreGain = Math.floor(powerBalance * 10 - emissionPenalty * 5);
    
    if (scoreGain > 0) {
      setScore(prev => prev + scoreGain);
    }

    // Update environment score
    setEnvironmentScore(prev => {
      const change = -totalEmissions * 0.01 + 0.1;
      return Math.max(0, Math.min(100, prev + change));
    });

    // Deduct operating costs
    setMoney(prev => Math.max(0, prev - totalOperatingCost / 10));

  }, [plants, gameState, powerDemand]);

  // Dynamic power demand
  useEffect(() => {
    if (gameState !== 'playing') return;

    const updateDemand = () => {
      // Simulate varying demand throughout the day
      const hour = (gameTime / 30) % 24; // 30 seconds = 1 hour in game
      
      // Peak hours: 6-9 AM and 6-10 PM
      let demandMultiplier = 0.7;
      if ((hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 22)) {
        demandMultiplier = 1.3;
      } else if (hour >= 10 && hour <= 17) {
        demandMultiplier = 1.0;
      }
      
      const baseDemand = currentLevel.targetPower;
      const newDemand = baseDemand * demandMultiplier;
      setPowerDemand(newDemand);
    };

    updateDemand();
    const interval = setInterval(updateDemand, 1000);

    return () => clearInterval(interval);
  }, [gameTime, gameState, currentLevel]);

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
      setGameTime(prev => prev + 1);
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

    // Clear canvas
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);

    if (gameState === 'playing') {
      drawGrid(ctx, width, height);
      drawPlants(ctx, width, height);
      drawPowerGraph(ctx, width, height);
    }
  }, [plants, powerDemand, powerSupply, gameState, gameTime]);

  const drawGrid = (ctx, width, height) => {
    // Ground line
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height - 100);
    ctx.lineTo(width, height - 100);
    ctx.stroke();

    // Grid dots
    ctx.fillStyle = '#374151';
    for (let x = 50; x < width; x += 50) {
      for (let y = height - 100; y > 100; y -= 50) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawPlants = (ctx, width, height) => {
    const groundY = height - 100;
    const plantWidth = 80;
    const spacing = 100;

    plants.forEach((plant, index) => {
      const plantType = plantTypes.find(pt => pt.id === plant.type);
      const x = 50 + index * spacing;
      const y = groundY;

      if (plant.status === 'building') {
        // Building animation
        const progress = (gameTime - plant.buildStartTime) / plantType.buildTime;
        const buildHeight = 60 * Math.min(progress, 1);
        
        ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        ctx.fillRect(x - plantWidth / 2, y - buildHeight, plantWidth, buildHeight);
        
        // Progress text
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.floor(progress * 100)}%`, x, y - buildHeight - 10);
        
      } else if (plant.status === 'active') {
        // Plant building
        const plantHeight = 60;
        ctx.fillStyle = plantType.color;
        ctx.fillRect(x - plantWidth / 2, y - plantHeight, plantWidth, plantHeight);
        
        // Chimney/tower for certain types
        if (['coal', 'gas', 'nuclear'].includes(plantType.id)) {
          ctx.fillStyle = '#6b7280';
          ctx.fillRect(x - 10, y - plantHeight - 40, 20, 40);
          
          // Smoke for fossil fuels
          if (['coal', 'gas'].includes(plantType.id) && plant.powerLevel > 0) {
            const smokeIntensity = plant.powerLevel / 100;
            ctx.fillStyle = `rgba(150, 150, 150, ${smokeIntensity * 0.5})`;
            for (let i = 0; i < 3; i++) {
              const offset = (gameTime * 20 + i * 20) % 60;
              ctx.beginPath();
              ctx.arc(x, y - plantHeight - 40 - offset, 8 + offset / 10, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Wind turbine blades
        if (plantType.id === 'wind') {
          ctx.save();
          ctx.translate(x, y - plantHeight / 2);
          ctx.rotate(gameTime * 2 * (plant.powerLevel / 100));
          
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 4;
          for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * 30, Math.sin(angle) * 30);
            ctx.stroke();
          }
          ctx.restore();
        }

        // Solar panels
        if (plantType.id === 'solar') {
          ctx.fillStyle = '#1e40af';
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
              ctx.fillRect(
                x - 30 + col * 16,
                y - plantHeight + row * 18,
                14,
                16
              );
            }
          }
        }

        // Water flow for hydro
        if (plantType.id === 'hydro') {
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          for (let i = 0; i < 3; i++) {
            const offset = (gameTime * 30 + i * 20) % 60;
            ctx.beginPath();
            ctx.moveTo(x - 40, y - plantHeight + offset);
            ctx.lineTo(x - 40, y - plantHeight + offset + 10);
            ctx.stroke();
          }
        }

        // Power level indicator
        ctx.fillStyle = '#fbbf24';
        const indicatorHeight = 40;
        const powerHeight = indicatorHeight * (plant.powerLevel / 100);
        ctx.fillRect(x + plantWidth / 2 + 5, y - powerHeight, 10, powerHeight);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(x + plantWidth / 2 + 5, y - indicatorHeight, 10, indicatorHeight);

        // Plant name
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(plantType.name, x, y + 15);
        ctx.fillText(`${plant.powerLevel}%`, x, y + 28);
      }
    });
  };

  const drawPowerGraph = (ctx, width, height) => {
    const graphX = width - 250;
    const graphY = 50;
    const graphWidth = 220;
    const graphHeight = 100;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(graphX, graphY, graphWidth, graphHeight);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(graphX, graphY, graphWidth, graphHeight);

    // Title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Cung - Cầu điện', graphX + graphWidth / 2, graphY - 10);

    // Demand line
    const demandY = graphY + graphHeight - 10;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(graphX + 10, demandY - (powerDemand / currentLevel.targetPower) * (graphHeight - 40));
    ctx.lineTo(graphX + graphWidth - 10, demandY - (powerDemand / currentLevel.targetPower) * (graphHeight - 40));
    ctx.stroke();
    ctx.setLineDash([]);

    // Supply bar
    const supplyHeight = (powerSupply / currentLevel.targetPower) * (graphHeight - 40);
    const supplyColor = powerSupply >= powerDemand ? '#10b981' : '#fbbf24';
    ctx.fillStyle = supplyColor;
    ctx.fillRect(graphX + graphWidth / 2 - 20, demandY - supplyHeight, 40, supplyHeight);

    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Cầu: ${powerDemand.toFixed(0)} MW`, graphX + 10, graphY + 20);
    ctx.fillText(`Cung: ${powerSupply.toFixed(0)} MW`, graphX + 10, graphY + 35);
    
    const balance = ((powerSupply / powerDemand) * 100).toFixed(0);
    ctx.fillStyle = powerSupply >= powerDemand ? '#10b981' : '#ef4444';
    ctx.fillText(`Đáp ứng: ${balance}%`, graphX + 10, graphY + 50);
  };

  const buildPlant = (plantTypeId) => {
    const plantType = plantTypes.find(pt => pt.id === plantTypeId);
    if (!plantType) return;

    if (money < plantType.cost) {
      alert('Không đủ tiền!');
      return;
    }

    const newPlant = {
      id: Date.now(),
      type: plantTypeId,
      status: 'building',
      buildStartTime: gameTime,
      powerLevel: 0
    };

    setPlants(prev => [...prev, newPlant]);
    setMoney(prev => prev - plantType.cost);

    // Auto-complete building after build time
    setTimeout(() => {
      setPlants(prev =>
        prev.map(p =>
          p.id === newPlant.id ? { ...p, status: 'active', powerLevel: 100 } : p
        )
      );
    }, plantType.buildTime * 1000);
  };

  const adjustPower = (plantId, delta) => {
    setPlants(prev =>
      prev.map(p =>
        p.id === plantId && p.status === 'active'
          ? { ...p, powerLevel: Math.max(0, Math.min(100, p.powerLevel + delta)) }
          : p
      )
    );
  };

  const removePlant = (plantId) => {
    setPlants(prev => prev.filter(p => p.id !== plantId));
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setMoney(currentLevel.startMoney);
    setTimeLeft(currentLevel.duration);
    setGameTime(0);
    setPlants([]);
    setPowerDemand(currentLevel.targetPower);
    setPowerSupply(0);
    setCo2Emissions(0);
    setEnvironmentScore(100);
  };

  const returnToMenu = () => {
    setGameState('menu');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGameHour = () => {
    return Math.floor((gameTime / 30) % 24);
  };

  // Render menu screen
  if (gameState === 'menu') {
    return (
      <div className="power-plant-manager">
        <header className="game-header">
          <button className="back-button" onClick={() => window.history.back()}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <Factory className="title-icon" size={40} />
            Quản Lý Nhà Máy Điện
          </h1>
        </header>

        <div className="menu-screen">
          <div className="menu-content">
            <Factory className="menu-icon" size={80} />
            <h2>Quản Lý Nhà Máy Điện</h2>
            <p className="menu-description">
              Xây dựng và quản lý hệ thống phát điện, cân bằng hiệu quả và môi trường
            </p>

            <div className="theory-box">
              <h3>📚 Lý thuyết</h3>
              
              <div className="theory-section">
                <div className="theory-item">
                  <h4>⚡ Phát điện</h4>
                  <p><strong>Công suất:</strong> P = W/t (MW)</p>
                  <p><strong>Hiệu suất:</strong> H = (W_out/W_in) × 100%</p>
                  <p>Năng lượng đầu vào → Điện năng + Nhiệt thất thoát</p>
                </div>

                <div className="theory-item">
                  <h4>🏭 Các loại nhà máy</h4>
                  <p><strong>Nhiệt điện:</strong> Đốt than/khí → Nhiệt → Điện (H: 35-45%)</p>
                  <p><strong>Thủy điện:</strong> Thế năng nước → Điện (H: 85%)</p>
                  <p><strong>Điện gió:</strong> Động năng gió → Điện (H: 40%)</p>
                  <p><strong>Điện mặt trời:</strong> Ánh sáng → Điện (H: 20%)</p>
                  <p><strong>Hạt nhân:</strong> Năng lượng hạt nhân → Điện (H: 33%)</p>
                </div>

                <div className="theory-item">
                  <h4>🌍 Môi trường</h4>
                  <p><strong>Năng lượng tái tạo:</strong> Thủy, gió, mặt trời - không phát thải CO₂</p>
                  <p><strong>Năng lượng hóa thạch:</strong> Than, khí - phát thải CO₂</p>
                  <p><strong>Phát triển bền vững:</strong> Cân bằng hiệu quả kinh tế và bảo vệ môi trường</p>
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
                      💰 Ngân sách: ${level.startMoney} | 🎯 Công suất: {level.targetPower} MW
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

  // Render victory screen
  if (gameState === 'victory') {
    const success = score >= currentLevel.targetScore;
    
    return (
      <div className="power-plant-manager">
        <header className="game-header">
          <button className="back-button" onClick={returnToMenu}>
            <Home size={20} />
            <span>Menu</span>
          </button>
          <h1 className="game-title">
            <Factory className="title-icon" size={40} />
            Quản Lý Nhà Máy Điện
          </h1>
        </header>

        <div className="victory-screen">
          <div className="victory-content">
            <Trophy className={`trophy-icon ${success ? 'success' : 'fail'}`} size={100} />
            <h2>{success ? 'Hoàn thành xuất sắc!' : 'Kết thúc!'}</h2>
            
            <div className="final-stats">
              <div className="final-stat">
                <span className="final-label">Điểm</span>
                <span className="final-value">{score}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Tiền còn lại</span>
                <span className="final-value">${money.toFixed(0)}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Môi trường</span>
                <span className="final-value">{environmentScore.toFixed(0)}%</span>
              </div>
            </div>

            <div className="performance-summary">
              <p>Nhà máy đã xây: {plants.length}</p>
              <p>Công suất trung bình: {powerSupply.toFixed(0)} MW</p>
              <p>CO₂ trung bình: {co2Emissions.toFixed(1)} tấn/giờ</p>
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

  // Render game screen
  return (
    <div className="power-plant-manager">
      <header className="game-header">
        <button className="back-button" onClick={returnToMenu}>
          <Home size={20} />
          <span>Menu</span>
        </button>
        <h1 className="game-title">
          <Factory className="title-icon" size={40} />
          Quản Lý Nhà Máy Điện - Cấp độ {selectedLevel}
        </h1>
      </header>

      <div className="game-screen">
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Điểm</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Tiền</span>
            <span className="stat-value">${money.toFixed(0)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Giờ</span>
            <span className="stat-value">{getGameHour()}:00</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Thời gian</span>
            <span className="stat-value">{formatTime(timeLeft)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">CO₂</span>
            <span className="stat-value">{co2Emissions.toFixed(1)} t/h</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Môi trường</span>
            <span className={`stat-value ${environmentScore < 30 ? 'danger' : environmentScore < 60 ? 'warning' : ''}`}>
              {environmentScore.toFixed(0)}%
            </span>
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
            <div className="build-menu">
              <h3>🏗️ Xây dựng nhà máy</h3>
              <div className="plant-list">
                {plantTypes
                  .filter(pt => currentLevel.allowedPlants.includes(pt.id))
                  .map(plantType => (
                    <div key={plantType.id} className="plant-option">
                      <div className="plant-info">
                        <div className="plant-name" style={{ color: plantType.color }}>
                          {plantType.name}
                        </div>
                        <div className="plant-stats">
                          <span>💰 ${plantType.cost}</span>
                          <span>⚡ {plantType.maxPower} MW</span>
                          <span>⚙️ {plantType.efficiency}%</span>
                          {plantType.renewable && <span className="renewable">♻️</span>}
                        </div>
                      </div>
                      <button
                        className="build-btn"
                        onClick={() => buildPlant(plantType.id)}
                        disabled={money < plantType.cost}
                      >
                        Xây
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="plants-control">
              <h3>⚙️ Điều khiển ({plants.length})</h3>
              <div className="plants-list">
                {plants.map(plant => {
                  const plantType = plantTypes.find(pt => pt.id === plant.type);
                  return (
                    <div key={plant.id} className="plant-control-item">
                      <div className="plant-control-info">
                        <span className="plant-control-name">{plantType.name}</span>
                        <span className="plant-control-status">
                          {plant.status === 'building' ? '🏗️ Đang xây' : '✅ Hoạt động'}
                        </span>
                      </div>
                      {plant.status === 'active' && (
                        <div className="power-controls">
                          <button onClick={() => adjustPower(plant.id, -10)}>-10%</button>
                          <span className="power-display">{plant.powerLevel}%</span>
                          <button onClick={() => adjustPower(plant.id, 10)}>+10%</button>
                          <button className="remove-btn" onClick={() => removePlant(plant.id)}>✖</button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {plants.length === 0 && (
                  <p className="no-plants">Chưa có nhà máy. Hãy xây dựng!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerPlantManager;
