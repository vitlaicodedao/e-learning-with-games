import React, { useState, useEffect, useRef } from 'react';
import { Home, Play, RotateCw, Trophy, Lightbulb, Home as HouseIcon } from 'lucide-react';
import './EnergyConservationHero.css';

/**
 * Energy Conservation Hero - Grade 9 Physics Game
 * Learn about energy conservation in daily life
 * Physics: Energy consumption, power efficiency, energy saving
 */

const EnergyConservationHero = () => {
  const canvasRef = useRef(null);

  const [gameState, setGameState] = useState('menu');
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Game variables
  const [score, setScore] = useState(0);
  const [energySaved, setEnergySaved] = useState(0); // kWh
  const [moneySaved, setMoneySaved] = useState(0); // VND
  const [timeLeft, setTimeLeft] = useState(180);
  const [currentMonth, setCurrentMonth] = useState(1);

  // Household appliances
  const [appliances, setAppliances] = useState([]);
  const [selectedAppliance, setSelectedAppliance] = useState(null);

  // Target
  const [targetSaving, setTargetSaving] = useState(0);

  // Appliance types with power consumption
  const applianceTypes = [
    {
      id: 'incandescent',
      name: 'Bóng đèn sợi đốt',
      category: 'lighting',
      power: 60, // Watts
      usage: 5, // hours per day
      x: 150, y: 150,
      color: '#fbbf24',
      alternatives: ['led']
    },
    {
      id: 'led',
      name: 'Đèn LED',
      category: 'lighting',
      power: 10,
      usage: 5,
      x: 250, y: 150,
      color: '#10b981',
      alternatives: []
    },
    {
      id: 'old-ac',
      name: 'Điều hòa cũ',
      category: 'cooling',
      power: 2000,
      usage: 8,
      x: 400, y: 150,
      color: '#ef4444',
      alternatives: ['inverter-ac']
    },
    {
      id: 'inverter-ac',
      name: 'Điều hòa Inverter',
      category: 'cooling',
      power: 1200,
      usage: 8,
      x: 550, y: 150,
      color: '#3b82f6',
      alternatives: []
    },
    {
      id: 'old-fridge',
      name: 'Tủ lạnh cũ',
      category: 'cooling',
      power: 200,
      usage: 24,
      x: 150, y: 300,
      color: '#f59e0b',
      alternatives: ['efficient-fridge']
    },
    {
      id: 'efficient-fridge',
      name: 'Tủ lạnh tiết kiệm',
      category: 'cooling',
      power: 100,
      usage: 24,
      x: 250, y: 300,
      color: '#06b6d4',
      alternatives: []
    },
    {
      id: 'old-tv',
      name: 'TV CRT',
      category: 'entertainment',
      power: 150,
      usage: 4,
      x: 400, y: 300,
      color: '#9ca3af',
      alternatives: ['led-tv']
    },
    {
      id: 'led-tv',
      name: 'TV LED',
      category: 'entertainment',
      power: 60,
      usage: 4,
      x: 550, y: 300,
      color: '#8b5cf6',
      alternatives: []
    },
    {
      id: 'desktop',
      name: 'Máy tính để bàn',
      category: 'electronics',
      power: 200,
      usage: 6,
      x: 150, y: 450,
      color: '#6b7280',
      alternatives: ['laptop']
    },
    {
      id: 'laptop',
      name: 'Laptop',
      category: 'electronics',
      power: 50,
      usage: 6,
      x: 250, y: 450,
      color: '#14b8a6',
      alternatives: []
    }
  ];

  // Level configurations
  const levels = [
    {
      id: 1,
      name: 'Cơ bản - Thay đổi đèn',
      description: 'Học cách tiết kiệm năng lượng với đèn',
      duration: 180,
      targetSaving: 50, // kWh per month
      startAppliances: ['incandescent', 'incandescent', 'incandescent'],
      allowedAppliances: ['incandescent', 'led']
    },
    {
      id: 2,
      name: 'Trung bình - Điều hòa',
      description: 'Tối ưu hóa hệ thống làm mát',
      duration: 240,
      targetSaving: 200,
      startAppliances: ['incandescent', 'old-ac', 'old-fridge'],
      allowedAppliances: ['incandescent', 'led', 'old-ac', 'inverter-ac', 'old-fridge', 'efficient-fridge']
    },
    {
      id: 3,
      name: 'Nâng cao - Toàn nhà',
      description: 'Tiết kiệm năng lượng cho cả gia đình',
      duration: 300,
      targetSaving: 400,
      startAppliances: ['incandescent', 'old-ac', 'old-fridge', 'old-tv', 'desktop'],
      allowedAppliances: ['incandescent', 'led', 'old-ac', 'inverter-ac', 'old-fridge', 'efficient-fridge', 'old-tv', 'led-tv', 'desktop', 'laptop']
    },
    {
      id: 4,
      name: 'Chuyên gia - Tối ưu hoàn toàn',
      description: 'Tiết kiệm tối đa năng lượng',
      duration: 360,
      targetSaving: 600,
      startAppliances: ['incandescent', 'incandescent', 'old-ac', 'old-ac', 'old-fridge', 'old-tv', 'desktop'],
      allowedAppliances: ['incandescent', 'led', 'old-ac', 'inverter-ac', 'old-fridge', 'efficient-fridge', 'old-tv', 'led-tv', 'desktop', 'laptop']
    }
  ];

  const currentLevel = levels[selectedLevel - 1];

  // Calculate energy consumption
  const calculateConsumption = (applianceId) => {
    const appType = applianceTypes.find(at => at.id === applianceId);
    if (!appType) return 0;
    // Energy (kWh/month) = Power (kW) × Usage (hours/day) × 30 days
    return (appType.power / 1000) * appType.usage * 30;
  };

  const calculateTotalConsumption = () => {
    return appliances.reduce((sum, app) => sum + calculateConsumption(app.id), 0);
  };

  const calculateMonthlyCost = (consumption) => {
    // Simplified tiered pricing (VND per kWh)
    // 0-50 kWh: 1,678
    // 51-100 kWh: 1,734
    // 101-200 kWh: 2,014
    // 201-300 kWh: 2,536
    // 301-400 kWh: 2,834
    // >400 kWh: 2,927
    
    let cost = 0;
    let remaining = consumption;
    
    if (remaining <= 50) {
      cost = remaining * 1678;
    } else {
      cost += 50 * 1678;
      remaining -= 50;
      
      if (remaining <= 50) {
        cost += remaining * 1734;
      } else {
        cost += 50 * 1734;
        remaining -= 50;
        
        if (remaining <= 100) {
          cost += remaining * 2014;
        } else {
          cost += 100 * 2014;
          remaining -= 100;
          
          if (remaining <= 100) {
            cost += remaining * 2536;
          } else {
            cost += 100 * 2536;
            remaining -= 100;
            
            if (remaining <= 100) {
              cost += remaining * 2834;
            } else {
              cost += 100 * 2834;
              remaining -= 100;
              cost += remaining * 2927;
            }
          }
        }
      }
    }
    
    return Math.round(cost);
  };

  // Initialize appliances
  useEffect(() => {
    if (gameState === 'playing' && appliances.length === 0) {
      const initial = currentLevel.startAppliances.map((id, index) => ({
        id: `${id}-${index}`,
        typeId: id,
        installed: true
      }));
      setAppliances(initial);
      
      // Calculate initial consumption as baseline
      const initialConsumption = initial.reduce((sum, app) => sum + calculateConsumption(app.typeId), 0);
      setTargetSaving(currentLevel.targetSaving);
    }
  }, [gameState, currentLevel]);

  // Calculate savings
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Initial consumption (before optimization)
    const initialConsumption = currentLevel.startAppliances.reduce(
      (sum, id) => sum + calculateConsumption(id),
      0
    );

    const currentConsumption = calculateTotalConsumption();
    const saved = initialConsumption - currentConsumption;
    setEnergySaved(saved);

    const initialCost = calculateMonthlyCost(initialConsumption);
    const currentCost = calculateMonthlyCost(currentConsumption);
    const costSaved = initialCost - currentCost;
    setMoneySaved(costSaved);

    // Score based on savings
    if (saved > 0) {
      setScore(Math.floor(saved * 10 + costSaved / 100));
    }
  }, [appliances, gameState, currentLevel]);

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

    // Clear canvas
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);

    if (gameState === 'playing') {
      drawHouse(ctx, width, height);
      drawAppliances(ctx);
      drawEnergyMeter(ctx, width, height);
    }
  }, [appliances, selectedAppliance, gameState]);

  const drawHouse = (ctx, width, height) => {
    // House outline
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 650, 450);

    // Room dividers
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(700, 250);
    ctx.moveTo(350, 50);
    ctx.lineTo(350, 500);
    ctx.stroke();
    ctx.setLineDash([]);

    // Room labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Phòng khách', 200, 80);
    ctx.fillText('Phòng ngủ', 525, 80);
    ctx.fillText('Bếp', 200, 280);
    ctx.fillText('Phòng làm việc', 525, 280);
  };

  const drawAppliances = (ctx) => {
    appliances.forEach(app => {
      const appType = applianceTypes.find(at => at.id === app.typeId);
      if (!appType || !app.installed) return;

      const isSelected = selectedAppliance?.id === app.id;
      
      // Appliance icon (simplified rectangle with label)
      ctx.fillStyle = appType.color;
      if (isSelected) {
        ctx.shadowColor = appType.color;
        ctx.shadowBlur = 15;
      }
      ctx.fillRect(appType.x - 30, appType.y - 30, 60, 60);
      ctx.shadowBlur = 0;

      // Power indicator
      const consumption = calculateConsumption(appType.id);
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${appType.power}W`, appType.x, appType.y);

      // Name
      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.fillText(appType.name, appType.x, appType.y + 45);

      // Monthly consumption
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`${consumption.toFixed(1)} kWh/tháng`, appType.x, appType.y + 58);

      // Selection indicator
      if (isSelected) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.strokeRect(appType.x - 35, appType.y - 35, 70, 70);
      }
    });
  };

  const drawEnergyMeter = (ctx, width, height) => {
    const meterX = 50;
    const meterY = height - 150;
    const meterWidth = 200;
    const meterHeight = 120;

    // Meter background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(meterX, meterY, meterWidth, meterHeight);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.strokeRect(meterX, meterY, meterWidth, meterHeight);

    // Title
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Đồng hồ điện', meterX + meterWidth / 2, meterY + 25);

    // Consumption
    const totalConsumption = calculateTotalConsumption();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`${totalConsumption.toFixed(1)}`, meterX + meterWidth / 2, meterY + 60);
    
    ctx.font = '12px Arial';
    ctx.fillText('kWh/tháng', meterX + meterWidth / 2, meterY + 80);

    // Cost
    const cost = calculateMonthlyCost(totalConsumption);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`${(cost / 1000).toFixed(0)}k VND`, meterX + meterWidth / 2, meterY + 105);
  };

  const selectAppliance = (applianceId) => {
    const app = appliances.find(a => a.id === applianceId);
    if (app) {
      setSelectedAppliance(app);
    }
  };

  const replaceAppliance = (newTypeId) => {
    if (!selectedAppliance) return;

    const oldType = applianceTypes.find(at => at.id === selectedAppliance.typeId);
    const newType = applianceTypes.find(at => at.id === newTypeId);
    
    if (!oldType || !newType) return;
    if (!oldType.alternatives.includes(newTypeId)) {
      alert('Không thể thay thế với thiết bị này!');
      return;
    }

    setAppliances(prev =>
      prev.map(app =>
        app.id === selectedAppliance.id
          ? { ...app, typeId: newTypeId }
          : app
      )
    );

    setSelectedAppliance(null);
  };

  const addAppliance = (typeId) => {
    if (!currentLevel.allowedAppliances.includes(typeId)) {
      alert('Thiết bị này không khả dụng ở cấp độ này!');
      return;
    }

    const newApp = {
      id: `${typeId}-${Date.now()}`,
      typeId: typeId,
      installed: true
    };

    setAppliances(prev => [...prev, newApp]);
  };

  const removeAppliance = () => {
    if (!selectedAppliance) return;

    setAppliances(prev => prev.filter(app => app.id !== selectedAppliance.id));
    setSelectedAppliance(null);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setEnergySaved(0);
    setMoneySaved(0);
    setTimeLeft(currentLevel.duration);
    setCurrentMonth(1);
    setAppliances([]);
    setSelectedAppliance(null);
  };

  const returnToMenu = () => {
    setGameState('menu');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render menu screen
  if (gameState === 'menu') {
    return (
      <div className="energy-conservation-hero">
        <header className="game-header">
          <button className="back-button" onClick={() => window.history.back()}>
            <Home size={20} />
            <span>Trang chủ</span>
          </button>
          <h1 className="game-title">
            <Lightbulb className="title-icon" size={40} />
            Tiết Kiệm Năng Lượng
          </h1>
        </header>

        <div className="menu-screen">
          <div className="menu-content">
            <Lightbulb className="menu-icon" size={80} />
            <h2>Tiết Kiệm Năng Lượng</h2>
            <p className="menu-description">
              Học cách tiết kiệm năng lượng trong sinh hoạt hàng ngày
            </p>

            <div className="theory-box">
              <h3>📚 Lý thuyết</h3>
              
              <div className="theory-section">
                <div className="theory-item">
                  <h4>⚡ Điện năng tiêu thụ</h4>
                  <p><strong>Công thức:</strong> W = P × t</p>
                  <p>W: Điện năng (kWh)</p>
                  <p>P: Công suất (kW)</p>
                  <p>t: Thời gian (giờ)</p>
                  <p><strong>Ví dụ:</strong> Bóng 60W dùng 5h/ngày = 60W × 5h × 30 ngày = 9 kWh/tháng</p>
                </div>

                <div className="theory-item">
                  <h4>💡 Thiết bị tiết kiệm</h4>
                  <p><strong>Đèn LED:</strong> Tiết kiệm 80% so với đèn sợi đốt</p>
                  <p><strong>Điều hòa Inverter:</strong> Tiết kiệm 40% so với loại thường</p>
                  <p><strong>Tủ lạnh tiết kiệm:</strong> Tiết kiệm 50% so với loại cũ</p>
                  <p><strong>TV LED:</strong> Tiết kiệm 60% so với TV CRT</p>
                  <p><strong>Laptop:</strong> Tiết kiệm 75% so với máy để bàn</p>
                </div>

                <div className="theory-item">
                  <h4>💰 Tiền điện</h4>
                  <p>Bậc thang giá điện sinh hoạt:</p>
                  <p>0-50 kWh: 1,678 đ/kWh</p>
                  <p>51-100 kWh: 1,734 đ/kWh</p>
                  <p>101-200 kWh: 2,014 đ/kWh</p>
                  <p>201-300 kWh: 2,536 đ/kWh</p>
                  <p>301-400 kWh: 2,834 đ/kWh</p>
                  <p>&gt;400 kWh: 2,927 đ/kWh</p>
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
                      🎯 Mục tiêu: Tiết kiệm {level.targetSaving} kWh/tháng
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
    const success = energySaved >= targetSaving;
    
    return (
      <div className="energy-conservation-hero">
        <header className="game-header">
          <button className="back-button" onClick={returnToMenu}>
            <Home size={20} />
            <span>Menu</span>
          </button>
          <h1 className="game-title">
            <Lightbulb className="title-icon" size={40} />
            Tiết Kiệm Năng Lượng
          </h1>
        </header>

        <div className="victory-screen">
          <div className="victory-content">
            <Trophy className={`trophy-icon ${success ? 'success' : 'fail'}`} size={100} />
            <h2>{success ? 'Xuất sắc!' : 'Hoàn thành!'}</h2>
            
            <div className="final-stats">
              <div className="final-stat">
                <span className="final-label">Điểm</span>
                <span className="final-value">{score}</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Tiết kiệm</span>
                <span className="final-value">{energySaved.toFixed(1)} kWh</span>
              </div>
              <div className="final-stat">
                <span className="final-label">Tiền tiết kiệm</span>
                <span className="final-value">{(moneySaved / 1000).toFixed(0)}k VND</span>
              </div>
            </div>

            <div className="performance-summary">
              <h3>Kết quả</h3>
              <p>Mục tiêu: {targetSaving} kWh/tháng</p>
              <p>Đạt được: {energySaved.toFixed(1)} kWh/tháng</p>
              <p className={success ? 'success-text' : 'fail-text'}>
                {success ? '✅ Hoàn thành mục tiêu!' : '❌ Chưa đạt mục tiêu'}
              </p>
              <p className="impact-text">
                🌍 Giảm ~{(energySaved * 0.5).toFixed(1)} kg CO₂/tháng
              </p>
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
    <div className="energy-conservation-hero">
      <header className="game-header">
        <button className="back-button" onClick={returnToMenu}>
          <Home size={20} />
          <span>Menu</span>
        </button>
        <h1 className="game-title">
          <Lightbulb className="title-icon" size={40} />
          Tiết Kiệm Năng Lượng - Cấp độ {selectedLevel}
        </h1>
      </header>

      <div className="game-screen">
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Điểm</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Tiết kiệm</span>
            <span className="stat-value">{energySaved.toFixed(1)} kWh</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Tiền tiết kiệm</span>
            <span className="stat-value">{(moneySaved / 1000).toFixed(0)}k VND</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Mục tiêu</span>
            <span className="stat-value">{targetSaving} kWh</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Thời gian</span>
            <span className="stat-value">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="game-content">
          <div className="house-area">
            <canvas
              ref={canvasRef}
              width={800}
              height={550}
              className="house-canvas"
              onClick={(e) => {
                const rect = canvasRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Check if clicked on an appliance
                appliances.forEach(app => {
                  const appType = applianceTypes.find(at => at.id === app.typeId);
                  if (appType && app.installed) {
                    if (
                      x >= appType.x - 30 &&
                      x <= appType.x + 30 &&
                      y >= appType.y - 30 &&
                      y <= appType.y + 30
                    ) {
                      selectAppliance(app.id);
                    }
                  }
                });
              }}
            />
          </div>

          <div className="control-panel">
            <div className="appliance-info">
              <h3>ℹ️ Thiết bị được chọn</h3>
              {selectedAppliance ? (
                <div className="selected-appliance-details">
                  {(() => {
                    const appType = applianceTypes.find(at => at.id === selectedAppliance.typeId);
                    const consumption = calculateConsumption(selectedAppliance.typeId);
                    return (
                      <>
                        <p><strong>{appType.name}</strong></p>
                        <p>Công suất: {appType.power} W</p>
                        <p>Sử dụng: {appType.usage} giờ/ngày</p>
                        <p>Tiêu thụ: {consumption.toFixed(1)} kWh/tháng</p>
                        {appType.alternatives.length > 0 && (
                          <div className="alternatives">
                            <p><strong>Thay thế bằng:</strong></p>
                            {appType.alternatives.map(altId => {
                              const alt = applianceTypes.find(at => at.id === altId);
                              const altConsumption = calculateConsumption(altId);
                              const saving = consumption - altConsumption;
                              return (
                                <button
                                  key={altId}
                                  className="replace-btn"
                                  onClick={() => replaceAppliance(altId)}
                                >
                                  {alt.name}
                                  <br />
                                  <small>Tiết kiệm: {saving.toFixed(1)} kWh</small>
                                </button>
                              );
                            })}
                          </div>
                        )}
                        <button className="remove-btn" onClick={removeAppliance}>
                          Gỡ bỏ thiết bị
                        </button>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <p className="no-selection">Nhấp vào thiết bị trên nhà để chọn</p>
              )}
            </div>

            <div className="tips-section">
              <h3>💡 Mẹo tiết kiệm</h3>
              <ul className="tips-list">
                <li>Thay đèn sợi đốt bằng đèn LED tiết kiệm 80% điện</li>
                <li>Điều hòa Inverter tiết kiệm hơn loại thường 40%</li>
                <li>Tắt thiết bị khi không sử dụng</li>
                <li>Sử dụng thiết bị có nhãn năng lượng cao</li>
                <li>Bảo dưỡng thiết bị định kỳ</li>
              </ul>
            </div>

            <div className="progress-section">
              <h3>📊 Tiến độ</h3>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${Math.min((energySaved / targetSaving) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {energySaved.toFixed(1)} / {targetSaving} kWh 
                ({((energySaved / targetSaving) * 100).toFixed(0)}%)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyConservationHero;
